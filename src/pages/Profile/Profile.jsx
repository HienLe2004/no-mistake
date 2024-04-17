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
                        <td className="text-content">{userData.fullName}</td>
                    </tr>
                    <tr>
                        <th className="text-description">Mã số sinh viên</th>
                        <td className="text-content">{userData.studentID}</td>
                    </tr>
                    <tr>
                        <th className="text-description">Tuổi</th>
                        <td className="text-content">{userData.age}</td>
                    </tr>
                    <tr>
                        <th className="text-description">Giới tính</th>
                        <td className="text-content">{userData.gender}</td>
                    </tr>
                    <tr>
                        <th className="text-description">Quốc tịch</th>
                        <td className="text-content">{userData.nation}</td>
                    </tr>
                    <tr>
                        <th className="text-description">Số điện thoại</th>
                        <td className="text-content">{userData.numberPhone}</td>
                    </tr>
                    <tr>
                        <th className="text-description">Tình trạng học vụ</th>
                        <td className="text-content">{userData.studentStatus}</td>
                    </tr>
                    <tr>
                        <th className="text-description">Số tín chỉ đăng ký</th>
                        <td className="text-content">{userData.creditRegistered}</td>
                    </tr>
                    <tr>
                        <th className="text-description">Số tín chỉ tích lũy</th>
                        <td className="text-content">{userData.creditEarned}</td>
                    </tr>
                    <tr>
                        <th className="text-description">Điểm trung bình tích lũy hệ 4</th>
                        <td className="text-content">{userData.gpa}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </>
}