//Le Ngoc Hien
import './Courses.css'
import { currentUser } from '../../components/ConditionalUI'
import { auth, db } from '../../../firebase.config'
import { useState, useEffect } from 'react'
import { getDocs, collection, query, where, getDoc, updateDoc, setDoc, addDoc, doc, arrayUnion, arrayRemove } from 'firebase/firestore'
import { listStatus } from '../Admin/CourseList/CourseList'
export default function Courses() {
    //Loading list of course
    const [listCourse, setListCourse] = useState([]);
    const [reload, setReload] = useState(false);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchListCourse = async () => {
            const list = await getListCourse();
            setListCourse(list);
        }
        fetchListCourse().then(() => setLoading(false));
    }, [reload])
    //CourseCard template
    function CourseCard({ data, courseDocRef }) {
        //Get course's information
        let listClass = data?.classStart.toString();
        for (let i = 1; i < data?.classNum; i++) {
            listClass += '-' + (i + data?.classStart).toString();
        }
        let listWeek = "";
        const startWeek = data?.week[0];
        const endWeek = data?.week[data?.week?.length - 1];
        for (let i = startWeek; i <= endWeek; i++) {
            if (i === startWeek) listWeek += i;
            else if (data?.week?.includes(i)) listWeek += ('|' + i);
            else listWeek += ("|-");
        }
        const [defaultMark,setDefaultMark] = useState({});
        
        const [teacher, setTeacher] = useState("NULL");
        const handleTeacherName = async () => {
            if (data?.teacher != null) {
                await getTeacherName(data.teacher).then((name) => {
                    setTeacher(name);
                })
            }
        }
        //Use state for check if user has signed in course of not
        const [signUpCourse, setSignUpCourse] = useState(false);
        useEffect(() => {
            const courseChange = async () => {
                const signedIn = await checkSignUpCourse(data);
                setSignUpCourse(signedIn);

                await getDoc(data?.subject).then(subjectDoc => {
                    subjectDoc.data().props.forEach(prop => {
                        setDefaultMark(prev => ({
                            ...prev,
                            [prop]: null
                        }))
                    })
                })
            }
            handleTeacherName();
            courseChange();
        }, [data?.teacher, data?.students])
        //Function publishes course for admin
        const openSignUpCourse = async () => {
            let errorList = "";
            if (currentUser.role !== 'admin') {
                errorList += 'Chức năng này chỉ dành cho quản trị viên!\n';
            }
            if (errorList === "") {
                await updateDoc(doc(db, 'courses', courseDocRef.id), {
                    status: 'waiting'
                }).then(() => {
                    errorList += 'Mở đăng ký khóa học thành công!';
                    setSignUpCourse(true);
                })
            }
            alert(errorList);
        }
        //Function opens course for admin
        const openCourse = async () => {
            let errorList = "";
            if (data?.teacher == null) {
                errorList += 'Khóa học này chưa có giáo viên giảng dạy!!\n';
            }
            if (data?.students.length == 0) {
                errorList += 'Khóa học này chưa có sinh viên đăng ký!\n';
            }
            if (currentUser.role !== 'admin') {
                errorList += 'Chức năng này chỉ dành cho quản trị viên!\n';
            }
            if (errorList == "") {
                await updateDoc(doc(db, 'courses', courseDocRef.id), {
                    status: 'processing'
                }).then(() => {
                    errorList += 'Mở lớp cho khóa học thành công!';
                    setSignUpCourse(true);
                })
                await data?.students.forEach(studentRef => {
                    updateDoc(studentRef, {
                        courses: arrayUnion(doc(db, 'courses', courseDocRef.id))
                    })
                    const markCourseRef = doc(db, `users/${studentRef.id}/mark/${courseDocRef.id}`);
                    
                    setDoc(markCourseRef, {
                        mark: defaultMark,
                        final: null,
                        qualified: null,
                        course: doc(db, `course/${courseDocRef.id}`),
                        name: courseDocRef.data().name
                    });
                })
                await updateDoc(data?.teacher, {
                    courses: arrayUnion(doc(db, 'courses', courseDocRef.id))
                })
            }
            alert(errorList);
            setReload(!reload);
            setLoading(true);
        }
        //Function cancels course for admin
        const cancelCourse = async () => {
            let errorList = "";
            if (currentUser.role !== 'admin') {
                errorList += 'Chức năng này chỉ dành cho quản trị viên!\n';
            }
            if (errorList == "") {
                await updateDoc(doc(db, 'courses', courseDocRef.id), {
                    status: 'unpublished'
                }).then(() => {
                    errorList += 'Hủy lớp cho khóa học thành công!';
                    setSignUpCourse(true);
                })
            }
            alert(errorList);
            setReload(!reload);
            setLoading(true);
        }
        //Function for student, teacher sign in course
        const signUp = async () => {
            let errorList = "";
            if (currentUser.role === 'admin') {
                errorList += 'Chức năng này chỉ dành cho Sinh viên và Giảng viên!\n';
            }
            else if (currentUser.role === 'student') {
                let signUp = false;
                data?.students.forEach(studentRef => {
                    if (studentRef.id === auth.currentUser.uid) signUp = true;
                })
                if (signUp) {
                    errorList += 'Đã đăng ký khóa học trước đó!';
                }
                else {
                    if (data?.students.length >= data?.capacity) {
                        errorList += 'Khóa học đã đầy!';
                    }
                    else {
                        await updateDoc(doc(db, 'courses', courseDocRef.id), {
                            students: arrayUnion(doc(db, 'users', auth.currentUser.uid))
                        }).then(() => {
                            errorList += 'Đăng ký học thành công!';
                            setSignUpCourse(true);
                        })
                    }
                }
            }
            else if (currentUser.role === 'teacher') {
                let signUp = (data?.teacher) && (data?.teacher.id === auth.currentUser.uid);
                if (signUp) {
                    errorList += 'Đã đăng ký khóa học trước đó!';
                }
                else {
                    if (data?.teacher != null) {
                        errorList += 'Đã có giảng viên đăng ký khóa học này!';
                    }
                    else {
                        await updateDoc(doc(db, 'courses', courseDocRef.id), {
                            teacher: doc(db, 'users', auth.currentUser.uid)
                        }).then(() => {
                            errorList += 'Đăng ký dạy thành công!\n';
                            setSignUpCourse(true);
                            getDoc(doc(db, 'users', auth.currentUser.uid)).then(doc => {
                                setTeacher(doc.data().name);
                            })
                        })
                    }
                }
            }
            alert(errorList);
            setReload(!reload);
            setLoading(true);
        }
        //Function for student, teacher sign out course
        const signOut = async () => {
            let errorList = "";
            if (currentUser.role === 'admin') {
                errorList += 'Chức năng này chỉ dành cho Sinh viên và Giảng viên!\n';
            }
            else if (currentUser.role === 'student') {
                let signUp = false;
                data?.students.forEach(studentRef => {
                    if (studentRef.id === auth.currentUser.uid) signUp = true;
                });
                if (!signUp) errorList += 'Bạn chưa đăng ký khóa học này!';
                else {
                    await updateDoc(doc(db, 'courses', courseDocRef.id), {
                        students: arrayRemove(doc(db, 'users', auth.currentUser.uid))
                    }).then(() => {
                        errorList += 'Hủy đăng ký học thành công!\n';
                        setSignUpCourse(false);
                    })
                }
            }
            else if (currentUser.role === 'teacher') {
                let signUp = (data?.teacher) && (data?.teacher.id === auth.currentUser.uid);
                if (!signUp) errorList += 'Bạn chưa đăng ký khóa học này!';
                else {
                    await updateDoc(doc(db, 'courses', courseDocRef.id), {
                        teacher: null
                    }).then(() => {
                        errorList += 'Hủy đăng ký dạy thành công!\n';
                        setSignUpCourse(false);
                        setTeacher("NULL");
                    })
                }
            }
            alert(errorList);
        }
        return <>
            <div className='courseCard'>
                <p>{data?.name} - {data?.subject?.id} - {data?.semester}</p>
                <p>Lớp: {data?.classNo}</p>
                <p>Ngày học: {data?.day}</p>
                <p>Tiết học: {listClass}</p>
                <p>Phòng học: {data?.room}</p>
                <p>Tuần học: {listWeek}</p>
                <p>Trạng thái: {listStatus[data?.status]}</p>
                <p>Số lượng sinh viên đăng ký: {data?.students?.length}/{data?.capacity}</p>
                <p>Giảng viên đăng ký: {teacher}</p>
                <p style={{ display: (['teacher', 'student'].includes(currentUser.role)) ? "flex" : "none" }}>
                    Trạng thái đăng ký: {(signUpCourse) ? "Đã đăng ký" : "Chưa đăng ký"}</p>
                <div className="buttonGroup">
                    <button style={{
                        display: (currentUser.role == 'admin'
                            && data?.status === 'unpublished') ? "flex" : "none"
                    }}
                        onClick={openSignUpCourse}>
                        Mở đăng ký</button>
                    <button style={{
                        display: (currentUser.role == 'admin'
                            && data?.status === 'waiting') ? "flex" : "none"
                    }}
                        onClick={openCourse}>
                        Mở lớp</button>
                    <button style={{
                        display: (currentUser.role == 'admin'
                            && data?.status === 'waiting') ? "flex" : "none"
                    }}
                        onClick={cancelCourse}>
                        Hủy lớp</button>
                    <button style={{
                        display: (['teacher', 'student'].includes(currentUser.role)
                            && !signUpCourse) ? "flex" : "none"
                    }}
                        onClick={signUp}>
                        Đăng ký</button>
                    <button style={{
                        display: (['teacher', 'student'].includes(currentUser.role)
                            && signUpCourse) ? "flex" : "none"
                    }}
                        onClick={signOut}>
                        Hủy đăng ký</button>
                </div>
            </div>
        </>
    }
    if (loading) return <h1 style={{ textAlign: "center" }}>Đang tải...</h1>
    return <div className="courses-layout">
        <h1>Danh sách các khóa học</h1>
        <div className="courseCards">
            {listCourse.map(course => {
                return <CourseCard key={course?.id}
                    data={course?.data()}
                    courseDocRef={course} />
            })}
        </div>
    </div>
}
//Function gets list of course (waiting courses for teacher/student
//  and all of courses for admin)
const getListCourse = async () => {
    const courseCollectionRef = collection(db, 'courses');
    let q = null;
    if (currentUser.role === 'admin') {
        q = courseCollectionRef;
    }
    else if (['teacher', 'student'].includes(currentUser.role)) {
        q = query(courseCollectionRef, where('status', '==', 'waiting'))
    }
    let list = []
    if (q) {
        const querySnapshot = await getDocs(q).then(docs => {
            docs.forEach(doc => list.push(doc))
        })
    }
    return list;
}
//Function returns current teacher's name of course
const getTeacherName = async (teacherDocRef) => {
    const teacherDoc = await getDoc(teacherDocRef);
    return teacherDoc.data().name;
}
//Function checks if current user has signed in course or not
const checkSignUpCourse = async (data) => {
    const role = currentUser.role;
    if (role == 'teacher') {
        return auth.currentUser.uid === data?.teacher?.id;
    }
    if (role == 'student') {
        console.log("check student " + data?.students.length);
        let check = false;
        data?.students.forEach(studentRef => {
            if (studentRef.id === auth.currentUser.uid) {
                check = true;
            }
        })
        return check;
    }
    return false;
}