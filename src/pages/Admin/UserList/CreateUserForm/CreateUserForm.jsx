//Le Ngoc Hien
import './CreateUserForm.css'
import {useState} from 'react'
import {createUserWithEmailAndPassword, getAuth} from 'firebase/auth'
import {auth,db} from '../../../../../firebase.config'
import {getDocs,collection,query,where,setDoc,doc,addDoc} from 'firebase/firestore'
import {currentUser} from '../../../../components/ConditionalUI'
import {firebaseConfig} from '../../../../../firebase.config'
import {initializeApp} from 'firebase/app'

export const listDay = Array(31).fill().map((element,index)=>index+1);
export const listMonth = Array(12).fill().map((element,index)=>index+1);
export const listYear = Array(100).fill().map((element,index)=>index+1920);
export const listFaculty = ["Khoa Điện - Điện tử", "Khoa Kỹ thuật Xây dựng", "Khoa Cơ khí",
                     "Khoa Kỹ thuật Hóa học", "Khoa Khoa học và Kỹ thuật Máy tính",
                     "Khoa Công nghệ Vật liệu", "Khoa Khoa học Ứng dụng", "Khoa Kỹ thuật Giao thông",
                     "Khoa Quản lý Công Nghiệp", "Khoa Kỹ thuật Địa chất và Dầu khí",
                     "Khoa Môi trường và Tài nguyên", "Khác"]
export const listPosition = ["Trưởng khoa", "Phó khoa", "Quản lí hồ sơ", "Cố vấn học tập", "Giảng viên", "Trợ giảng", "Khác"]

export default function CreateUserForm() {
    //Create secondApp to prevent auto login when create new user sunccessfull
    const secondApp = initializeApp(firebaseConfig, "secondApp");
    const secondAuth = getAuth(secondApp);
    //Use state for errorList const [errorList, setErrorList] = useState([]);
    //Use state for form
    const [form, setForm] = useState({
        //Common information
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        phoneNumber: 0,
        day: listDay[0],
        month: listMonth[0],
        year: listYear[0],
        gender: "",
        role: "",
        roleID: "",
        //Teacher's information
        faculty: "Khoa Điện - Điện tử",//Common field with student
        deanClass: "Không",
        position: "Trưởng khoa",
        numberGraduate: "0",
        numberPostGraduate: "0",
        degree1:"",degree2:"",degree3:"",
        //Student's information
        class: "",
    });
    //Function handles the change of form
    const handleChange = (e) => {
        //Change gender field to input id
        if (e.target.name === 'gender') {
            setForm(prev => ({
                ...prev,
                [e.target.name]: e.target.className
            }))
        }
        //Change role field to input id and modify roleID and faculty to fit with that role
        else if (e.target.name === 'role') {
            const correctRoleID = document.querySelector(`.${e.target.className}ID`)
            const correctFaculty = document.querySelector(`.${e.target.className}Faculty`)
            setForm(prev => ({
                ...prev,
                [e.target.name]: e.target.className,
                roleID: correctRoleID.value,
                faculty: correctFaculty?.value,
            }))
        }
        //Change specific field to input value
        else {
            setForm(prev => ({
                ...prev,
                [e.target.name]: e.target.value
            }))
        }
    }
    //Function validates form
    const checkForm = async (e) => {
        e.preventDefault();
        let notiList = [];
        if (form.confirmPassword !== form.password)
            notiList.push("Mật khẩu xác nhận không trùng khớp!");
        if (form.password.length < 8)
            notiList.push("Vui lòng tạo mật khẩu trên 8 ký tự!");
        if (form.name === "")
            notiList.push("Vui lòng điền đầy đủ họ và tên!");
        if (form.day === 0 || form.month === 0 || form.year === 0)
            notiList.push("Vui lòng điền đầy đủ ngày tháng năm sinh!");
        if (form.gender === "")
            notiList.push("Vui lòng chọn giới tính người dùng!");
        if (form.role === "")
            notiList.push("Vui lòng chọn vai trò của người dùng!");
        if (form.roleID == "")
            notiList.push("Vui lòng nhập mã số người dùng!");
        else {
            if (! await checkRoleID(form.roleID, form.role))
                notiList.push("Mã số đã được sử dụng!");
        }
        if (currentUser.role !== "admin")
            notiList.push("Chỉ quản trị viên mới sử dụng được chức năng này!");
        if (notiList.length===0) {
            await createUserWithEmailAndPassword(secondAuth, form.email, form.password).then((cred) => {
                CreateUserDatabase(form, cred.user.uid);
                notiList.push("Tạo người dùng thành công!");
            }).catch(() => {
                notiList.push("Email không hợp lệ hoặc đã có người sử dụng!");
            })
        }
        let notiGroup = '';
        notiList.forEach(noti => notiGroup += (noti + '\n'));
        alert(notiGroup);
        //setErrorList(notiList);
    }
    //Function validates roleID
    const checkRoleID = async (roleID, role) => {
        const roleList = query(collection(db, 'users'), where("role", "==", role));
        const roleListData = await getDocs(roleList);
        let valid = true;
        await roleListData.forEach((doc) => {
            try {
                if (roleID == doc.data().roleID) {
                    console.log("RoleID is not valid!");
                    valid = false;
                }
            }
            catch {
                console.log(`Missing roleID at ${doc.id}!`);
            }
        })
        return valid;
    } 
    //Body of create user form
    return <div className="createUserForm">
        <form>
            <div className="commonInfo">
                <label>Email:
                    <input type='text' name='email' onChange={handleChange}></input>
                </label>
                <label>Mật khẩu:
                    <input type='password' name='password' onChange={handleChange}></input>
                </label>
                <label>Xác nhận lại mật khẩu:
                    <input type='password' name='confirmPassword' onChange={handleChange}></input>
                </label>
                <label>Họ và tên:
                    <input type='text' name='name' onChange={handleChange}></input>
                </label>
                <label>Số điện thoại:
                    <input type='number' name='phoneNumber' onChange={handleChange}></input>
                </label>
                <label className='dateOfBirth'>Ngày tháng năm sinh:
                    <select name='day' onChange={handleChange}>
                        {listDay.map((index) => {
                            return <option key={index}>{index}</option>
                        })}
                    </select>
                    <select name='month' onChange={handleChange}>
                        {listMonth.map((index) => {
                            return <option key={index}>{index}</option>
                        })}
                    </select>
                    <select name='year' onChange={handleChange}>
                        {listYear.map((index) => {
                            return <option key={index}>{index}</option>
                        })}
                    </select>
                </label>
            </div>
            <div className='gender'>
                <p>Giới tính:</p>
                <ul>
                    <li><label><input type='radio' name='gender' onChange={handleChange} className='male'/>Nam</label></li>
                    <li><label><input type='radio' name='gender' onChange={handleChange} className='female'/>Nữ</label></li>
                </ul>
            </div>
            <div className='role'>
                <p>Vai trò:</p>
                <ul>
                    <li><label><input type='radio' name='role' onChange={handleChange} className='admin'/>Quản trị viên</label></li>
                    <li><label><input type='radio' name='role' onChange={handleChange} className='teacher'/>Giảng viên</label></li>
                    <li><label><input type='radio' name='role' onChange={handleChange} className='student'/>Sinh viên</label></li>
                </ul>
            </div>
            {/* Form section for ADMIN */}
            <div className="roleInfo admin" style={{display:(form.role==='admin')?'flex':'none'}}>
                <label>Mã số quản trị viên:
                    <input type='text' name='roleID' onChange={handleChange} className='adminID'></input>
                </label>
            </div>
            {/* Form section for TEACHER */}
            <div className="roleInfo teacher" style={{display:(form.role==='teacher')?'flex':'none'}}>
                <label>Mã số giảng viên:
                    <input type='text' name='roleID' onChange={handleChange} className='teacherID'></input>
                </label>
                <label>Khoa trực thuộc:
                    <select name='faculty' className='teacherFaculty' onChange={handleChange}>
                        {listFaculty.map((faculty)=>{
                            return <option key={faculty}>{faculty}</option>
                        })}
                    </select>
                </label>
                <label>Chức vụ:
                    <select className='position' name='position' onChange={handleChange}>
                        {listPosition.map((position)=>{
                            return <option key={position}>{position}</option>
                        })}
                    </select>
                </label>
                <label>Lớp chủ nhiệm:
                    <input type='text' name='deanClass' onChange={handleChange}></input>
                </label>
                <label>Học hàm - Học vị:
                    <input type='text' name='degree1' onChange={handleChange}></input>
                    <input type='text' name='degree2' onChange={handleChange}></input>
                    <input type='text' name='degree3' onChange={handleChange}></input>
                </label>
                <label className='thesis'>Số luận văn tốt nghiệp đã hướng dẫn:
                    <input type='number' name='numberGraduate' min="0" onChange={handleChange}></input>
                </label>
                <label className='thesis'>Số luận văn cao học đã hướng dẫn:
                    <input type='number' name='numberPostGraduate' min="0" onChange={handleChange}></input>
                </label>
            </div>
            {/* Form section for STUDENT */}
            <div className="roleInfo student" style={{display:(form.role==='student')?'flex':'none'}}>
                <label>Mã số sinh viên:
                    <input type='text' name='roleID' onChange={handleChange} className='studentID'></input>
                </label>
                <label>Khoa trực thuộc:
                    <select name='faculty' className='studentFaculty' onChange={handleChange}>
                        {listFaculty.map((faculty)=>{
                            return <option key={faculty}>{faculty}</option>
                        })}
                    </select>
                </label>
                <label>Lớp trực thuộc:
                    <input type='text' name='class' className='class' onChange={handleChange}></input>
                </label>
            </div>

            <button className='confirmButton' onClick={checkForm}>Tạo người dùng</button>
            {/* Form section for displaying errors 
            <div className="notiList" style={{display:(errorList.length > 0)?"flex":"none"}}>
                {errorList.map(error => {
                    return <p key={error}>{error}</p>
                })}
            </div>*/}
        </form>
    </div>
}
//Function creates user's database from form's data
const CreateUserDatabase = async (form, uid) => {
    const userDocRef = doc(db, "users", uid);
    let userData = {
        name: form.name,
        email: form.email,
        gender: form.gender,
        role: form.role,
        roleID: form.roleID,
        dateOfBirth: [parseInt(form.day), parseInt(form.month), parseInt(form.year)],
        phoneNumber: form.phoneNumber,
        status: "available",
    }
    if (form.role === 'admin') {
        //console.log("new admin uid " + uid);
    }
    else if (form.role === 'teacher') {
        //console.log("new teacher uid " + uid);
        userData.courses = [];
        userData.deanClass = form.deanClass;
        userData.faculty = form.faculty;
        userData.position = form.position;
        userData.degrees = [];
        if (form.degree1 != "") userData.degrees.push(form.degree1);
        if (form.degree2 != "") userData.degrees.push(form.degree2);
        if (form.degree3 != "") userData.degrees.push(form.degree3);
        userData.numberGraduate = parseInt(form.numberGraduate);
        userData.numberPostGraduate = parseInt(form.numberPostGraduate);
    }
    else if (form.role === 'student') {
        //console.log("new student uid " + uid);
        userData.courses = [];
        userData.class = form.class;
        userData.ernedCredits = 0;
        userData.registeredCredits = 0;
        userData.gpa = 0;
        userData.faculty = form.faculty;
    }
    await setDoc(userDocRef, userData);
}

