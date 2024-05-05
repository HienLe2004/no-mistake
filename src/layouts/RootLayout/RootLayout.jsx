//Le Ngoc Hien
import { NavLink, Outlet, Link, useLocation, Navigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Footer from '../../components/Footer/Footer';
//import ImageSlider from '../../pages/Home/ImageSlider/ImageSlider';
import ExploSlider from '../../pages/Home/ExploSlider/ExploSlider';
import Introduce from '../../pages/Home/Introduce/Introduce';
import "./RootLayout.css";
import LogoBK from '../../assets/logoBK.png'
import { useEffect, useRef } from 'react'
import backgroundPic from '../../assets/bg-1.jpg'
import { auth } from '../../../firebase.config'
/*
const slides = [
    { url: "src/bg-1.jpg" },
    { url: "src/bg-2.jpg" },
    { url: "src/bg-3.jpg" },
];*/
const containerStyles = {
    width: "100%",
    height: "90vh",
    margin: "0 auto",
    display: "flex"
};

export default function RootLayOut() {
    //Handle showing homeInfo
    const location = useLocation();
    const homeInfo = useRef();
    useEffect(() => {
        homeInfo.current.style.display = (window.location.pathname === '/') ? "block" : "none";
    }, [location])
    //Handle logout
    const handleLogout = async (e) => {
        try {
            const uid = auth.currentUser.email;
            await auth.signOut();
            console.log("logout successed " + uid);
        }
        catch (err) {
            console.log("logout failed");
            console.log(err.message);
        }
    }
    return (
        <div className='root-layout'>
            <Helmet>
                <title>Trang chủ | LMS-DEF-NM</title>
            </Helmet>
            <nav className='root-nav'>
                <div className='left-nav'>
                    <Link to="/">
                        <img src={LogoBK} alt='logo' className="logo"></img>
                    </Link>
                    <NavLink to="/">Trang chủ</NavLink>
                    <NavLink to="myCourses" className="showStudent showTeacher" 
                        style={{ display: "none" }}>Khóa học của tôi</NavLink>
                    <NavLink to="dashboard" className="showTeacher showStudent"
                        style={{ display: "none" }}>Bảng điều khiển</NavLink>
                    <NavLink to="courses" className="showUser"
                        style={{ display: "none" }}>Khóa học</NavLink>
                    <NavLink to="profile" className="showTeacher showStudent"
                        style={{ display: "none" }}>Cá nhân</NavLink>
                    <NavLink to="teaching" className="showTeacher"
                        style={{ display: "none" }}>Giảng dạy</NavLink>
                    <NavLink to="admin/userlist" className="showAdmin"
                        style={{ display: "none" }}>Quản lý</NavLink>
                </div>
                <div className="right-nav">
                    <NavLink to="login" className="hideUser" style={{ display: "none" }}>Đăng nhập</NavLink>
                    <NavLink to="/" onClick={handleLogout} className="showUser" style={{ display: "none" }}>Đăng xuất</NavLink>
                </div>
            </nav>
            <div ref={homeInfo}>
                <div style={containerStyles}>
                    {/*<ImageSlider slides={slides} />*/}
                    <img src={backgroundPic} style={{ width: "100%" }}></img>
                </div>
                <Introduce />
                <h2>Khám phá Bách Khoa</h2>
                <ExploSlider />
            </div>
            <Outlet />
            <Footer className='root-footer' />
        </div>
    )
}