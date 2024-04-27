import React, {useState} from "react";
import './CourseList.css'
import { useNavigate } from "react-router-dom";
export default function CourseList({courses}) {
    const enter = () => {console.log("i am in!!!")};
    return <>
        <div className="title">Danh sách khóa học</div>
        <div className="card-around">
            {courses.map(course => (
                <button onClick={enter()} className="card-container" key={course.nextid}>
                    <img src="https://picsum.photos/250/100" className="card-img"/>
                    <h1 className="card-title">{course.name}</h1>
                    {console.log(course.name)}
                </button>
            ))}
        </div>
    </>
}

