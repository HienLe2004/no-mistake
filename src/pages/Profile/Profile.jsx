import { useState, useEffect } from "react";
import {Helmet} from 'react-helmet-async'
import {db} from '../../../firebase.config'
import { getDoc, doc } from 'firebase/firestore'
import { auth } from '../../../firebase.config'
import './Profile.css'

export default function Profile() {
    const [userData, setCurrentData] = useState({});
    useEffect(() => {
        const unsub = auth.onAuthStateChanged((authObj) => {
            unsub();
            if (authObj) {
                const fetchdata = async() => {
                    const docRef = doc(db, "users", authObj.uid);
                    const docSnap = await getDoc(docRef);
                    let data = docSnap.data();
                    setCurrentData(data);
                }
                fetchdata();
            } else {console.log("User not logged in")}
        });
    }, []);

    if(userData.role === "student"){
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
                        <td className="text-content">{(userData.status=="available")?"Đang học":
                                            ((userData.status=='freezed')?"Tạm hoãn":"Tốt nghiệp")}</td>
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
    </>}
    if(userData.role === "teacher"){
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
                            <td className="text-content">{(userData.status=="available")?"Đang giảng dạy":
                                            ((userData.status=='freezed')?"Tạm hoãn":"Kết thúc")}</td>
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
