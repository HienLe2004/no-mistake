import Footer from "../../components/Footer/Footer"
import './Login.css'
export default function Login() {
    return <>
        <div className="login-page">
            <section>
                <form className="add-form-login">
                    <h1>Đăng nhập tài khoản DEF LMS</h1>
                    <label>Tên tài khoản</label>
                    <input type="text" name="email"/>
                    <label>Mật khẩu</label>
                    <input type="password" name="password"/>
                    <button className="login-button"><a href="/">Đăng nhập</a></button>
                    <a href="#" target="_blank" className="forgot-password">Quên mật khẩu?</a>
                </form>
            </section>
        </div>
        <Footer/>
    </>
}