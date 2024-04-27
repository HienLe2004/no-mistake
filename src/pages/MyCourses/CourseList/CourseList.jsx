import React, {useState} from "react";
import './CourseList.css'
import { useNavigate } from "react-router-dom";
export default function CourseList({courses}) {
    // const [condition, setCondition] = useState(0);
    return <>
        <div className="title">Danh sách khóa học</div>
        <div className="card-around">
            {courses.map(course => (
                <button /*onClick={() => handleClick(course.reference)}*/ key={course.id} className="card-container" >
                    {/* <img src="https://picsum.photos/250/100" className="card-img"/> */}
                    <h1 className="card-title">{course.name}</h1>
                    {console.log(course.name)}
                </button>
            ))}
        </div>
    </>
}

