import './Courses.css'
import { Helmet } from 'react-helmet-async'
import { auth, db } from '../../../firebase.config'
import { collection, onSnapshot, doc } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import { readTeacherData, addElementToArray, readUserDoc1, deleteElementInArray, updateField, deleteOneField } from '../../useAll/UseAll'
import { Card, Button, Space } from 'antd'

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
        addElementToArray(`courses/${courseID}`, 'students', `users/${auth.currentUser.uid}`)
        console.log('check')
        alert('Đăng ký môn học thành công')
    }
    else if (role === 'teacher') {
        //update courses for teacher
        addElementToArray(path, field, val)
        updateField(`courses/${courseID}`, 'teacher', `users/${auth.currentUser.uid}`)
        alert('Đăng ký dạy thành công')
    }
}

//delete a student
function deleteStudent(pathUser, fieldUser, valUser, pathCourse, fieldCourse, valCourse) {
    //xóa course trong danh sách course của student
    deleteElementInArray(pathUser, fieldUser, valUser)
    //xóa student trong danh sách course
    deleteElementInArray(pathCourse, fieldCourse, valCourse)
    alert('Hủy đăng ký thành công')
}
/* End for deletet a student */

//delete teacher from course and delete course from teacher
function deleteTeacher(pathUser, fieldUser, valUser, pathCourse, fieldDelete) {
    //xóa course trong danh sách dạy của giảng viên
    deleteElementInArray(pathUser, fieldUser, valUser)
    //xóa giảng viên dạy trong khóa học
    deleteOneField(pathCourse, fieldDelete)
    alert('Hủy đăng ký thành công')
}

export default function Courses() {

    //infor about inside
    const [course, setCourses] = useState([])
    useEffect(() =>
        onSnapshot(collection(db, 'courses'), (snapshot) => {
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
                        key={courseEle.id}>
                        <p key={courseEle.id + '0'}>Semester: {courseEle.semester} </p>
                        {/* <p key={courseEle.id + '1'}>Status: {courseEle.status}</p> */}
                        {/* thiếu subjects*/}
                        <p key={courseEle.id + '2'}>Số lượng sinh viên đã đăng ký: {'students' in courseEle ? <>{courseEle.students.length}</> : <>0</>}</p>
                        <p key={courseEle.id + '3'}>{'teacher' in courseEle ? <>
                            {courseEle.teacher !== null ?
                                <>
                                    Giáo viên: <GetData path={`/users/${courseEle.teacher.id}`} rol='name' key={courseEle.id + '15'} />
                                </>
                                : <>Chưa có giáo viên đăng ký dạy</>}</>
                            : <>Chưa có giáo viên đăng ký dạy</>}
                        </p>
                        <p key={courseEle.id + '4'}>Tuần bắt đầu học: {courseEle.classStart}</p>
                        <p key={courseEle.id + '5'}>Phòng học: {courseEle.room}</p>
                        <p key={courseEle.id + '6'}>Số lớp: {courseEle.classNum}</p>

                        {/* <p key={courseEle.id + '7'}>Tên của data: <GetData path={`courses/${courseEle.id}/data/key`} rol='name' key={courseEle.id + '17'} /></p> */}
                        <p key={courseEle.id + '8'}>Mô tả: <GetData path={`courses/${courseEle.id}/data/key`} rol='description' key={courseEle.id + '18'} /></p>
                        {role === 'admin' ?
                            <p key={courseEle.id + '14'}>
                                admin
                            </p>
                            :
                            <>
                                {
                                    information.courses.some((element) => {
                                        return element.id === courseEle.id
                                    })
                                        ? <>
                                            <p key={courseEle.id + '9'}>Tình trạng:&nbsp;
                                                {role === 'student' ?
                                                    <>
                                                        đã đăng ký<br />
                                                        {/* <div></div> */}
                                                        <Button type="primary" key={courseEle.id + '10'} onClick={() => deleteStudent(`users/${auth.currentUser.uid}`, `courses`, `/courses/${courseEle.id}`,
                                                            `courses/${courseEle.id}`, 'students', `users/${auth.currentUser.uid}`)}>Hủy đăng ký</Button>
                                                    </> :
                                                    (role === 'teacher' ?
                                                        <>
                                                            đã đăng ký<br />
                                                            {/* <div></div> */}
                                                            <Button type="primary" key={courseEle.id + '11'} onClick={() => deleteTeacher(`users/${auth.currentUser.uid}`, `courses`, `/courses/${courseEle.id}`,
                                                                `courses/${courseEle.id}`, 'teacher')}>Hủy đăng ký</Button>
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
                                                    <Button type="primary" key={courseEle.id + '12'} onClick={() => handleSubmit(`users/${auth.currentUser.uid}`, 'courses', `/courses/${courseEle.id}`, courseEle.id, role)}>Đăng ký</Button>
                                                </>
                                                :
                                                (role === 'teacher' ?
                                                    <>
                                                        {'teacher' in courseEle ? <> Đã có giáo viên giảng dạy</> :
                                                            <>
                                                                <Button type="primary" key={courseEle.id + '13'} onClick={() => handleSubmit(`users/${auth.currentUser.uid}`, 'courses', `/courses/${courseEle.id}`, courseEle.id, role)}>Đăng ký</Button>
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