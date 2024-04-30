//Le Ngoc Hien
import './UserInformation.css'
import {useParams} from 'react-router-dom'
import {db} from '../../../../../firebase.config'
import {doc, getDoc, updateDoc, getDocs, query, collection, where} from 'firebase/firestore'
import { useState, useEffect } from 'react'
import {listDay, listFaculty, listMonth, listPosition, listYear} from '../CreateUserForm/CreateUserForm'
import {currentUser} from '../../../../components/ConditionalUI'

export default function UserInformation() {
    const {uid} = useParams();
    const [userData, setUserData] = useState();
    const [form, setForm] = useState({});
    useEffect(() => {
        const fetchUserData = async () => {
            const data = await getUserData(uid);
            setUserData(data);
            setForm({
                email: data.data().email,
                name: data.data().name,
                role: data.data().role,
                phoneNumber: data.data().phoneNumber,
                dateOfBirth: data.data().dateOfBirth,
                gender: data.data().gender,
                roleID: data.data().roleID,
                faculty: data.data().faculty,
                degrees: data.data().degrees,
                position: data.data().position,
                class: data.data().class,
                deanClass: data.data().deanClass,
                numberGraduate: data.data().numberGraduate,
                numberPostGraduate: data.data().numberPostGraduate,
                status: data.data().status
            })
            //console.log(data.data());
        }
        fetchUserData();
        //console.log(uid);
    },[uid]);
    const checkForm = async(e) => {
        e.preventDefault();
        let notiList = [];
        if (form.name === "")
            notiList.push("Vui lòng điền đầy đủ họ và tên!");
        if (form.roleID == "")
            notiList.push("Vui lòng nhập mã số người dùng!");
        else {
            if (! await checkRoleID(form.roleID, form.role))
                notiList.push("Mã số đã được sử dụng!");
        }
        if (currentUser.role !== "admin")
            notiList.push("Chỉ quản trị viên mới sử dụng được chức năng này!");
        if (notiList.length===0) {
            await UpdateUserDatabase(form, userData.id).then(() => {
                notiList.push("Cập nhật thông tin người dùng thành công!");
            })
            .catch(() => {
                notiList.push("Email không hợp lệ hoặc đã có người sử dụng!");
            })
        }
        let notiGroup = '';
        notiList.forEach(noti => notiGroup += (noti + '\n'));
        alert(notiGroup);
    };
    //Function validates roleID
    const checkRoleID = async (roleID, role) => {
        const roleList = query(collection(db, 'users'), where("role", "==", role));
        const roleListData = await getDocs(roleList);
        let valid = true;
        await roleListData.forEach((doc) => {
            try {
                if (roleID == doc.data().roleID && userData.id != doc.id) {
                    //console.log("RoleID is not valid!");
                    valid = false;
                }
            }
            catch {
                console.log(`Missing roleID at ${doc.id}!`);
            }
        })
        return valid;
    } 
    const handleChange = (e) => {
        if (e.target.name === 'day') {
            form.dateOfBirth.day = parseInt(e.target.value) 
        }
        else if (e.target.name === 'month') {
            form.dateOfBirth.month = parseInt(e.target.value)
        }
        else if (e.target.name === 'year') {
            form.dateOfBirth.year = parseInt(e.target.value)
        }
        else if (e.target.name === 'degree1') {
            while (form.degrees?.length > 3) form.degrees.push('');
            form.degrees[0] = e.target.value;
        }
        else if (e.target.name === 'degree2') {
            while (form.degrees?.length > 3) form.degrees.push('');
            form.degrees[1] = e.target.value;
        }
        else if (e.target.name === 'degree3') {
            while (form.degrees?.length > 3) form.degrees.push('');
            form.degrees[2] = e.target.value;
        }
        else {
            //Change specific field to input value
            setForm(prev => ({
                ...prev,
                [e.target.name]: e.target.value
            }))
        }
    }
    return <div className='userInformation' key={userData?.id}>
        <form>
            <div className="commonInfo">
                <label>Email:
                    <input type='text' name='email' onChange={handleChange}
                        defaultValue={form.email}/>
                </label>
                <label>Họ và tên:
                    <input type='text' name='name' onChange={handleChange}
                        defaultValue={form.name}/>
                </label>
                <label>Số điện thoại:
                    <input type='number' name='phoneNumber' onChange={handleChange}
                        defaultValue={form.phoneNumber}/>
                </label>
                <label className='dateOfBirth'>Ngày tháng năm sinh:
                    <select name='day' onChange={handleChange}
                        defaultValue={form.dateOfBirth?.day}>
                        {listDay.map((index) => {
                            return <option key={index} value={index}>{index}</option>
                        })}
                    </select>
                    <select name='month' onChange={handleChange}
                        defaultValue={form.dateOfBirth?.month}>
                        {listMonth.map((index) => {
                            return <option key={index} value={index}>{index}</option>
                        })}
                    </select>
                    <select name='year' onChange={handleChange}
                        defaultValue={form.dateOfBirth?.year}>
                        {listYear.map((index) => {
                            return <option key={index} value={index}>{index}</option>
                        })}
                    </select>
                </label>
            </div>
            <div className='gender'>
                <p>Giới tính:</p>
                <ul>
                    <li><label><input type='radio' name='gender' 
                                    onChange={handleChange}
                                    className='male'
                                    checked={form.gender==='male'}/>Nam</label></li>
                    <li><label><input type='radio' name='gender'
                                    onChange={handleChange}
                                    className='female'
                                    checked={form.gender==='female'}/>Nữ</label></li>
                </ul>
            </div>
            <div className='role'>
                <p>Vai trò:</p>
                <ul>
                    <li><label><input type='radio' name='role'
                        onChange={handleChange} className='admin'
                        checked={form.role==='admin'}/>Quản trị viên</label></li>
                    <li><label><input type='radio' name='role'
                        onChange={handleChange} className='teacher'
                        checked={form.role==='teacher'}/>Giảng viên</label></li>
                    <li><label><input type='radio' name='role'
                        onChange={handleChange} className='student'
                        checked={form.role==='student'}/>Sinh viên</label></li>
                </ul>
            </div>
            <label className="status">Trạng thái:
                <select name='status' onChange={handleChange}
                    defaultValue={form.status}>
                        <option key='available' value='available'>Hoạt động</option>
                        <option key='freezed' value='freezed'>Tạm hoãn</option>
                        <option key='terminated' value='terminated'>Kết thúc</option>
                </select>
            </label>
            {/* Form section for ADMIN */}
            <div className="roleInfo admin" style={{display:(form.role==='admin')?'flex':'none'}}>
                <label>Mã số quản trị viên:
                    <input type='text' name='roleID' onChange={handleChange}
                        className='adminID' defaultValue={form?.roleID}/>
                </label>
            </div>
            {/* Form section for TEACHER */}
            <div className="roleInfo teacher" style={{display:(form.role==='teacher')?'flex':'none'}}>
                <label>Mã số giảng viên:
                    <input type='text' name='roleID' onChange={handleChange}
                        className='teacherID' defaultValue={form?.roleID}></input>
                </label>
                <label>Khoa trực thuộc:
                    <select name='faculty' className='teacherFaculty'
                        onChange={handleChange} defaultValue={form.faculty}>
                        {listFaculty.map((faculty)=>{
                            return <option key={faculty} value={faculty}>{faculty}</option>
                        })}
                    </select>
                </label>
                <label>Chức vụ:
                    <select className='position' name='position'
                        onChange={handleChange} defaultValue={form.position}>
                        {listPosition.map((position)=>{
                            return <option key={position} value={position}>{position}</option>
                        })}
                    </select>
                </label>
                <label>Lớp chủ nhiệm:
                    <input type='text' name='deanClass' onChange={handleChange}
                            defaultValue={form.deanClass}/>
                </label>
                <label>Học hàm - Học vị:
                    <input type='text' name='degree1' onChange={handleChange}
                            defaultValue={(form.degrees?.length > 0)?form.degrees[0] : ''}/>
                    <input type='text' name='degree2' onChange={handleChange}
                            defaultValue={(form.degrees?.length > 1)?form.degrees[1] : ''}/>
                    <input type='text' name='degree3' onChange={handleChange}
                            defaultValue={(form.degrees?.length > 2)?form.degrees[2] : ''}/>
                </label>
                <label className='thesis'>Số luận văn tốt nghiệp đã hướng dẫn:
                    <input type='number' name='numberGraduate' min="0" 
                        onChange={handleChange} defaultValue={form.numberGraduate}/>
                </label>
                <label className='thesis'>Số luận văn cao học đã hướng dẫn:
                    <input type='number' name='numberPostGraduate' min="0" 
                        onChange={handleChange} defaultValue={form.numberPostGraduate}/>
                </label>
            </div>
            {/* Form section for STUDENT */}
            <div className="roleInfo student" style={{display:(form.role==='student')?'flex':'none'}}>
                <label>Mã số sinh viên:
                    <input type='text' name='roleID' onChange={handleChange}
                        className='studentID' defaultValue={form?.roleID}></input>
                </label>
                <label>Khoa trực thuộc:
                    <select name='faculty' className='studentFaculty' onChange={handleChange}
                            defaultValue={form.faculty}>
                        {listFaculty.map((faculty)=>{
                            return <option key={faculty} value={faculty}>{faculty}</option>
                        })}
                    </select>
                </label>
                <label>Lớp trực thuộc:
                    <input type='text' name='class' className='class' 
                        onChange={handleChange} defaultValue={form.class}/>
                </label>
            </div>

            <button className='confirmButton' onClick={checkForm}>Cập nhật</button>
            {/* Form section for displaying errors 
            <div className="notiList" style={{display:(listError.length > 0)?"flex":"none"}}>
                {listError.map(error => {
                    return <p key={error}>{error}</p>
                })}
            </div>*/}
        </form>
    </div>
}
//Function gets user's data from firestore
const getUserData = async(uid) => {
    const userDocRef = doc(db, 'users', uid);
    return await getDoc(userDocRef);
}

//Function creates user's database from form's data
const UpdateUserDatabase = async (form, uid) => {
    const userDocRef = doc(db, "users", uid);
    let userData = {
        name: form.name,
        email: form.email,
        roleID: form.roleID,
        dateOfBirth: form.dateOfBirth,
        phoneNumber: form.phoneNumber,
        status: form.status,
    }
    if (form.role === 'admin') {
        //console.log("new admin uid " + uid);
    }
    else if (form.role === 'teacher') {
        //console.log("new teacher uid " + uid);
        userData.deanClass = form.deanClass;
        userData.faculty = form.faculty;
        userData.position = form.position;
        userData.degrees = form.degrees;
        userData.numberGraduate = parseInt(form.numberGraduate);
        userData.numberPostGraduate = parseInt(form.numberPostGraduate);
    }
    else if (form.role === 'student') {
        //console.log("new student uid " + uid);
        userData.class = form.class;
        userData.faculty = form.faculty;
    }
    //console.log(userData);
    await updateDoc(userDocRef, userData);
}