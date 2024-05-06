import './CourseData.css'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { auth, db } from '../../../../firebase.config'
import { getDoc, doc, updateDoc, setDoc, collection, query, orderBy, getDocs} from 'firebase/firestore'
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
                })  
            })
               
        }
        fetchData();
    },[cid])
    //Course document section template 
    function CourseSection({doc}) {
        const [showSection, setShowSection] = useState(false);
        const [showEdit, setShowEdit] = useState(false);
        const toggleSection = () => {
            setShowSection(!showSection);
        }
        const toggleEdit = () => {
            setShowEdit(!showEdit);
        }
        return <div className="courseSection">
            <div className="sectionButton">
                <button className='editButton' onClick={toggleEdit}>Chỉnh sửa</button>
            </div>
            <p className='sectionTitle' onClick={toggleSection}>{doc.data().title}</p>
            <p className='sectionDescription' 
                style={{display:(showSection)?"flex":"none"}}>{doc.data().description}
            </p>
            <div className="editForm" style={{display:(showEdit)?"flex":"none"}}>
                <CourseEditForm sectionDoc={doc}/>
            </div>
        </div>
    }
    //Course edit form
    function CourseEditForm({sectionDoc}) {
        const [title, setTitle] = useState(sectionDoc.data().title);
        const [description, setDescription] = useState(sectionDoc.data().description);
        const updateCourse = async () => {
            console.log(title + ' ' + description);
            const docRef = doc(db, sectionDoc.ref.path);
            await updateDoc(docRef, {
                title: title,
                description: description
            }).then(() => {
                alert("Cập nhật thành công!\n");
            })
        }
        return <div className="courseEditForm">
            <label className='sectionTitle'>Tên mục: 
                <input type='text' defaultValue={sectionDoc.data().title}
                    onChange={(e) => {setTitle(e.target.value)}}/>
            </label>
            <label className='sectionDescription'>Mô tả mục: 
                <input type='text' defaultValue={sectionDoc.data().description}
                    onChange={(e) => {setDescription(e.target.value)}}/>
            </label>
            <button className='updateButton' onClick={updateCourse}>Cập nhật</button>
        </div>
    }
    if (loading) return <h1>Đang tải...</h1>;
    return <div className="courseDoc">
        <h1 className="title">
            {courseDoc.data().name}_{teacher?.data().name}_{courseDoc.data().classNo}_{courseDoc.data().semester}
        </h1>
        <div className="courseData">
            {courseData.map(course => {
                return <CourseSection key={course.id} doc={course}/>
            })}
        </div>
    </div>
}