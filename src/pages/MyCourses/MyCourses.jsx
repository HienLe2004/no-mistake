import { useState, useEffect } from "react";
import { Link, Outlet, useLocation } from 'react-router-dom'
import { Helmet } from 'react-helmet-async'
import { db, storage, auth} from '../../../firebase.config'
import { getDoc, doc, getDocs, collection} from 'firebase/firestore'
import { ref, getDownloadURL } from "firebase/storage";
import CourseImage from '../../assets/course-image.png'
import { currentUser } from '../../components/ConditionalUI'
import './MyCourses.css'

export default function MyCourses() {
    const [courseList, setCourseList] = useState([]);
    const [loading, setLoading] = useState(true);
    const location = useLocation();
    useEffect(() => {
        const fetchData = async () => {
            await getCourseList().then((list) => {
                setLoading(false);
                setCourseList(list);
            })
        }
        fetchData();
    },[])
    //Course card template
    function CourseCard({courseRef}) {
        const [courseData, setCourseData] = useState();
        useEffect(() => {
            const fetchData = async () => {
                await getCourseDoc(courseRef).then((doc) => {
                    setCourseData(doc);
                })
            }
            fetchData();
        },[])
        return <button className="card-container">
            <img src={CourseImage} alt='CourseImage' className="card-img"/>
            <Link className="card-title" to={'/' + courseData?.id} relative="route">
                <h1>{courseData?.data().name}</h1>
            </Link>
        </button>
    }
    if (loading) return <h1>Đang tải...</h1>;
    return <>
        <Helmet>
            <title>Khóa học của tôi | LMS-DEF-NM</title>
        </Helmet>
        <div className="title">Danh sách khóa học</div>
        <div className="card-around">
            {courseList?.map((course, index) => {
                return <CourseCard courseRef={course}  key={course.id}/>
            })}
        </div>
        <Outlet/>
    </>
}

const getCourseList = async () => {
    if (!['student', 'teacher'].includes(currentUser.role)) return;
    let listCourse = [];
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid)).then((doc)=>{
        doc.data().courses.forEach(course => {listCourse.push(course)});
    })
    return listCourse;
}
export const getCourseDoc = async (courseRef) => {
    let cDoc = null;
    const courseDoc = await getDoc(doc(db, 'courses', courseRef.id)).then((doc)=>{
        cDoc = doc;
    })
    return cDoc;
}
