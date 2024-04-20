<<<<<<< HEAD
import { Helmet } from 'react-helmet-async'
import CourseList from './CourseList/CourseList'
// Data for test UI
const courses = [
    { key: 100101, name: "Giải tích 1", teacher: "Nguyễn Văn A" },
    { key: 100102, name: "Cấu trúc dữ liệu và giải thuật", teacher: "Nguyễn Văn B" },
    { key: 100103, name: "Lập trình nâng cao", teacher: "Nguyễn Văn C" },
]

export default function MyCourses() {

=======
import { useState, useEffect } from "react";
import {Helmet} from 'react-helmet-async'
import CourseList from './CourseList/CourseList'
import {db} from '../../../firebase.config'
import { getDoc, doc, } from 'firebase/firestore'
import { auth } from '../../../firebase.config'

let nextid = 0;
export default function MyCourses() {
    const [courses, setCourse] = useState([]);
    useEffect(() => {
        const unsub = auth.onAuthStateChanged((authObj) => {
            unsub();
            if (authObj) {
                const fetchdata = async() => {
                    const docRef = doc(db, "users", authObj.uid);
                    const docSnap = await getDoc(docRef);
                    let data = docSnap.data();
                    data.courses.forEach(ref => {
                        const fetchcoure = async() => {
                            const files = await getDoc(ref);
                            let course = files.data();
                            setCourse([...courses, { id: nextid++, name: course.name }]);
                        }
                        fetchcoure();
                    });
                }
                fetchdata();
            } else {console.log("User not logged in")}
        });
    }, []);
>>>>>>> 98c2716b4f048e9e69c14c808f3e46e34686acfe
    return <>
        <Helmet>
            <title>Khóa học của tôi | LMS-DEF-NM</title>
        </Helmet>
        {courses ? <CourseList courses={courses} /> : null}
    </>
}

