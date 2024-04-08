import './Header.css'
import Logo from '../../assets/logoBK.png'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'
export default function Header() {
    return <div className="nav-bar">
        <nav className='left-nav'>
            <Link to="/">
                <img src={Logo} alt='logo' className="logo"></img>
            </Link>
            <ul>
                <CustomLink to="/">Trang chủ</CustomLink>
                <CustomLink to="/my">Bảng điều khiển</CustomLink>
                <CustomLink to="/my/courses">Các khóa học của tôi</CustomLink>
                <CustomLink to="/course">Khóa học</CustomLink>
            </ul>
        </nav>
        <nav className='right-nav'>
            <ul>
                <CustomLink to="/login">Đăng nhập</CustomLink>
            </ul>
        </nav>
    </div>
}

function CustomLink({to, children, ...props}) {
    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({path: resolvedPath.pathname, end: true});
    return (
        <li className={isActive ? "active" : ""}>
            <Link to={to} {...props}>
                {children}
            </Link>
        </li>
    )
}