//Le Ngoc Hien
import './Courses.css'
import {currentUser} from '../../components/ConditionalUI'
import {db} from '../../../firebase.config'
import {useState,useEffect} from 'react'
import {getDocs, collection, query, where, getDoc,doc} from 'firebase/firestore'
import {listStatus} from '../Admin/CourseList/CourseList'
export default function Courses() {
    const [listCourse, setListCourse] = useState([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchListCourse = async () => {
            const list = await getListCourse();
            setListCourse(list);
        }
        fetchListCourse().then(() => setLoading(false));
    },[])

    function CourseCard({data}) {
        let listClass = data?.classStart.toString();
        for (let i = 1; i < data?.classNum; i++) {
            listClass += '-' + (i + data?.classStart).toString();
        }
        let listWeek = "";
        const startWeek = data?.week[0];
        const endWeek = data?.week[data?.week?.length - 1];
        for (let i = startWeek; i <= endWeek; i++) {
            if (i === startWeek) listWeek += i;
            else if (data?.week?.includes(i)) listWeek += ('|'+i);
            else listWeek += ("|-");
        }
        const [teacher, setTeacher] = useState("NULL");
        if (data?.teacher != null) {
            getTeacherName(data.teacher).then((name) => {
                console.log("name = " + name);
                setTeacher(name);
            })
        }
        return <>
            <div className='courseCard'>
                <p>{data?.name}-{data?.subject?.id}</p>
                <p>Lớp: {data?.classNo}</p>
                <p>Ngày học: {data?.day}</p>
                <p>Tiết học: {listClass}</p>
                <p>Phòng học: {data?.room}</p>
                <p>Tuần học: {listWeek}</p>
                <p>Trạng thái: {listStatus[data?.status]}</p>
                <p>Số lượng sinh viên đăng ký: {data?.students?.length}/{data?.capacity}</p>
                <p>Giảng viên đăng ký: {teacher}</p>
            </div>
        </>
    }
    if (loading) return;
    return <div className="courses-layout">
        <h1>Danh sách các khóa học</h1>
        <div className="courseCards">
            {listCourse.map(course => {
                return <CourseCard key={course?.id} data={course?.data()}/>
            })}
        </div>
    </div>
}
//Function gets list of course (waiting courses for teacher/student
//  and all of courses for admin)
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

const getTeacherName = async (teacherDocRef) => {
    const teacherDoc = await getDoc(teacherDocRef);
    return teacherDoc.data().name;
}
