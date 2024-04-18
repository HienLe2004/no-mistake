import './CreateUserForm.css'
import {useState} from 'react'

export default function CreateUserForm() {
    const [form, setForm] = useState({
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: 0,
        day: 0,
        month: 0,
        year:0,
        gender: "",
        role: "",
        roleID: 0
    });
    const handleChange = (e) => {
        //Change gender field to input id
        if (e.target.name === 'gender') {
            setForm(prev => ({
                ...prev,
                [e.target.name]: e.target.id
            }))
        }
        //Change role field to input id and modify roleID to fit with that role
        else if (e.target.name === 'role') {
            const correctRoleID = document.querySelector(`#${e.target.id}ID`)
            setForm(prev => ({
                ...prev,
                [e.target.name]: e.target.id,
                roleID: correctRoleID.value
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
    const checkForm = (e) => {
        e.preventDefault();
        console.log(form);  
    }
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
                <label>Số điện thoại:
                    <input type='number' name='phoneNumber' onChange={handleChange}></input>
                </label>
                <label className='dateOfBirth'>Ngày tháng năm sinh:
                    <input type='number' name='day' min="1" max="31" onChange={handleChange}></input>
                    <input type='number' name='month' min="1" max="12" onChange={handleChange}></input>
                    <input type='number' name='year' min="1900" max="2024" onChange={handleChange}></input>
                </label>
            </div>
            <div className='gender'>
                <p>Giới tính:</p>
                <ul>
                    <li><label><input type='radio' name='gender' onChange={handleChange} id='male'/>Nam</label></li>
                    <li><label><input type='radio' name='gender' onChange={handleChange} id='female'/>Nữ</label></li>
                </ul>
            </div>
            <div className='role'>
                <p>Vai trò:</p>
                <ul>
                    <li><label><input type='radio' name='role' onChange={handleChange} id='admin'/>Quản trị viên</label></li>
                    <li><label><input type='radio' name='role' onChange={handleChange} id='teacher'/>Giảng viên</label></li>
                    <li><label><input type='radio' name='role' onChange={handleChange} id='student'/>Sinh viên</label></li>
                </ul>
            </div>
            
            <div className="roleInfo admin" style={{display:(form.role==='admin')?'flex':'none'}}>
                <label>Mã số quản trị viên:
                    <input type='number' name='roleID' onChange={handleChange} id='adminID'></input>
                </label>
            </div>
            <div className="roleInfo teacher" style={{display:(form.role==='teacher')?'flex':'none'}}>
                <label>Mã số giảng viên:
                    <input type='number' name='roleID' onChange={handleChange} id='teacherID'></input>
                </label>
            </div>
            <div className="roleInfo student" style={{display:(form.role==='student')?'flex':'none'}}>
                <label>Mã số sinh viên:
                    <input type='number' name='roleID' onChange={handleChange} id='studentID'></input>
                </label>
            </div>
            <button className='confirmButton' onClick={checkForm}>Tạo người dùng</button>
        </form>
    </div>
}