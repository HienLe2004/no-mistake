import { db } from '../../../../firebase.config'
import { collection, getDocs } from 'firebase/firestore'
import { useEffect, useState } from 'react'
import './UserList.css'
import CreateUserForm from './CreateUserForm/CreateUserForm'

export default function UserList() {
    function UserCard({ data }) {
        return <>
            <div className='userCard'>
                {data.name} - {data.role} - {data.email}
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
        <div className='userlist-layout'>
            <h1>Danh sách người dùng</h1>
            <div className="userlist">
                {listUserData.map((user) => {
                    return <UserCard key={user.id} data={user.data()} />
                })}
            </div>
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