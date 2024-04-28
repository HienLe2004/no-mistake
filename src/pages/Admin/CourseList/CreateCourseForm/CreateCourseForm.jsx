import './CreateCourseForm.css'
import {db} from '../../../../../firebase.config'
import {getDocs, collection, doc, getDoc} from 'firebase/firestore'
import { useState, useEffect } from 'react'
import Select from 'react-select'
const listDay = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm',
                 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'];
const listWeek = Array(52).fill().map((element,index)=>{
    return {value:index+1,label:index+1}});
export default function CreateCourseForm() {
    //Use state for list of form data
    const [listSubject, setListSubject] = useState([]);
    const [listBlock, setListBlock] = useState([]);
    const [listRoom, setListRoom] = useState([]);
    const [listClassStart, setListClassStart] = useState(Array(12)
    .fill().map((element,index)=>index+1));
    const [subjectDuration, setSubjectDuration] = useState(15);
    const [listSelectedWeek, setListSelectedWeek] = useState([]);
    //Use state for form
    const [form, setForm] = useState({
        subject: "",
        name: "",
        block: "H1",
        room: "",
        classStart: "1",
        day: "Thứ hai",
        
    })
    //Function handles fetching initial data from firestore
    useEffect(() => {
        const fetchLists = async () => {
            const listS = await GetListSubject();
            setListSubject(listS);
            const listB = await GetListBlock();
            setListBlock(listB);
        }
        fetchLists();
    },[])
    //Function handles list room based on selected block
    useEffect(() => {
        const fetchList = async () => {
            const list = await GetListRoom(form.block);
            setListRoom(list);
        }
        fetchList();
    },[form.block])
    //Function handles list classStart and subjectDuration based on subject
    useEffect(() => {
        const currentSubject = listSubject.find(obj => {
            return obj.data().name === form.subject
        })
        if (currentSubject) {
            setListClassStart(Array(13 - currentSubject.data().classNum)
            .fill().map((element,index)=>index+1));
            setSubjectDuration(currentSubject.data().duration);
        }
    },[form.subject])
    //Function gets array of selected weeks and set to listSelectedWeek
    const SelectWeek = (options) => {
        let list = [];
        options.forEach(option => {list.push(option.value)});
        list.sort((a,b)=>a-b);
        console.log(list);
        setListSelectedWeek(list);
    }
    //Function handles change of form
    const handleChange = (e) => {
        setForm((prev)=>({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }
    return <div className="createCourseForm">
        <form>
            <label className='subject'>Môn học:
                <select name='subject' onChange={handleChange}>
                    {listSubject.map((subject) => {
                        return <option key={subject.id}>{subject.data().name}</option>
                    })}
                </select>    
            </label>
            <label className='block'>Tòa học:
                <select name='block' onChange={handleChange}>
                    {listBlock.map((block) => {
                        return <option key={block.id}>{block.id}</option>
                    })}
                </select>    
            </label>
            <label className='room'>Phòng học:
                <select name='room' onChange={handleChange}>
                    {listRoom.map((room) => {
                        return <option key={room}>{room}</option>
                    })}
                </select>    
            </label>
            <label className='classStart'>Tiết bắt đầu:
                <select name='clastStart' onChange={handleChange}>
                    {listClassStart.map((index) => {
                        return <option key={index}>{index}</option>
                    })}
                </select> 
            </label>
            <label className='day'>Ngày học:
                <select name='day' onChange={handleChange}>
                    {listDay.map((index) => {
                        return <option key={index}>{index}</option>
                    })}
                </select> 
            </label>
            <p className='listWeek-container'>
                Tuần học ({listSelectedWeek.length}/{subjectDuration}):
            </p>    
            <div className="listWeek">
                <Select options={listWeek} isMulti 
                        className='listWeek-select' 
                        onChange={SelectWeek}
                        placeholder="Danh sách tuần học"/>
            </div>
            
            <button className="confirm-button">Tạo khóa học</button>
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
//Function gets array of room from block document
const GetListRoom = async (block) => {
    let listroom = [];
    const rooms = await getDoc(doc(db, 'blocks', block)).then(blockDoc => {
        listroom = blockDoc.data().rooms;
    });
    return (listroom);
}