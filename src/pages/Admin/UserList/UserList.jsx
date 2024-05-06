//Le Ngoc Hien
import { db } from '../../../../firebase.config'
import { collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import './UserList.css'
import CreateUserForm from './CreateUserForm/CreateUserForm'
import { NavLink, Outlet } from 'react-router-dom'

export default function UserList() {
    function UserCard({ uid ,data }) {
        return <>
            <div className='userCard'>
                <NavLink to={uid} >{data.name} - {data.role} - {data.email}</NavLink>
            </div>
        </>
    }
    const [hitCreateUser, setHitCreateUser] = useState(false);
    const [listUserData, setListUserData] = useState([]);
    useEffect(() => {
        async function fetchListUserData() {
            const list = await getListUserData();
            setListUserData(list);
        }
        fetchListUserData();
    }, [])
    return <>
        <div className='userlist-layout showAdmin'>
            <h1>Danh sách người dùng</h1>
            <div className="userlist">
                {listUserData.map((user) => {
                    return <UserCard key={user.id} uid={user.id} data={user.data()} />
                })}
            </div>
        <Outlet/>
            <button className='createUserButton'
                onClick={() => { setHitCreateUser(!hitCreateUser) }}
                style={{ backgroundColor: (hitCreateUser) ? "rgb(1, 125, 213)" : "rgb(0, 70, 120)" }}>Tạo người dùng mới</button>
            <p></p>
        </div>
        <div className="formContainer" style={{ display: (hitCreateUser) ? "flex" : "none" }}>
            <CreateUserForm />
        </div>
    </>
}

async function getListUserData() {
    let list = []
    const listUserDoc = await getDocs(collection(db, 'users')).then((docs) => {
        docs.forEach((doc) => {
            list.push(doc);
        })
    })
    return list;
}