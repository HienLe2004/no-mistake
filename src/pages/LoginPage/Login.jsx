import Footer from "../../components/Footer/Footer"
//import './auth'
import './Login.css'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../../firebase.config'
import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
export default function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const email = emailRef.current.value;
            const password = passwordRef.current.value;
            await signInWithEmailAndPassword(auth, email, password);
            console.log("login successed");
            emailRef.current.value = '';
            passwordRef.current.value = '';
            navigate("/");
        }
        catch(err) {
            console.log("login failed");
            emailRef.current.value = '';
            passwordRef.current.value = '';
            //console.error(err);
        }
    }
    return <>
        <div className="login-page">
            <section>
                <form onSubmit={handleSubmit} className="add-form-login">
                    <h1>Đăng nhập tài khoản DEF LMS</h1>
                    <label>Tên tài khoản
                        <input type="text" name="email" ref={emailRef} required/>
                    </label>
                    <label>Mật khẩu
                        <input type="password" name="password" ref={passwordRef} required/>
                    </label>
                    <button type="submit" className="login-button">Đăng nhập</button>
                    <a href="#" target="_blank" className="forgot-password">Quên mật khẩu?</a>
                </form>
            </section>
        </div>
        <Footer/>
    </>
}