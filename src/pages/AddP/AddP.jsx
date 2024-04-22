import { useState, useEffect } from "react";
import {Helmet} from 'react-helmet-async'
import ListofCourses from "../AddP/ListofCourses/LSC"
import {db} from '../../../firebase.config'
import { getDoc, doc, collection, getDocs, query, where, onSnapshot} from 'firebase/firestore'
import { auth } from '../../../firebase.config'
import { readTeacherData, addElementToArray, readUserDoc1, deleteElementInArray, updateField, deleteOneField } from '../../useAll/UseAll'
import { NavLink,Link, useNavigate } from "react-router-dom";
import { Card, Button } from 'antd'

let nextid = 0;
export default function MyCourses() {
    
    function GetData({ path, rol }) {
        const [data, setData] = useState('')
        readTeacherData(path, rol)
            .then((result) => {
                setData(result)
            })
            .catch((error) => {
                console.log(error)
            })
        return (
            <>
                {data}
            </>
        )
    }
 
            //? student input | info | ref ?
            const [student, setStudent] = useState([]);
    
            //infor about inside
            const [course, setCourses] = useState([])
            const SelectedCourses = query(collection(db,'courses'),where('teacher','==',doc(db, `users/${auth.currentUser.uid}`)))
            useEffect(() =>
                onSnapshot(SelectedCourses, (snapshot) => {
                    setCourses(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
                }), []
            )
        
            //get information about the current user for check course
            const [information, setInformation] = useState(null)
            useEffect(() => {
                const unsubscribe = onSnapshot(doc(db, `users/${auth.currentUser.uid}`), (snapshot) => {
                    setInformation(snapshot.data());
                });
                return () => unsubscribe();
            }, [])
        
            //get role of current user, 3 cases: student, teacher admin
            const [role, setRole] = useState(null)
            useEffect(() => {
                readUserDoc1(auth.currentUser.uid)
                    .then(result => {
                        setRole(result);
                    })
                    .catch(error => {
                        console.log('not success read role')
                    });
            }, [])
            const navigate = useNavigate();
    
    
        return (<>
           <>
                {course.map((courseEle, index) => (
                    <>
                        <Card
                            title={courseEle.name}
                            bordered={false}
                            style={{
                                width: '50%',
                                marginTop: '20px',
                                textAlign: 'center',
                                left: '25%',
                                right: '25%',
                                backgroundColor: '#CCE6FF',
                                fontSize: '1rem'
                            }}
                            hoverable
                            key={index}>
                            <p>Semester: {courseEle.semester}</p>
                            <p>Status: {courseEle.status}</p>
                            <p>Số lượng sinh viên đã đăng ký: {'students' in courseEle ? <>{courseEle.students.length}</> : <>0</>}</p>
                            <p>{'teacher' in courseEle ? <>Giáo viên: <GetData path={`/users/${courseEle.teacher.id}`} rol='name' /></> : <>Chưa có giáo viên đăng ký dạy</>}</p>
                            <p>Tên của data: <GetData path={`course/${courseEle.id}/data/key`} rol='name' /></p>
                            <p>Mô tả: <GetData path={`course/${courseEle.id}/data/key`} rol='description' /></p>
                            <Button onClick={() => {navigate('/scoringpage')}} > Change Student Points </Button>
                        </Card>
                    </>
                ))}
            </>
           
        </>)
    
    
}
