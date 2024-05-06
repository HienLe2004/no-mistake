import './Schedule.css'
import { db } from '../../../../firebase.config'
import { collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'
import ScheduleInformation from './ScheduleInformation/ScheduleInformation'
export default function Schedule() {
    function CourseCard({cid, data }) {
        return<div className='courseCard'>
            <NavLink to={cid}>
                <div>{data.name}</div>
                <div>
                    <div>Học kỳ: {data?.semester}</div>
                    <div>Số lớp: {data.classNo}</div>
                    <div>Ngày thi GK: {data.middle?.day}/{data.middle?.month}</div>
                    <div>Giờ thi GK: {data.middle?.hour}g{('0'+data.middle?.minute)?.slice(-2)}</div>
                    <div>Phòng thi GK: {data.middleRoom}</div>
                    <div>Ngày thi CK: {data.final?.day}/{data.final?.month}</div>
                    <div>Giờ thi CK: {data.final?.hour}g{('0'+data.final?.minute)?.slice(-2)}</div>
                    <div>Phòng thi CK: {data.finalRoom}</div>
                </div>
            </NavLink>
        </div>
    }
    const [listCourseData, setListCourseData] = useState([]);
    useEffect(() => {
        async function fetchListCourseData() {
            const list = await getListCourseData();
            setListCourseData(list);
        }
        fetchListCourseData();
    }, [])

    return <>
        <div className='schedule-layout showAdmin'>
            <h1>Danh sách lịch thi</h1>
            <div className="schedule">
                {listCourseData.map((course) => {
                    return <CourseCard key={course.id}
                                cid={course.id} data={course.data()} />
                })}
            </div>
            <Outlet/>
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