import Footer from "../../components/Footer/Footer"
//import './auth'
import './Login.css'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../firebase.config'
import { useRef, useState,useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Helmet } from "react-helmet-async"
export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();
    const [errorList, setErrorList] = useState([]);
    const handleSubmit = async (e) => {
        e.preventDefault();
        let error = [];
        try {
            const email = emailRef.current.value;
            const password = passwordRef.current.value;
            await signInWithEmailAndPassword(auth, email, password);
            console.log("login successed");
            emailRef.current.value = '';
            passwordRef.current.value = '';
            navigate("/");
        }
        catch (err) {
            error.push("Đăng nhập không thành công!");
            console.log("login failed");
            emailRef.current.value = '';
            passwordRef.current.value = '';
            //console.error(err);
        }
        setErrorList(error);
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
                    <p style={{display:(errorList==[])?"none":"flex"}}>{errorList}</p>
                </form>
            </section>
        </div>
    </>
}