import React from "react";
import './CourseList.css'
import { useNavigate } from "react-router-dom";
export default function CourseList({courses}) {
    let navigate = useNavigate(); 
    const handleClick = () =>{ 
        let path = `newPath`; 
        navigate(path);
    }
    return <>
        <div className="title">Danh sách khóa học</div>
        <div className="card-around">
            {courses.map(course => (
                <button /*onClick={handleClick}*/ className="card-container" key={course.nextid}>
                    <img src="https://picsum.photos/250/100" className="card-img"/>
                    <h1 className="card-title">{course.name}</h1>
                    {/* <p className="card-description">Giảng viên: {course.teacher}</p> */}
                </button>
            ))}
        </div>
        
    </>
}