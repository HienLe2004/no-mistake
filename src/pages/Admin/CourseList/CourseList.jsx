//Le Ngoc Hien
import { db } from '../../../../firebase.config'
import { collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import './CourseList.css'
import CreateCourseForm from './CreateCourseForm/CreateCourseForm'
export const listStatus = {'processing':"Đang hoạt động", 'waiting':"Mở đăng ký",
                    'unpublished':"Chưa mở", 'end':"Kết thúc"}
export default function CourseList() {
    function CourseCard({ data }) {
        return <>
            <div className='courseCard'>
                <a href='/'>{data.name} - {listStatus[data.status]}</a>
            </div>
        </>
    }
    const [hitCreateCourse, setHitCreateCourse] = useState(false);
    const [listCourseData, setListCourseData] = useState([]);
    useEffect(() => {
        async function fetchListCourseData() {
            const list = await getListCourseData();
            setListCourseData(list);
        }
        fetchListCourseData();
    }, [])

    return <>
        <div className='courselist-layout showAdmin'>
            <h1>Danh sách khóa học</h1>
            <div className="courselist">
                {listCourseData.map((course) => {
                    return <CourseCard key={course.id} data={course.data()} />
                })}
            </div>
            <button className='createCourseButton'
                onClick={() => { setHitCreateCourse(!hitCreateCourse) }}
                style={{ backgroundColor: (hitCreateCourse) ? "rgb(1, 125, 213)" : "rgb(0, 70, 120)" }}>Tạo khoá học mới</button>
        </div>
        <div className="formContainer" style={{ display: (hitCreateCourse) ? "flex" : "none" }}>
            <CreateCourseForm />
        </div>
    </>
}

async function getListCourseData() {
    let list = []
    const listCourseDoc = await getDocs(collection(db, 'courses')).then((docs) => {
        docs.forEach((doc) => {
            list.push(doc);
        })
    })
    return list;
}