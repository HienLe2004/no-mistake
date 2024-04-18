import React from "react";
import './CourseList.css'

export default function CourseList({courses}) {
    return <>
        <div className="title">Danh sách khóa học</div>
        <div className="card-around">
            {courses.map(course => (
                <button /*onClick={}*/ className="card-container" key={course.nextid}>
                    <img src="https://picsum.photos/250/100" className="card-img"/>
                    <h1 className="card-title">{course.name}</h1>
                    {/* <p className="card-description">Giảng viên: {course.teacher}</p> */}
                </button>
            ))}
        </div>
        
    </>
}