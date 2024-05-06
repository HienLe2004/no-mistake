import './CourseData.css'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { auth, db, storage } from '../../../../firebase.config'
import { getDoc, doc, updateDoc, deleteDoc, collection, query, orderBy, getDocs, addDoc} from 'firebase/firestore'
import { ref, uploadBytes, listAll, getDownloadURL, deleteObject } from 'firebase/storage'
import { currentUser } from '../../../components/ConditionalUI'
export default function CourseData() {
    const {cid} = useParams();
    const [courseDoc, setCourseDoc] = useState();
    const [courseData, setCourseData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [reload, setReload] = useState(true);
    const [teacher, setTeacher] = useState();
    const [showMarkTable, setShowMarkTable] = useState(false);
    const [students, setStudents] = useState([]);
    const [studentMarks, setStudentMarks] = useState([]);
    const [studentMarkUpdate, setStudentMarkUpdate] = useState([]);
    const [subjectMark, setSubjectMark] = useState({});
    const [propsOrder, setPropsOrder] = useState([]);
    //Get course's data 
    useEffect(() => {
        const fetchData = async () => {
            await getDoc(doc(db,'courses',cid)).then(async (courseDoc) => {
                setCourseDoc(courseDoc);
                let sList = [], smList = [], smuList = [];
                await courseDoc.data().students.forEach(student => {
                    getDoc(student).then(studentDoc => {
                        sList.push(studentDoc)
                        getDoc(doc(db, `users/${studentDoc.id}/mark/${cid}`)).then(markDoc => {
                            smList.push(markDoc.data());
                            smuList.push(markDoc.data().mark);
                        })
                    })
                });
                setStudentMarks(smList);
                setStudentMarkUpdate(smuList);
                setStudents(sList);
                await getDoc(courseDoc.data().teacher).then(teacherDoc => {
                    setTeacher(teacherDoc);
                })
                let propList = [];
                await getDoc(courseDoc.data().subject).then(subjectDoc => {
                    subjectDoc.data().props.map((prop,index) => {
                        setSubjectMark((prev) => ({
                            ...prev,
                            [prop]: subjectDoc.data().coefficients[index]
                        }));
                        propList.push(prop);
                    });
                })
                setPropsOrder(propList);
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
    },[cid, reload])
    //Course document section template 
    function CourseSection({sectionDoc}) {
        const [showSection, setShowSection] = useState(false);
        const [showEdit, setShowEdit] = useState(false);
        const [showAddDocument, setShowAddDocument] = useState(false);
        const [showDeleteDocument, setShowDeleteDocument] = useState(false);
        const [showedTitle, setShowedTitle] = useState(sectionDoc?.data().title);
        const [showedDescription, setShowedDescription] = useState(sectionDoc?.data().description);
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
        const toggleDeleteDocument = () => {
            setShowDeleteDocument(!showDeleteDocument);
        }
        //Function handles uploading file
        const uploadFile = () => {
            if (auth.currentUser.uid !== teacher.id && currentUser.role !== 'admin') {
                alert("Bạn không có quyền tải lên tệp này!\n");
                return;
            }
            if (fileUpload === null) {
                alert("Chưa có tệp nào được chọn!\n");
                return;
            }
            const fileRef = ref(storage, `${cid}/${sectionDoc?.id}/teacher/${fileUpload.name}`);
            uploadBytes(fileRef, fileUpload).then(() => {
                alert("Tải tệp lên thành công!\n");
                setLoading(true);
                setReload(!reload);
            })
        }
        //Function handles deleting file
        const deleteFile = (fileName) => {
            if (auth.currentUser.uid !== teacher.id && currentUser.role !== 'admin') {
                alert("Bạn không có quyền xóa tệp này!\n");
                return;
            }
            deleteObject(ref(storage, `${cid}/${sectionDoc?.id}/teacher/${fileName}`)).then(() => {
                alert("Xóa tệp thành công!\n");
                setLoading(true);
                setReload(!reload);
            })
        }
        //Get files of section
        const fileListRef = ref(storage, `${cid}/${sectionDoc?.id}/teacher/`);
        useEffect(() => {
            listAll(fileListRef).then(async (list) => {
                let fList = [];
                await list.items.forEach(item => {
                    getDownloadURL(item).then((url) => {
                        //console.log(item.name);
                        fList.push({url:url, name:item.name});
                    })
                })
                setFileList(fList);
            })
        },[])
        //Functions handles deleting section
        const deleteSection = () => {
            if (auth.currentUser.uid !== teacher.id && currentUser.role !== 'admin') {
                alert("Bạn không có quyền xóa mục này!\n");
                return;
            }
            fileList.forEach(file => deleteFile(file.name));
            deleteDoc(doc(db, `courses/${cid}/data/${sectionDoc?.id}`)).then(() => {
                alert("Xóa mục thành công!");
                setLoading(true);
                setReload(!reload);
            })
        }
        //Main course section
        return <div className="courseSection">
            <div className="sectionHeader">
                <p className='sectionTitle' onClick={toggleSection}>{showedTitle}</p>
                <div className="sectionButton "style={{display:(auth.currentUser.uid === teacher.id)?"flex":"none"}}>
                    <button className='editButton' onClick={toggleEdit}>
                        Chỉnh sửa
                    </button>
                    <button className='addDocButton' onClick={toggleAddDocument}>
                        Thêm học liệu
                    </button>
                    <button className='deleteDocButton' onClick={toggleDeleteDocument}>
                        Xóa mục
                    </button>
                </div>
            </div>
            <div className="sectionDescription" style={{display:(showSection)?"flex":"none"}}>
                <p className='description'>{showedDescription}</p>
                {fileList.map((file,index) => {
                    return <div className="documentLink">
                        <a href={file.url} key={index}>{file.name}</a>
                        <button onClick={()=>{deleteFile(file.name)}}
                            style={{display:(auth.currentUser.uid === teacher.id)?"flex":"none"}}>Xóa</button>
                    </div>
                })}
            </div>
            <div className="editForm" style={{display:(showEdit)?"flex":"none"}}>
                <CourseEditForm sectionDoc={sectionDoc}/>
            </div>
            <div className="addDocumentForm" style={{display:(showAddDocument)?"flex":"none"}}>
                <input type='file' onChange={(e) => setFileUpload(e.target.files[0])}/>
                <button onClick={uploadFile}>Tải lên</button>
            </div>
            <div className="deleteDocument" style={{display:(showDeleteDocument)?"flex":"none"}}>
                <p>Bạn có chắc chắn muốn xóa mục này không?</p>
                <div className="confirmButton">
                    <button style={{backgroundColor:"red"}}
                        onClick={toggleDeleteDocument}>Không</button>
                    <button style={{backgroundColor:"green"}}
                        onClick={deleteSection}>Có</button> 
                </div>
            </div>
        </div>

        //Course edit form
        function CourseEditForm({sectionDoc}) {
            const [title, setTitle] = useState(sectionDoc?.data().title);
            const [description, setDescription] = useState(sectionDoc?.data().description);
            const updateCourse = async () => {
                if (auth.currentUser.uid !== teacher.id && currentUser.role !== 'admin') {
                    alert("Bạn không có quyền chỉnh sửa nội dung này!");
                    return;
                }
                const docRef = doc(db, sectionDoc?.ref.path);
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
    
    //Functions handles creating section
    const createSection = () => {
        if (auth.currentUser.uid !== teacher.id && currentUser.role !== 'admin') {
            alert("Bạn không có quyền tạo mục này!\n");
            return;
        }
        const lowestOrder = courseData[courseData.length - 1]?.data().order;
        //console.log(lowestOrder);
        let list = courseData;
        addDoc(collection(db, `courses/${cid}/data/`), {
            title: '',
            description: '',
            order: isNaN(lowestOrder) ? 0 : (1 + lowestOrder)
        }).then((docRef) => {
            list.push(docRef)
            setCourseData(list);
            alert("Tạo mục thành công!");
            setLoading(true);
            setReload(!reload);
        })
    }
    //Function handles showing mark table
    const toggleShowMarkTable = () => {
        if (auth.currentUser.uid !== teacher.id) return;
        setShowMarkTable(!showMarkTable);
    }
    //Function handles updating mark
    const updateMark = () => {
        //console.log(studentMarkUpdate);
        let errorList = [];
        students.forEach((student, index) => {
            //console.log(student.id + " " + index);
            //console.log(studentMarkUpdate[index]);
            let finalR = null, temp = 0, qualifiedR = null;
            for (const prop of Object.keys(studentMarkUpdate[index])) {
                if (studentMarkUpdate[index][prop] == null) {
                    temp =-1;
                    break;
                }
                temp += studentMarkUpdate[index][prop] * subjectMark[prop];
            }
            finalR = (temp === -1)?null:Number((temp).toFixed(2));
            if (isNaN(finalR)) {
                finalR = null;
                qualifiedR = null;
            }
            else {
                qualifiedR = (finalR >= 4);
            }
            updateDoc(doc(db, `users/${student.id}/mark/${cid}`), {
                final: finalR,
                mark: studentMarkUpdate[index],
                qualified: qualifiedR
            }).catch((err) => {errorList.push(err.message)}); 
        })
        if (errorList.length == 0) {
            setLoading(true);
            setReload(!reload);
            alert("Cập nhật điểm thành công!\n");
        }
    }
    //Function handles change of mark
    const handleChange = async (e) => {
        //console.log(e.target.className+" "+ e.target.name + " " + e.target.value);
        let stuMark = studentMarkUpdate;
        stuMark[e.target.className][e.target.name] = parseFloat(e.target.value);
        setStudentMarkUpdate(stuMark);
    }
    if (loading) return <h1 className='waitingPage'>Đang tải...</h1>;
    return <div className="courseDoc">
        <h1 className="title">
            {courseDoc.data().name}_{teacher?.data().name}_{courseDoc.data().classNo}_{courseDoc.data().semester}
        </h1>
        <div className="courseData">
            {courseData.map(course => {
                return <CourseSection key={course.id} sectionDoc={course}/>
            })}
        </div>
        <button className='createSection'
            style={{display:(auth.currentUser.uid === teacher.id)?"flex":"none"}}
            onClick={createSection}>
                Tạo mục mới
        </button>
        <button className='updateMark'
            style={{display:(auth.currentUser.uid === teacher.id)?"flex":"none"}}
            onClick={toggleShowMarkTable}>
                Cập nhật điểm
        </button>
        <div className="markTable"
            style={{display:(showMarkTable)?"block":"none"}}>
            <h1 className="title">
                Bảng điểm
            </h1>
            <table>
                <thead>
                    <tr>
                    <th>MSSV</th>
                    <th>Họ và tên</th>
                    <th>Email</th>
                    {Object.keys(subjectMark).map(prop => {
                        return <th key={prop}>{prop} ({subjectMark[prop]})</th>
                    })}
                    <th>Tổng kết</th>
                    </tr>
                </thead>
                <tbody>
                    {students.map((student,index) => {
                        return <tr key={index}>
                            <td>{student.data().roleID}</td>
                            <td>{student.data().name}</td>
                            <td>{student.data().email}</td>
                            {propsOrder.map((prop,i) => {
                                return <td key={i} style={{padding:"0"}}>
                                <input className={index} type='number'
                                    defaultValue={studentMarks[index]['mark'][prop]?.toString()}
                                    style={{width:"100%",boxSizing:"border-box",border:"none",padding:"10px"}}
                                    name={prop} onChange={handleChange}/>
                                </td>
                            })}
                            <td>{studentMarks[index]['final']}</td>
                        </tr>
                    })}
                </tbody>
            </table>
            <div className="updateButton">
                <button className='updateMarkButton' onClick={updateMark}>Cập nhật</button>
            </div>
        </div>
    </div>
}