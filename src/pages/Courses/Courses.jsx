//Le Ngoc Hien
import './Courses.css'
import {currentUser} from '../../components/ConditionalUI'
import {db} from '../../../firebase.config'
import {useState,useEffect} from 'react'
import {getDocs, collection, query, where, getDoc,doc} from 'firebase/firestore'
import {listStatus} from '../Admin/CourseList/CourseList'
export default function Courses() {
    const [listCourse, setListCourse] = useState([]);
    useEffect(() => {
        const fetchListCourse = async () => {
            const list = await getListCourse();
            setListCourse(list);
            list.forEach(course => console.log(course.data()))
        }
        fetchListCourse();
    },[])
    function CourseCard({data}) {
        return <>
            <div className='courseCard'>
                <p>{data?.name}-{data?.subject?.id}</p>
            </div>
        </>
    }
    return <div className="courses-layout">
        {listCourse.map(course => {
            return <CourseCard key={course?.id} data={course?.data()}/>
        })}
    </div>
}

const getListCourse = async () => {
    const courseCollectionRef = collection(db, 'courses');
    let q = null;
    if (currentUser.role === 'admin') {
        q = courseCollectionRef;
    }
    else if (['teacher', 'student'].includes(currentUser.role)) {
        q = query(courseCollectionRef, where('status','==','waiting'))
    }
    let list = []
    if (q) {
        const querySnapshot = await getDocs(q).then(docs => {
            docs.forEach(doc => list.push(doc))
        })
    }
    return list;
}
