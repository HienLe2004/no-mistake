//Le Ngoc Hien
import './CourseInformation.css'
import {useParams} from 'react-router-dom'
import {useState, useEffect} from 'react'
import {db} from '../../../../../firebase.config'
import Select from 'react-select'
import {doc, getDoc, updateDoc, getDocs, query, collection, where} from 'firebase/firestore'
import {listCapacity,listDay,listWeek,
    GetListBlock,GetListRoom,GetListSemester,GetListSubject} from '../CreateCourseForm/CreateCourseForm'
import {listStatus} from '../CourseList'
import {currentUser} from '../../../../components/ConditionalUI'
export default function CourseInformation() {
    const {cid} = useParams();
    //Use state for list of form data
    const [listSubject, setListSubject] = useState([]);
    const [listBlock, setListBlock] = useState([]);
    const [listRoom, setListRoom] = useState([]);
    const [listClassStart, setListClassStart] = useState(Array(12)
                            .fill().map((element,index)=>index+1));
    const [subjectDuration, setSubjectDuration] = useState(0);
    const [listSelectedWeek, setListSelectedWeek] = useState([]);
    const [listSemester, setListSemester] = useState([]);
    const [loading, setLoading] = useState(true);
    const [courseData, setCourseData] = useState();
    const [form, setForm] = useState({});
    useEffect(() => {
        const fetchCourseData = async () => {
            const data = await getCourseData(cid);
            setCourseData(data);
            setForm({
                subject: data.data().subject,
                name: data.data().name,
                capacity: data.data().capacity,
                classNum: data.data().classNum,
                classStart: data.data().classStart,
                status: data.data().status,
                block: data.data().room.slice(0,2),
                room: data.data().room.slice(3),
                day: data.data().day,
                semester: data.data().semester,
                week: data.data().week,
            })
            setListSelectedWeek(data.data().week);
            setSubjectDuration(data.data().week?.length);
            //console.log(data.data());
        }
        fetchCourseData();
    },[cid])
    //Function handles fetching initial data from firestore
    useEffect(() => {
        const fetchLists = async () => {
            const listSub = await GetListSubject();
            setListSubject(listSub);
            //form.subject = doc(db, 'subjects/' + listSub[0].id);
            //form.name = listSub[0].data().name;
            const listBlo = await GetListBlock();
            setListBlock(listBlo);
            //form.block = listBlo[0].id;
            const listSem = await GetListSemester();
            setListSemester(listSem);
            //form.semester = listSem[0].id;
        }
        fetchLists().then(() => setLoading(false));
    },[])
    //Function handles list room based on selected block
    useEffect(() => {
        const fetchList = async () => {
            if (form.block) {
                const list = await GetListRoom(form.block);
                setListRoom(list);
            }
        }
        fetchList();
    },[form.block])
    //Function handles list classStart and subjectDuration based on subject
    useEffect(() => {
        const currentSubject = listSubject.find(obj => {
            return obj.data().name === form.name
        })
        if (currentSubject) {
            setListClassStart(Array(13 - currentSubject.data().classNum)
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
            console.log(e.target.name + " " + e.target.value);
            setForm((prev)=>({
                ...prev,
                [e.target.name]: e.target.value
            }))
        }
    }
    const checkForm = async(e) => {
        e.preventDefault();
        let notiList = [];
        if (form?.capacity < courseData?.data().students?.length) 
            notiList.push(`Vui lòng nhập số lượng lớn hơn hoặc bằng số sinh viên đã đăng ký! (${courseData?.data().students?.length})`)
        if (form?.week?.length !== courseData?.data()?.week?.length)
            notiList.push(`Vui lòng nhập đúng số lượng tuần học! (${courseData?.data()?.week?.length}})`);
        if (currentUser.role !== "admin")
            notiList.push("Chỉ quản trị viên mới sử dụng được chức năng này!");
        if (notiList.length===0) {
            console.log(form);
            await UpdateCourseDatabase(form, cid).then(() => {
                notiList.push("Cập nhật khóa học thành công!");
            }).catch((err) => {
                console.log(err.message);
                notiList.push("Cập nhật khóa học thất bại!");
            })
        }
        let notiGroup = '';
        notiList.forEach(noti => notiGroup += (noti + '\n'));
        alert(notiGroup);
    }
    if (loading) return;
    return <div className="courseInformation" key={courseData?.id}>
        <form>
            <label className='subject'>Môn học:
                <select name='subject' onChange={handleChange}
                    defaultValue={form.subject?.id}>
                    {listSubject.map((subject) => {
                        //console.log(subject.id);
                        return <option key={subject.id} value={subject.id}>{subject.data().name}</option>
                    })}
                </select>    
            </label>
            <label className='block'>Tòa học:
                <select name='block' onChange={handleChange}
                    defaultValue={form.block}>
                    {listBlock.map((block) => {
                        return <option key={block.id} value={block.id}>{block.id}</option>
                    })}
                </select>    
            </label>
            <label className='room'>Phòng học:
                <select name='room' onChange={handleChange}
                    defaultValue={form.room}>
                    {listRoom.map((room) => {
                        return <option key={room} value={room}>{room}</option>
                    })}
                </select>    
            </label>
            <label className='classStart'>Tiết bắt đầu:
                <select name='classStart' onChange={handleChange}
                    defaultValue={form.classStart}>
                    {listClassStart.map((index) => {
                        return <option key={index}>{index}</option>
                    })}
                </select> 
            </label>
            <label className='day'>Ngày học:
                <select name='day' onChange={handleChange}
                    defaultValue={form.day}>
                    {listDay.map((index) => {
                        return <option key={index} value={index}>{index}</option>
                    })}
                </select> 
            </label>
            <p className='listWeek-container'>
                Tuần học ({listSelectedWeek?.length}/{subjectDuration}):
            </p>    
            <div className="listWeek">
                <Select options={listWeek} isMulti 
                        className='listWeek-select' 
                        onChange={SelectWeek}
                        placeholder="Danh sách tuần học"
                        defaultValue={form.week?.map((element,index) => {
                            return {value:element, label:element}
                        })}/>
            </div>
            <label className='semester'>Học kì:
                <select name='semester' onChange={handleChange}
                    defaultValue={form.semester}>
                    {listSemester.map((semester) => {
                        return <option key={semester.id}>{semester.id}</option>
                    })}
                </select>    
            </label>
            <label className='capacity'>Số lượng:
                <select name='capacity' onChange={handleChange}
                    defaultValue={form.capacity}>
                    {listCapacity.map((capacity) => {
                        return <option key={capacity}>{capacity}</option>
                    })}
                </select>    
            </label>
            <label className='status'>Trạng thái:
                <select name='status' onChange={handleChange}
                    defaultValue={form.status}>
                    {Object.keys(listStatus).map((key) => {
                        return <option key={key} value={key}>{listStatus[key]}</option>
                    })}
                </select>    
            </label>
            <button className="confirm-button" onClick={checkForm}>Cập nhật</button>
        </form>
    </div>    
}
//Function gets course's data from firestore
const getCourseData = async (cid) => {
    const courseDocRef = doc(db, 'courses', cid);
    return await getDoc(courseDocRef);
}
//Function creates course's database from form's data
const UpdateCourseDatabase = async (form, cid) => {
    const courseDocRef = doc(db, "courses", cid);
    let courseData = {
        classNum: parseInt(form.classNum),
        classStart: parseInt(form.classStart),
        week: form.week,
        day: form.day,
        name: form.name,
        room: form.block + '-' + form.room,
        semester: form.semester,
        subject: form.subject,
        capacity: parseInt(form.capacity),
        status: form.status
    }
    await updateDoc(courseDocRef, courseData);
}