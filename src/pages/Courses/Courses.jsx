import './Courses.css'

import { Helmet } from 'react-helmet-async'
import { auth, db } from '../../../firebase.config'
import { collection, onSnapshot, doc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { readTeacherData, addElementToArray, readUserDoc1, deleteElementInArray, updateField, deleteOneField } from '../../useAll/UseAll'
import { Card, Button } from 'antd'

//thay đổi đường dẫn course bằng việc thay course => courses
//getdata of person with rol and path
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

/* For Student */
//handle submit for student
function handleSubmit(path, field, val, courseID, role) {
    if (role === 'student') {
        //update courses for student
        addElementToArray(path, field, val)
        //add student to course
        addElementToArray(`course/${courseID}`, 'students', `users/${auth.currentUser.uid}`)
        console.log('check')
        alert('Đăng ký môn học thành công')
    }
    else if (role === 'teacher') {
        //update courses for teacher
        addElementToArray(path, field, val)
        updateField(`course/${courseID}`, 'teacher', `users/${auth.currentUser.uid}`)
        alert('Đăng ký dạy thành công')
    }
}

//delete a student
function deleteStudent(pathUser, fieldUser, valUser, pathCourse, fieldCourse, valCourse) {
    //xóa course trong danh sách course của student
    deleteElementInArray(pathUser, fieldUser, valUser)
    //xóa student trong danh sách course
    deleteElementInArray(pathCourse, fieldCourse, valCourse)
    alert('Hủy môn học thành công')
}
/* End for deletet a student */

//delete teacher from course and delete course from teacher
function deleteTeacher(pathUser, fieldUser, valUser, pathCourse, fieldDelete) {
    //xóa course trong danh sách dạy của giảng viên
    deleteElementInArray(pathUser, fieldUser, valUser)
    //xóa giảng viên dạy trong khóa học
    deleteOneField(pathCourse, fieldDelete)
    alert('Hủy dạy thành công')
}

export default function Courses() {

    //infor about inside
    const [course, setCourses] = useState([])
    useEffect(() =>
        onSnapshot(collection(db, 'course'), (snapshot) => {
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

    return <>
        <Helmet>
            <title>Khóa học | LMS-DEF-NM</title>
        </Helmet>

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

                        {role === 'admin' ?
                            <>
                                admin
                            </>
                            :
                            <>
                                {
                                    information.courses.some((element) => {
                                        console.log(element.id);
                                        return element.id === courseEle.id
                                    })
                                        ? <>
                                            <p>Tình trạng:
                                                {role === 'student' ?
                                                    <>
                                                        đang học
                                                        {/* <div></div> */}
                                                        <Button type="primary" onClick={() => deleteStudent(`users/${auth.currentUser.uid}`, `courses`, `/course/${courseEle.id}`,
                                                            `course/${courseEle.id}`, 'students', `users/${auth.currentUser.uid}`)}>Hủy môn học</Button>
                                                    </> :
                                                    (role === 'teacher' ?
                                                        <>
                                                            Đang dạy
                                                            {/* <div></div> */}
                                                            <Button type="primary" onClick={() => deleteTeacher(`users/${auth.currentUser.uid}`, `courses`, `/course/${courseEle.id}`,
                                                                `course/${courseEle.id}`, 'teacher')}>Hủy dạy</Button>
                                                        </> :
                                                        <>role: admin</>
                                                    )
                                                }
                                            </p>
                                        </> :
                                        //thay đổi đường dẫn course ở đây
                                        <>
                                            {role === 'student' ?
                                                <>
                                                    <Button type="primary" onClick={() => handleSubmit(`users/${auth.currentUser.uid}`, 'courses', `/course/${courseEle.id}`, courseEle.id, role)} >Đăng ký học</Button>
                                                </>
                                                :
                                                (role === 'teacher' ?
                                                    <>
                                                        {'teacher' in courseEle ? <> Đã có giáo viên giảng dạy</> :
                                                            <>
                                                                <Button type="primary" onClick={() => handleSubmit(`users/${auth.currentUser.uid}`, 'courses', `/course/${courseEle.id}`, courseEle.id, role)}>Đăng ký dạy</Button>
                                                            </>
                                                        }
                                                    </> :
                                                    <>admin</>
                                                )
                                            }
                                        </>
                                }
                            </>
                        }
                    </Card>
                </>
            ))}
        </>
        <h1>Courses</h1>
    </>
}