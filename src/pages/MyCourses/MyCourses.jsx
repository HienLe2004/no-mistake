import {Helmet} from 'react-helmet-async'
import CourseList from './CourseList/CourseList'

// Data for test UI
const courses = [
    { key: 100101, name: "Giải tích 1", teacher: "Nguyễn Văn A"},
    { key: 100102, name: "Cấu trúc dữ liệu và giải thuật", teacher: "Nguyễn Văn B" },
    { key: 100103, name: "Lập trình nâng cao", teacher: "Nguyễn Văn C" },
]

export default function MyCourses() {
    return <>
        <Helmet>
            <title>Khóa học của tôi | LMS-DEF-NM</title>
        </Helmet>
        {courses?<CourseList courses={courses} />:null}
    </>
}