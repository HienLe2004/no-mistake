import { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async'
import { db } from '../../../firebase.config'
import { storage } from "../../../firebase.config";
import { getDoc, doc, getDocs, collection} from 'firebase/firestore'
import { ref, getDownloadURL } from "firebase/storage";
import { auth } from '../../../firebase.config'
import './MyCourses.css'

function getUnique(arr, index) {
    const unique = arr
        .map(e => e[index])
        .map((e, i, final) => final.indexOf(e) === i && i)
        .filter(e => arr[e]).map(e => arr[e]);      
    return unique;
}

let nextid = 0;
let previd = 0;
export default function MyCourses() {
    const [courseref, setCourseRef] = useState(null);
    const [courses, setCourse] = useState([]);
    const [courseDatas, setCourseData] = useState([]);
    function handleClick(ref) {
        setCourseRef(ref);
    }
    function downloadData(doc) {
        doc.files.map(data => (
            getDownloadURL(ref(storage, 'HK232_LTNC_BTL_v0.1.pdf'))
            .then((url) => {
                const xhr = new XMLHttpRequest();
                xhr.responseType = 'blob';
                xhr.onload = (event) => {
                    const blob = xhr.response;
                };
                xhr.open('GET', url);
                xhr.send();
            })
        ))
    }
    useEffect(() => {
        if (courseref == null) {
            const unsub = auth.onAuthStateChanged((authObj) => {
                if (authObj) {
                    const fetchdata = async () => {
                        const docRef = doc(db, "users", authObj.uid);
                        const docSnap = await getDoc(docRef);
                        let data = docSnap.data();
                        for (const ref of data.courses) {
                            const fetchcoure = async () => {
                                const files = await getDoc(ref);
                                let course = files.data();
                                setCourse(courses => [...courses, {id:nextid, name: course.name, reference: ref }]);
                                nextid++;
                            }
                            fetchcoure();
                        };
                    }
                    fetchdata();
    
                } else { console.log("User not logged in") }
                unsub();
            });
        }
        else 
        {
            const fetchData = async () => {
                try {
                    const courseid = courseref.id;
                    const querySnapshot = await getDocs(collection(db, "courses", courseid, "data"));
                    querySnapshot.forEach((doc) => {
                        let dd = doc.data();
                        setCourseData(courseDatas => [...courseDatas, {id: previd, name: dd.name, description: dd.description, doc: dd }]);
                        previd++;
                    });
                    
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            };
            fetchData();
        }
    }, [courseref]);

    if (courseref == null) {
        const uniquecourse = getUnique(courses,'name');
        return <>
            <Helmet>
                <title>Khóa học của tôi | LMS-DEF-NM</title>
            </Helmet>
            <div className="title">Danh sách khóa học</div>
            <div className="card-around">
                {uniquecourse.map(course => (
                    <button onClick={() => handleClick(course.reference)} key={course.id} className="card-container" >
                        <img src="https://picsum.photos/250/100" className="card-img"/>
                        <h1 className="card-title">{course.name}</h1>
                    </button>
                ))}
            </div>
        </>
    }
    
    else {
        return <>
            <Helmet>
                <title>Khóa học của tôi | LMS-DEF-NM</title>
            </Helmet>
            <div className="title">Tài liệu môn học</div>
            <div className="card-course-around">
                {courseDatas.map(course => (
                    <button onClick={() => downloadData(course.doc)} key={course.name} className="card-course-container" >
                        <h1 className="card-course-title">{course.name}</h1>
                        <div className="card-course-description">{course.description}</div>
                    </button>
                ))}
            </div>
        </>
    }

}




