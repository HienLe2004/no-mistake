import './ScheduleInformation.css'
import {useParams} from 'react-router-dom'
import {useState, useEffect} from 'react'
import {db} from '../../../../../firebase.config'
import {doc, getDoc, updateDoc, getDocs, query, collection, where, addDoc} from 'firebase/firestore'
import {currentUser} from '../../../../components/ConditionalUI'
export const listHour = Array(24).fill().map((element,index)=>index);
export const listMinute = Array(60).fill().map((element,index)=>index);
export const listDay = Array(31).fill().map((element,index)=>index+1);
export const listMonth = Array(12).fill().map((element,index)=>index+1);
export default function ScheduleInformation() {
    const {cid} = useParams();
    const [listBlock, setListBlock] = useState([]);
    const [listRoom, setListRoom] = useState([]);
    const [loading, setLoading] = useState(true);
    const [courseData, setCourseData] = useState();
    const [form, setForm] = useState({middleBlock:"H1", finalBlock:"H1"});
    useEffect(() => {
        const fetchCourseData = async () => {
            const data = await getCourseData(cid);
            setCourseData(data);
            setForm({
                middle: data.data().middle,
                middleBlock: data.data().middleRoom?.slice(0,2),
                middleRoom: data.data().middleRoom?.slice(3),
                final: data.data().final,
                finalBlock: data.data().finalRoom?.slice(0,2),
                finalRoom: data.data().finalRoom?.slice(3),
            })
        }
        fetchCourseData();
    },[cid])

    useEffect(() => {
        const fetchLists = async () => {
            const listBlo = await GetListBlock();
            setListBlock(listBlo);
        }
        fetchLists().then(() => setLoading(false));
    },[])

    useEffect(() => {
        const fetchList = async () => {
            if (form.middleBlock) {
                const list = await GetListRoom(form.middleBlock);
                setListRoom(list);
                form.middleRoom = list[0];
            }
        }
        fetchList();
    },[form.middleBlock])

    useEffect(() => {
        const fetchList = async () => {
            if (form.finalBlock) {
                const list = await GetListRoom(form.finalBlock);
                setListRoom(list);
                form.finalRoom = list[0];
            }
        }
        fetchList();
    },[form.finalBlock])

    const handleChange = (e) => {
        if (e.target.name === 'middleDay') {
            form.middle.day = parseInt(e.target.value)
        }
        else if (e.target.name === 'middleMonth') {
            form.middle.month = parseInt(e.target.value)
        }
        else if (e.target.name === 'middleHour') {
            form.middle.hour = parseInt(e.target.value)
        }
        else if (e.target.name === 'middleMinute') {
            form.middle.minute = parseInt(e.target.value)
        }
        else if (e.target.name === 'finalDay') {
            form.final.day = parseInt(e.target.value)
        }
        else if (e.target.name === 'finalMonth') {
            form.final.month = parseInt(e.target.value)
        }
        else if (e.target.name === 'finalHour') {
            form.final.hour = parseInt(e.target.value)
        }
        else if (e.target.name === 'finalMinute') {
            form.final.minute = parseInt(e.target.value)
        }
        setForm((prev)=>({
            ...prev,
            [e.target.name]: e.target.value
        }))
    }

    const checkForm = async(e) => {
        e.preventDefault();
        let notiList = [];
        if (currentUser.role !== "admin")
            notiList.push("Chỉ quản trị viên mới sử dụng được chức năng này!");
        if (notiList.length===0) {
            await UpdateScheduleDatabase(form, cid).then(() => {
                notiList.push("Cập nhật lịch thi thành công!");
            }).catch((err) => {
                console.log(err.message);
                notiList.push("Cập nhật lịch thi thất bại!");
            })
        }
        let notiGroup = '';
        notiList.forEach(noti => notiGroup += (noti + '\n'));
        alert(notiGroup);
    }
    if (loading) return;
    return <div className="scheduleInformation" key={courseData?.id}>
        <form>
            <label className='middle'>Ngày thi giữa kì:
                <select name='middleDay' onChange={handleChange}
                    defaultValue={form.middle?.day}>
                    {listDay.map((index) => {
                        return <option key={index} value={index}>{index}</option>
                    })}
                </select>
                <select name='middleMonth' onChange={handleChange}
                    defaultValue={form.middle?.month}>
                    {listMonth.map((index) => {
                        return <option key={index} value={index}>{index}</option>
                    })}
                </select>
            </label>
            <label className='middle'>Giờ thi giữa kì:
                <select name='middleHour' onChange={handleChange}
                    defaultValue={form.middle?.hour}>
                    {listHour.map((index) => {
                        return <option key={index} value={index}>{index}</option>
                    })}
                </select>
                <select name='middleMinute' onChange={handleChange}
                    defaultValue={form.middle?.minute}>
                    {listMinute.map((index) => {
                        return <option key={index} value={index}>{index}</option>
                    })}
                </select>
            </label>
            <label className='middleBlock'>Tòa thi giữa kì:
                <select name='middleBlock' onChange={handleChange}
                    defaultValue={form.middleBlock}>
                    {listBlock.map((block) => {
                        return <option key={block.id} value={block.id}>{block.id}</option>
                    })}
                </select>    
            </label>
            <label className='middleRoom'>Phòng thi giữa kì:
                <select name='middleRoom' onChange={handleChange}
                    defaultValue={form.middleRoom}>
                    {listRoom.map((room) => {
                        return <option key={room} value={room}>{room}</option>
                    })}
                </select>    
            </label>
            <label className='final'>Ngày thi cuối kì:
                <select name='finalDay' onChange={handleChange}
                    defaultValue={form.final?.day}>
                    {listDay.map((index) => {
                        return <option key={index} value={index}>{index}</option>
                    })}
                </select>
                <select name='finalMonth' onChange={handleChange}
                    defaultValue={form.final?.month}>
                    {listMonth.map((index) => {
                        return <option key={index} value={index}>{index}</option>
                    })}
                </select>
            </label>
            <label className='final'>Giờ thi cuối kì:
                <select name='finalHour' onChange={handleChange}
                    defaultValue={form.final?.hour}>
                    {listHour.map((index) => {
                        return <option key={index} value={index}>{index}</option>
                    })}
                </select>
                <select name='finalMinute' onChange={handleChange}
                    defaultValue={form.final?.minute}>
                    {listMinute.map((index) => {
                        return <option key={index} value={index}>{index}</option>
                    })}
                </select>
            </label>
            <label className='finalBlock'>Tòa thi cuối kì:
                <select name='finalBlock' onChange={handleChange}
                    defaultValue={form.finalBlock}>
                    {listBlock.map((block) => {
                        return <option key={block.id}>{block.id}</option>
                    })}
                </select>    
            </label>
            <label className='finalRoom'>Phòng thi cuối kì:
                <select name='finalRoom' onChange={handleChange}
                    defaultValue={form.finalRoom}>
                    {listRoom.map((room) => {
                        return <option key={room}>{room}</option>
                    })}
                </select>    
            </label>
            <button className="confirm-button" onClick={checkForm}>Cập nhật</button>
        </form>
    </div>  
}

export const GetListBlock = async () => {
    let listblock = [];
    const blocks = await getDocs(collection(db, 'blocks')).then((docs) => {
        docs.forEach((doc) => listblock.push(doc));
    })
    return (listblock);
}

export const GetListRoom = async (block) => {
    let listroom = [];
    if (!block) return listroom;
    const rooms = await getDoc(doc(db, 'blocks', block)).then(blockDoc => {
        listroom = blockDoc.data().rooms;
    });
    return (listroom);
}

const getCourseData = async (cid) => {
    const courseDocRef = doc(db, 'courses', cid);
    return await getDoc(courseDocRef);
}

const UpdateScheduleDatabase = async (form, cid) => {
    const courseDocRef = doc(db, "courses", cid);
    let courseData = {
        middle: form.middle,
        middleRoom: form.middleBlock + '-' + form.middleRoom,
        final: form.final,
        finalRoom: form.finalBlock + '-' + form.finalRoom,
    }
    await updateDoc(courseDocRef, courseData);
}