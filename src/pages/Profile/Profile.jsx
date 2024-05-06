import { useState, useEffect } from "react";
import { Helmet } from 'react-helmet-async'
import { db } from '../../../firebase.config'
import { getDoc, doc } from 'firebase/firestore'
import { auth } from '../../../firebase.config'
import { onSnapshot, collection } from "firebase/firestore";
import { readTeacherData } from "../../useAll/UseAll";
import './Profile.css'

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


export default function Profile() {
    const [userData, setCurrentData] = useState({});
    useEffect(() => {
        const unsub = auth.onAuthStateChanged((authObj) => {
            unsub();
            if (authObj) {
                const fetchdata = async () => {
                    const docRef = doc(db, "users", authObj.uid);
                    const docSnap = await getDoc(docRef);
                    let data = docSnap.data();
                    setCurrentData(data);
                }
                fetchdata();
            } else { console.log("User not logged in") }
        });
    }, []);

    const [courses, setCourses] = useState([])
    useEffect(() =>
        onSnapshot(collection(db, `users/${auth.currentUser.uid}/mark`), (snapshot) => {
            setCourses(snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
        }), []
    )

    if (userData.role === "student") {
        return <>
            <Helmet>
                <title>Thông tin cá nhân | LMS-DEF-NM</title>
            </Helmet>
            <div className="box-around">
                <table className="table" >
                    <tbody>
                        <tr className="head-table">
                            <th className="head-table-text" colSpan="2">Thông tin cá nhân </th>
                        </tr>
                        <tr>
                            <th className="text-description">Họ và tên</th>
                            <td className="text-content">{userData.name}</td>
                        </tr>
                        <tr>
                            <th className="text-description">Mã số sinh viên</th>
                            <td className="text-content">{userData.roleID}</td>
                        </tr>
                        <tr>
                            <th className="text-description">Ngày sinh</th>
                            <td className="text-content">{userData.dateOfBirth?.day}/{userData.dateOfBirth?.month}/{userData.dateOfBirth?.year}</td>
                        </tr>
                        <tr>
                            <th className="text-description">Giới tính</th>
                            <td className="text-content">{userData.gender}</td>
                        </tr>
                        <tr>
                            <th className="text-description">Số điện thoại</th>
                            <td className="text-content">{userData.phoneNumber}</td>
                        </tr>
                        <tr>

                            <th className="text-description">Khoa</th>
                            <td className="text-content">{userData.faculty}</td>
                        </tr>
                        <tr>
                            <th className="text-description">Lớp</th>
                            <td className="text-content">{userData.class}</td>
                        </tr>
                        <tr>
                            <th className="text-description">Tình trạng học vụ</th>
                            <td className="text-content">{userData.status}</td>
                        </tr>
                        <tr>
                            <th className="text-description">Số tín chỉ đăng ký</th>
                            <td className="text-content">{userData.registeredCredits}</td>
                        </tr>
                        <tr>
                            <th className="text-description">Số tín chỉ tích lũy</th>
                            <td className="text-content">{userData.ernedCredits}</td>
                        </tr>
                        <tr>
                            <th className="text-description">Điểm trung bình tích lũy hệ 4</th>
                            <td className="text-content">{userData.gpa}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            {/* Điểm số */}
            <div className="box-around">
                <table className="table">
                    <tbody>
                        <tr className="head-table">
                            <th className="head-table-text" colSpan="4">Điểm số</th>
                            {/* <td style={{ textAlign: 'center' }}>Điểm tổng</td> */}
                        </tr>
                        <tr>
                            <th className="text-description" style={{ textAlign: 'center', width: '30%' }}>Môn học</th>
                            <th className="text-description" style={{ textAlign: 'center', width: '30%' }}> Điểm thành phần</th>
                            <th className="text-description" style={{ textAlign: 'center', width: '20%' }}> Điểm Tổng</th>
                            <th className="text-description" style={{ textAlign: 'center', width: '20%' }}> Đánh giá</th>
                        </tr>
                        {courses.length >= 1 &&
                            courses.map((courseEle, index) => {
                                let listProp = "";
                                Object.keys(courseEle.mark).forEach((prop) => {
                                    listProp += prop + ":" + courseEle.mark[prop] + ' ';
                                });
                                return <tr key={courseEle.id + '0'}>
                                    <td className="text-content" style={{ textAlign: 'center' }}>{courseEle.name}</td>
                                    <td className="text-content" style={{ textAlign: 'center' }}>{listProp}</td>
                                    <td className="text-content" style={{ textAlign: 'center' }}>{courseEle.final}</td>
                                    <td className="text-content" style={{ textAlign: 'center' }}>{(courseEle.qualified === null)?"null":(courseEle.qualified===false)?"Chưa qua môn": "Qua môn"}</td>
                                </tr>
                            }
                        )}
                    </tbody>
                </table>
            </div>
        </>
    }
    if (userData.role === "teacher") {
        return <>
            <Helmet>
                <title>Thông tin cá nhân | LMS-DEF-NM</title>
            </Helmet>
            <div className="box-around">
                <table className="table" >
                    <tbody>
                        <tr className="head-table">
                            <th className="head-table-text" colSpan="2">Thông tin cá nhân </th>
                        </tr>
                        <tr>
                            <th className="text-description">Họ và tên</th>
                            <td className="text-content">{userData.name}</td>
                        </tr>
                        <tr>
                            <th className="text-description">Mã số giảng viên</th>
                            <td className="text-content">{userData.roleID}</td>
                        </tr>
                        <tr>
                            <th className="text-description">Ngày sinh</th>
                            <td className="text-content">{userData.dateOfBirth?.day}/{userData.dateOfBirth?.month}/{userData.dateOfBirth?.year}</td>
                        </tr>
                        <tr>
                            <th className="text-description">Giới tính</th>
                            <td className="text-content">{userData.gender}</td>
                        </tr>
                        <tr>
                            <th className="text-description">Số điện thoại</th>
                            <td className="text-content">{userData.phoneNumber}</td>
                        </tr>
                        <tr>
                            <th className="text-description">Học hàm - Học vị</th>
                            <td className="text-content">{userData.degrees[0]}-{userData.degrees[1]}-{userData.degrees[2]}</td>
                        </tr>
                        <tr>
                            <th className="text-description">Khoa</th>
                            <td className="text-content">{userData.faculty}</td>
                        </tr>
                        <tr>
                            <th className="text-description">Chức vụ</th>
                            <td className="text-content">{userData.position}</td>
                        </tr>
                        <tr>
                            <th className="text-description">Lớp chủ nhiệm</th>
                            <td className="text-content">{userData.deanClass}</td>
                        </tr>
                        <tr>
                            <th className="text-description">Tình trạng giảng dạy</th>
                            <td className="text-content">{(userData.status == "available") ? "Đang giảng dạy" :
                                ((userData.status == 'freezed') ? "Tạm hoãn" : "Kết thúc")}</td>
                        </tr>
                        <tr>
                            <th className="text-description">Số luận văn tốt nghiệp đã hướng dẫn</th>
                            <td className="text-content">{userData.numberGraduate}</td>
                        </tr>
                        <tr>
                            <th className="text-description">Số luận văn cao học đã hướng dẫn</th>
                            <td className="text-content">{userData.numberPostGraduate}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    }
}
