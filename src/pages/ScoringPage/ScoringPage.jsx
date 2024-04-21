import { useState, useEffect } from "react";
import {Helmet} from 'react-helmet-async'
import ListofCourses from "../AddP/ListofCourses/LSC"
import {db} from '../../../firebase.config'
import { getDoc, doc, } from 'firebase/firestore'
import { auth } from '../../../firebase.config'

let Newid = 0;
export default function MyCourses() {
    const [courses, setCourse] = useState([]);
    const [student, setStudent] = useState([]);
    useEffect(() => {
        const unsub = auth.onAuthStateChanged((authObj) => {
            unsub();
            if (authObj) {
                const fetchdata = async() => {
                    const docRef = doc(db, "users", authObj.uid);
                    const docSnap = await getDoc(docRef);
                    let data = docSnap.data();
                    data.courses.forEach(ref => {
                        const fetchcourse = async() => {
                            const files = await getDoc(ref);
                            let course = files.data();
                            setCourse([...courses, { id: Newid++, name: course.name}]);
                        }
                        fetchcourse();
                    });
                }
                fetchdata();
            } else {console.log("User not logged in")}
        });
    }, []);

    return (<>
        
        {courses ? <ListofCourses courses={courses}/> :null}
    </>)
}