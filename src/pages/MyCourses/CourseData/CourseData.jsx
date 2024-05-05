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
        return <div className="courseSection">
            <h2>{doc.data().title}</h2>
            <p>{doc.data().description}</p>
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