import {useEffect} from 'react'
import {NavLink, Outlet} from 'react-router-dom'
import {Helmet} from 'react-helmet-async'
import './ManagementLayout.css'
export default function ManagementLayout() {
    //Handle comditional UI
    useEffect(() => {
        import('../../components/ConditionalUI').catch(err => {
            console.log(err);
        })
    }, [])
    //Handle logout
    return(
        <div className='admin-layout'>
            <Helmet>
                <title>Trang quản lý | LMS-DEF-NM</title>
            </Helmet>
            <nav className='admin-nav'>
                <NavLink to='userlist/1' className='showAdmin start'>Người dùng</NavLink>
                <NavLink to='schedule' className='showAdmin end'>Lịch thi</NavLink>
            </nav>   
            <Outlet/>
        </div>
    )
}