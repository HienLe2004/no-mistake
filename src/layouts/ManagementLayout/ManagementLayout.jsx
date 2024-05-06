//Le Ngoc Hien
import {useEffect} from 'react'
import {NavLink, Outlet, useNavigate} from 'react-router-dom'
import {Helmet} from 'react-helmet-async'
import './ManagementLayout.css'
import {currentUser} from '../../components/ConditionalUI'
export default function ManagementLayout() {
    const navigate = useNavigate();
    useEffect(() => {
        //Handle admin page permission
        if (currentUser.role !== 'admin') {
            navigate('/');
        }
    }, [currentUser.role])
    
    return(
        <div className='admin-layout showAdmin'>
            <Helmet>
                <title>Trang quản lý | LMS-DEF-NM</title>
            </Helmet>
            <nav className='admin-nav'>
                <NavLink to='userlist' className='showAdmin start'>Người dùng</NavLink>
                <NavLink to='courselist' className='showAdmin'>Khóa học</NavLink>
                <NavLink to='announcement' className='showAdmin'>Thông báo</NavLink>
                <NavLink to='schedule' className='showAdmin end'>Lịch thi</NavLink>
            </nav>   
            <Outlet/>
        </div>
    )
}