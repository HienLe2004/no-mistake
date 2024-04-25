import './CreateCourseForm.css'
import {db} from '../../../../../firebase.config'
import {getDocs, collection} from 'firebase/firestore'
import { useState, useEffect } from 'react'
const listClass = Array(12).fill().map((element, index)=>index+1);
const listDay = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'];
export default function CreateCourseForm() {
    const [listSubject, setListSubject] = useState([]);
    const [listBlock, setListBlock] = useState([]);
    const [listRoom, setListRoom] = useState([]);
    const [form, setForm] = useState({
        subject: "",
        name: "",
        block: "",
        room: "",
        classStart: "",
        day: "",
        
    })
    useEffect(() => {
        const fetchLists = async () => {
            const listS = await GetListSubject();
            setListSubject(listS);
            const listB = await GetListBlock();
            setListBlock(listB);
        }
        fetchLists();
    },[])
    return <div className="createCourseForm">
        <form>
            <label className='subject'>Môn học:
                <select name='subject'>
                    {listSubject.map((subject) => {
                        return <option key={subject.id}>{subject.data().name}</option>
                    })}
                </select>    
            </label>
            <label className='block'>Tòa học:
                <select name='block'>
                    {listBlock.map((block) => {
                        return <option key={block.id}>{block.id}</option>
                    })}
                </select>    
            </label>
            <label className='room'>Phòng học:
                <input type='text' name='room'></input>
            </label>
            <label className='classStart'>Tiết bắt đầu:
                <select name='clastStart'>
                    {listClass.map((index) => {
                        return <option key={index}>{index}</option>
                    })}
                </select> 
            </label>
            <label className='day'>Ngày học:
                <select name='day'>
                    {listDay.map((index) => {
                        return <option key={index}>{index}</option>
                    })}
                </select> 
            </label>
            <label>Tuần học:
                <input type='text' name='email'></input>
            </label>
        </form>
    </div>
}
//Function gets collection of subjects from firestore
const GetListSubject = async () => {
    let listsubject = [];
    const subjects = await getDocs(collection(db, 'subjects')).then((docs) => {
        docs.forEach((doc) => listsubject.push(doc));
    })
    return (listsubject);
}
//Function gets collection of blocks from firestore
const GetListBlock = async () => {
    let listblock = [];
    const blocks = await getDocs(collection(db, 'blocks')).then((docs) => {
        docs.forEach((doc) => listblock.push(doc));
    })
    return (listblock);
}