//Le Ngoc Hien
import './CreateCourseForm.css'
import {db} from '../../../../../firebase.config'
import {getDocs, collection, doc, getDoc, addDoc, query, where} from 'firebase/firestore'
import {currentUser} from '../../../../components/ConditionalUI'
import { useState, useEffect } from 'react'
import Select from 'react-select'
export const listDay = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm',
                 'Thứ Sáu', 'Thứ Bảy', 'Chủ Nhật'];
export const listWeek = Array(52).fill().map((element,index)=>{
    return {value:index+1,label:index+1}});
export const listCapacity = Array(400).fill().map((element,index)=>index+1);
export default function CreateCourseForm() {
    //Use state for list of form data
    const [listSubject, setListSubject] = useState([]);
    const [listBlock, setListBlock] = useState([]);
    const [listRoom, setListRoom] = useState([]);
    const [listClassStart, setListClassStart] = useState(Array(12)
                            .fill().map((element,index)=>index+1));
    const [subjectDuration, setSubjectDuration] = useState(0);
    const [listSelectedWeek, setListSelectedWeek] = useState([]);
    const [listSemester, setListSemester] = useState([]);
    //Use state for list of error const [listError, setListError] = useState([]);
    //Use state for form
    const [form, setForm] = useState({
        subject: "",
        name: "",
        block: "H1",
        room: "",
        classNum: 0,
        classStart: 1,
        day: listDay[0],
        week: [],
        semester: "",
        capacity: 1
    })
    //Function handles fetching initial data from firestore
    useEffect(() => {
        const fetchLists = async () => {
            const listSub = await GetListSubject();
            setListSubject(listSub);
            form.subject = doc(db, 'subjects/' + listSub[0].id);
            form.name = listSub[0].data().name;
            const listBlo = await GetListBlock();
            setListBlock(listBlo);
            form.block = listBlo[0].id;
            const listSem = await GetListSemester();
            setListSemester(listSem);
            form.semester = listSem[0].id;
        }
        fetchLists();
    },[])
    //Function handles list room based on selected block
    useEffect(() => {
        const fetchList = async () => {
            const list = await GetListRoom(form.block);
            setListRoom(list);
            form.room = list[0];
        }
        fetchList();
    },[form.block])
    //Function handles list classStart and subjectDuration based on subject
    useEffect(() => {
        const currentSubject = listSubject.find(obj => {
            return obj.data().name === form.name
        })
        if (currentSubject) {
            setListClassStart(Array(13 - (isNaN(currentSubject.data()?.classNum)?0:currentSubject.data()?.classNum))
            .fill().map((element,index)=>index+1));
            setSubjectDuration(currentSubject.data().duration);
            form.classNum = currentSubject.data().classNum;
        }
    },[form.subject])
    //Function gets array of selected weeks and set to listSelectedWeek
    const SelectWeek = (options) => {
        let list = [];
        options.forEach(option => {list.push(option.value)});
        list.sort((a,b)=>a-b);
        setListSelectedWeek(list);
        form.week = list;
    }
    //Function handles change of form
    const handleChange = (e) => {
        if (e.target.name === 'subject') {
            const index = e.target.selectedIndex;
            const text = e.target[index].text;
            setForm((prev)=>({
                ...prev,
                [e.target.name]: doc(db, 'subjects/' + e.target.value),
                ['name']: text
            }))
        }
        else {
            setForm((prev)=>({
                ...prev,
                [e.target.name]: e.target.value
            }))
        }
    }
    //Function validates form
    const checkForm = async (e) => {
        e.preventDefault();
        let notiList = [];
        if (form.week.length !== subjectDuration)
            notiList.push("Vui lòng nhập đúng số lượng tuần học!");
        if (currentUser.role !== "admin")
            notiList.push("Chỉ quản trị viên mới sử dụng được chức năng này!");
        if (notiList.length===0) {
            await CreateCourseDatabase(form).then(() => {
                notiList.push("Tạo khóa học thành công!");
            }).catch((err) => {
                console.log(err.message);
                notiList.push("Tạo khóa học thất bại!");
            })
        }
        let notiGroup = '';
        notiList.forEach(noti => notiGroup += (noti + '\n'));
        alert(notiGroup);
    }
    return <div className="createCourseForm">
        <form>
            <label className='subject'>Môn học:
                <select name='subject' onChange={handleChange}>
                    {listSubject.map((subject) => {
                        return <option key={subject.id} value={subject.id}>{subject.data().name}</option>
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
                <select name='classStart' onChange={handleChange}>
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
            <label className='semester'>Học kì:
                <select name='semester' onChange={handleChange}>
                    {listSemester.map((semester) => {
                        return <option key={semester.id}>{semester.id}</option>
                    })}
                </select>    
            </label>
            <label className='capacity'>Số lượng:
                <select name='capacity' onChange={handleChange}>
                    {listCapacity.map((capacity) => {
                        return <option key={capacity}>{capacity}</option>
                    })}
                </select>    
            </label>
            <button className="confirm-button" onClick={checkForm}>Tạo khóa học</button>
            {/* Form section for displaying errors 
            <div className="notiList" style={{display:(listError.length > 0)?"flex":"none"}}>
                {listError.map(error => {
                    return <p key={error}>{error}</p>
                })}
            </div>*/}
        </form>
    </div>
}
//Function gets collection of subjects from firestore
export const GetListSubject = async () => {
    let listsubject = [];
    const subjects = await getDocs(collection(db, 'subjects')).then((docs) => {
        docs.forEach((doc) => listsubject.push(doc));
    })
    return (listsubject);
}
//Function gets collection of blocks from firestore
export const GetListBlock = async () => {
    let listblock = [];
    const blocks = await getDocs(collection(db, 'blocks')).then((docs) => {
        docs.forEach((doc) => listblock.push(doc));
    })
    return (listblock);
}
//Function gets array of room from block document
export const GetListRoom = async (block) => {
    let listroom = [];
    if (!block) return listroom;
    //console.log('get list room at block '+block);
    const rooms = await getDoc(doc(db, 'blocks', block)).then(blockDoc => {
        listroom = blockDoc.data().rooms;
    });
    return (listroom);
}
//Function gets array of semester from firestore those are currently available (time dependent)
export const GetListSemester = async () => {
    let listsemester = [];
    const blocks = await getDocs(collection(db, 'semesters')).then((docs) => {
        docs.forEach((doc) => {
            const semesterEnd = new Date(doc.data().end['year'],
                                        doc.data().end['month'],
                                        doc.data().end['day']);
            const currentDate = new Date();
            if (semesterEnd.getTime() > currentDate.getTime())
                listsemester.push(doc) 
        });
    })
    return (listsemester);
}
//Function creates course from form's data
const CreateCourseDatabase = async (form) => {
    const coursesCollectionRef = collection(db, 'courses');
    const q = query(coursesCollectionRef, where('subject', '==', form.subject), 
                    where('semester', '==', form.semester));
    const querySnapshot = await getDocs(q);
    const classID = querySnapshot.size + 1;
    let courseData = {
        classNo: 'L'+('0'+classID).slice(-2),
        classNum: form.classNum,
        classStart: parseInt(form.classStart),
        week: form.week,
        day: form.day,
        name: form.name,
        room: form.block + '-' + form.room,
        semester: form.semester,
        subject: form.subject,
        capacity: parseInt(form.capacity),
        teacher:null,
        students:[],
        status: 'unpublished',
        final: {day:0,month:0,hour:0,minute:0},
        middle: {day:0,month:0,hour:0,minute:0},
        finalRoom: null,
        middleRoom: null
    };
    await addDoc(coursesCollectionRef, courseData).then(async docRef => {
        const dataCollectionRef = collection(docRef, 'data');
        await addDoc(dataCollectionRef,{});
    });
}
