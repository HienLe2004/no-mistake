import { NavLink, Outlet, Link, useLocation } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Footer from '../../components/Footer/Footer';
import ImageSlider from '../../pages/Home/ImageSlider/ImageSlider';
import ExploSlider from '../../pages/Home/ExploSlider/ExploSlider';
import Introduce from '../../pages/Home/Introduce/Introduce';
import "./RootLayout.css";
import LogoBK from '../../assets/logoBK.png'
import { useEffect, useRef } from 'react'
import backgroundPic from '../../assets/bg-1.jpg'
const slides = [
    { url: "src/bg-1.jpg" },
    { url: "src/bg-2.jpg" },
    { url: "src/bg-3.jpg" },
];
const containerStyles = {
    width: "100%",
    height: "100vh",
    margin: "0 auto",
};

export default function RootLayOut() {
    const location = useLocation();
    const homeInfo = useRef();
    useEffect(() => {
        homeInfo.current.style.display = (window.location.pathname==='/')?"block":"none";
    }, [location])
    return(
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
                    <NavLink to="myCourses">Khóa học của tôi</NavLink>
                    <NavLink to="dashboard">Bảng điều khiển</NavLink>
                    <NavLink to="courses">Khóa học</NavLink>
                </div>
                <div className="right-nav">
                    <NavLink to="login">Đăng nhập</NavLink>
                </div>
            </nav>
            <div ref={homeInfo}>
                <div style={containerStyles}>
                    {/*<ImageSlider slides={slides} />*/}
                    <img src={backgroundPic} style={{width:"100%"}}></img>
                </div>
                <Introduce />
                <h2>Khám phá Bách Khoa</h2>
                {/**/}<ExploSlider />
            </div>       
            <Outlet />
            <Footer className='root-footer'/>
        </div>
    )
}