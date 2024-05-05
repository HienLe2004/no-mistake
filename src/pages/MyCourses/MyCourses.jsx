import { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async'
import { db, storage, auth} from '../../../firebase.config'
import { getDoc, doc, getDocs, collection} from 'firebase/firestore'
import { ref, getDownloadURL } from "firebase/storage";
import CourseImage from '../../assets/course-image.png'
import { currentUser } from '../../components/ConditionalUI'
import './MyCourses.css'

export default function MyCourses() {
    return <>
        <Helmet>
            <title>Khóa học của tôi | LMS-DEF-NM</title>
        </Helmet>
        <div className="title">Danh sách khóa học</div>
        <div className="card-around">
            <button className="card-container" onClick={getCourseList}>
                <img src={CourseImage} alt='CourseImage' className="card-img"/>
                <h1 className="card-title">course</h1>
            </button>
        </div>
    </>
}

const getCourseList = async (e) => {
    e.preventDefault();
    if (!['student', 'teacher'].includes(currentUser.role)) return;
    let listCourse = [];
    const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid)).then((doc)=>{
        doc.data().courses.forEach(course => {listCourse.push(course);getCourseDoc(course)});
    })
    console.log(listCourse);
}
const getCourseDoc = async (courseRef) => {
    console.log(courseRef);
    console.log(courseRef.id);
    const courseDoc = await getDoc(doc(db, 'courses', courseRef.id)).then((doc)=>{
        console.log(doc.data());
    })
}
