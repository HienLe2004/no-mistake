import './CourseData.css'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { auth, db, storage } from '../../../../firebase.config'
import { getDoc, doc, updateDoc, setDoc, collection, query, orderBy, getDocs} from 'firebase/firestore'
import { ref, uploadBytes, listAll, getDownloadURL } from 'firebase/storage'
import { currentUser } from '../../../components/ConditionalUI'
export default function CourseData() {
    const {cid} = useParams();
    const [courseDoc, setCourseDoc] = useState();
    const [courseData, setCourseData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [teacher, setTeacher] = useState();
    useEffect(() => {
        const fetchData = async () => {
            await getDoc(doc(db,'courses',cid)).then(async (doc) => {
                setCourseDoc(doc); 
                await getDoc(doc.data().teacher).then(teacherDoc => {
                    setTeacher(teacherDoc);
                })
                await getDocs(query(collection(db,'courses/'+cid+'/data'), orderBy('order'))).then(docs => {
                    let list = [];
                    docs.forEach(doc => list.push(doc));
                    setCourseData(list);
                    setLoading(false);
                    import('../../../components/ConditionalUI');
                })  
            })
        }
        fetchData();
    },[cid])
    //Course document section template 
    function CourseSection({sectionDoc}) {
        const [showSection, setShowSection] = useState(false);
        const [showEdit, setShowEdit] = useState(false);
        const [showAddDocument, setShowAddDocument] = useState(false);
        const [showedTitle, setShowedTitle] = useState(sectionDoc.data().title);
        const [showedDescription, setShowedDescription] = useState(sectionDoc.data().description);
        const [fileUpload, setFileUpload] = useState(null);
        const [fileList, setFileList] = useState([]);
        //Function handle toggling
        const toggleSection = () => {
            setShowSection(!showSection);
        }
        const toggleEdit = () => {
            setShowEdit(!showEdit);
        }
        const toggleAddDocument = () => {
            setShowAddDocument(!showAddDocument);
        }
        //Function handles uploading file
        const uploadFile = () => {
            if (auth.currentUser.uid !== teacher.id && currentUser.role !== 'admin') {
                alert("Bạn không có tải lên nội dung này!\n");
                return;
            }
            if (fileUpload === null) {
                alert("Chưa có tệp nào được chọn!\n");
                return;
            }
            const fileRef = ref(storage, `${cid}/${sectionDoc.id}/teacher/${fileUpload.name}`);
            uploadBytes(fileRef, fileUpload).then(() => {
                alert("Tải tệp lên thành công!\n");
            })
        }
        //Get files of section
        const fileListRef = ref(storage, `${cid}/${sectionDoc.id}/teacher/`);
        useEffect(() => {
            listAll(fileListRef).then(async (list) => {
                let fList = [];
                await list.items.forEach(item => {
                    getDownloadURL(item).then((url) => {
                        console.log(item.name);
                        fList.push({url:url, name:item.name});
                    })
                })
                setFileList(fList);
            })
        },[])
        //Main course section
        return <div className="courseSection">
            <div className="sectionButton "style={{display:(auth.currentUser.uid === teacher.id)?"flex":"none"}}>
                <button className='editButton' onClick={toggleEdit}>
                    Chỉnh sửa
                </button>
                <button className='addDocButton' onClick={toggleAddDocument}>
                    Thêm học liệu
                </button>
            </div>
            <p className='sectionTitle' onClick={toggleSection}>{showedTitle}</p>
            <div className="sectionDescription" style={{display:(showSection)?"flex":"none"}}>
                <p className='description'>{showedDescription}</p>
                {fileList.map((file,index) => {
                    return <a href={file.url} key={index}>{file.name}</a>
                })}
            </div>
            <div className="editForm" style={{display:(showEdit)?"flex":"none"}}>
                <CourseEditForm sectionDoc={sectionDoc}/>
            </div>
            <div className="addDocumentForm" style={{display:(showAddDocument)?"flex":"none"}}>
                <input type='file' onChange={(e) => setFileUpload(e.target.files[0])}/>
                <button onClick={uploadFile}>Tải lên</button>
            </div>
        </div>

        //Course edit form
        function CourseEditForm({sectionDoc}) {
            const [title, setTitle] = useState(sectionDoc.data().title);
            const [description, setDescription] = useState(sectionDoc.data().description);
            const updateCourse = async () => {
                if (auth.currentUser.uid !== teacher.id && currentUser.role !== 'admin') {
                    alert("Bạn không có quyền chỉnh sửa nội dung này!");
                    return;
                }
                const docRef = doc(db, sectionDoc.ref.path);
                await updateDoc(docRef, {
                    title: title,
                    description: description
                }).then(() => {
                    alert("Cập nhật thành công!\n");
                    setShowedTitle(title),
                    setShowedDescription(description);
                })
            }
            return <div className="courseEditForm">
                <label className='sectionTitle'>Tên mục: 
                    <input type='text' defaultValue={showedTitle}
                        onChange={(e) => {setTitle(e.target.value)}}/>
                </label>
                <label className='sectionDescription'>Mô tả mục: 
                    <input type='text' defaultValue={showedDescription}
                        onChange={(e) => {setDescription(e.target.value)}}/>
                </label>
                <button className='updateButton' onClick={updateCourse}>Cập nhật</button>
            </div>
        }
    }
    
    if (loading) return <h1>Đang tải...</h1>;
    return <div className="courseDoc">
        <h1 className="title">
            {courseDoc.data().name}_{teacher?.data().name}_{courseDoc.data().classNo}_{courseDoc.data().semester}
        </h1>
        <div className="courseData">
            {courseData.map(course => {
                return <CourseSection key={course.id} sectionDoc={course}/>
            })}
        </div>
    </div>
}