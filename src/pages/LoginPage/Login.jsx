//Le Ngoc Hien
import './Login.css'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../firebase.config'
import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from "react-helmet-async"
export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();
    //Handle login, if successed then navigate to home page else display error
    const handleSubmit = async (e) => {
        e.preventDefault();
        let error = [];
        try {
            const email = emailRef.current.value;
            const password = passwordRef.current.value;
            await signInWithEmailAndPassword(auth, email, password);
            emailRef.current.value = '';
            passwordRef.current.value = '';
            navigate("/");
        }
        catch (err) {
            error.push("Đăng nhập không thành công!");
            emailRef.current.value = '';
            passwordRef.current.value = '';
            //console.error(err);
        }
        if (error.length !== 0) alert(error);
    }
    return <>
        <Helmet>
            <title>Đăng nhập | LMS-DEF-NM</title>
        </Helmet>
        <div className="login-page">
            <section>
                <form onSubmit={handleSubmit} className="add-form-login">
                    <h1>Đăng nhập tài khoản DEF LMS</h1>
                    <label>Tên tài khoản
                        <input type="text" name="email" ref={emailRef} required />
                    </label>
                    <label>Mật khẩu
                        <input type="password" name="password" ref={passwordRef} required />
                    </label>
                    <button type="submit" className="login-button">Đăng nhập</button>
                    <a href="#" target="_blank" className="forgot-password">Quên mật khẩu?</a>
                </form>
            </section>
        </div>
    </>
}