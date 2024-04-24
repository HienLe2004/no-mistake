import './CreateCourseForm.css'
import {db} from '../../../../../firebase.config'
import {getDocs, doc} from 'firebase/firestore'
const listBlock = ['H1','H2','H3','H6']
const listClass = Array(12).fill().map((element, index)=>index+1);
const listDay = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'];
export default function CreateCourseForm() {

    return <div className="createCourseForm">
        <form>
            <label>Môn học:
                <input type='text' name='subject'></input>
            </label>
            <label className='block'>Tòa học:
                <select name='block'>
                    {listBlock.map((index) => {
                        return <option key={index}>{index}</option>
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