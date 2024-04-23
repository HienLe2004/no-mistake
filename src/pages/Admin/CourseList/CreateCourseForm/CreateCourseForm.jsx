import './CreateCourseForm.css'
export default function CreateCourseForm() {
    return <div className="createCourseForm">
        <form>
            <label>Môn học:
                <input type='text' name='email'></input>
            </label>
            <label>Tòa học:
                <input type='text' name='email'></input>
            </label>
            <label>Tiết bắt đầu:
                <input type='text' name='email'></input>
            </label>
            <label>Thứ học:
                <input type='text' name='email'></input>
            </label>
            <label>Tuần học:
                <input type='text' name='email'></input>
            </label>
        </form>
    </div>
}