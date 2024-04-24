import { useState, useEffect } from "react";
import {Helmet} from 'react-helmet-async'
import ListofCourses from "../AddP/ListofCourses/LSC"
import {db} from '../../../firebase.config'
import { getDoc, doc, collection, getDocs, query, where, onSnapshot} from 'firebase/firestore'
import { auth } from '../../../firebase.config'
import { readTeacherData, addElementToArray, readUserDoc1, deleteElementInArray, updateField, deleteOneField } from '../../useAll/UseAll'
import { NavLink,Link, useNavigate } from "react-router-dom";
import { Card, Button } from 'antd'

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

    let nextid = 0;
    export default function MyScoringCourses() {

        //infor about inside
        const [courses, setCourses] = useState([])
        const SelectedCourses = query(collection(db,'courses'),where('teacher','==',doc(db, `users/${auth.currentUser.uid}`)))
        useEffect(() =>
            onSnapshot(SelectedCourses, (snapshot) => {
                setCourses(snapshot.docs.map(doc2 => ({ ...doc2.data(), id: doc2.id })));
            }), [])
        
        console.log(courses);//Z1jHIReXAAremZ3ACDJL

       const [student, setStudent] = useState([]);
        useEffect(() => {
                const fetchdata = async () => {
                    const docRef = doc(db, 'courses','Z1jHIReXAAremZ3ACDJL');
                    const docSnap = await getDoc(docRef);
                    let data = docSnap.data();
                    data.students.forEach(ref => {
                        const fetchStudentData = async () => {
                            const files = await getDoc(ref);
                            let StudentData = files.data();
                            setStudent([...student, { id: ref.id, name: StudentData.name, studentRef: StudentData }]);
                        }
                        fetchStudentData();
                    });   
                }
                fetchdata();
        }, []);

        console.log(student);
        console.log(courses);
            
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
        <Helmet>
            <title>Khóa học của tôi | LMS-DEF-NM</title>
        </Helmet>

        <>
        {student.map((courseEle, index) => {
                    console.log(courseEle.id);
                    return (
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
                                
                                <p> Qualified or not: <GetData path={`users/${courseEle.id}/mark/MarkRef`} rol='qualified' />  </p>
                                <p>Final Score: <GetData path={`users/${courseEle.id}/mark/MarkRef`} rol='final' /></p>
                                <Button onClick={() => { addElementToArray(`users/${courseEle.id}/mark/MarkRef`,'final','9')} }> Change Student Points </Button>
                            </Card>

                            
                        </>
                        
                    );
                
            })}
        </>

        </>)
    
    
}
