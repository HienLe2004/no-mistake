import React from "react";
import './LSC.css'
import { NavLink, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
export default function CourseList({courses}) {

    return (<>
        <div className="title">Danh sách khóa học</div>
        <div className="card-around">
            {courses.map((course) => (
                <button className="card-container" key={course.Newid}>
                    <img  src="https://picsum.photos/250/100" className="card-img"/>
                    <h1 className="card-title">{course.name}</h1>
                    <Link to = '/scoringpage' className = "card-title" > Change Student Points </Link>
                </button>
            ))}
            
        </div>
    </>);
}