import { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async'
import CourseList from './CourseList/CourseList'
import { db } from '../../../firebase.config'
import { getDoc, doc, } from 'firebase/firestore'
import { auth } from '../../../firebase.config'

let nextid = 0;
export default function MyCourses() {
    const [courses, setCourse] = useState([]);
    useEffect(() => {
        const unsub = auth.onAuthStateChanged((authObj) => {
            unsub();
            if (authObj) {
                const fetchdata = async () => {
                    const docRef = doc(db, "users", authObj.uid);
                    const docSnap = await getDoc(docRef);
                    let data = docSnap.data();
                    data.courses.forEach(ref => {
                        const fetchcoure = async () => {
                            const files = await getDoc(ref);
                            let course = files.data();
                            setCourse([...courses, { id: nextid++, name: course.name }]);
                        }
                        fetchcoure();
                    });
                }
                fetchdata();
            } else { console.log("User not logged in") }
        });
    }, []);
    return <>
        <Helmet>
            <title>Khóa học của tôi | LMS-DEF-NM</title>
        </Helmet>
        {courses ? <CourseList courses={courses} /> : null}
        {courses?<CourseList courses={courses}/>:null}
    </>
}

