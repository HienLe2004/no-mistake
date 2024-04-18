import React, { useState } from "react";
import "./Schedule.css";

const days = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];

const Schedule = ({ subjects, subjectColors }) => {
    const renderWeek = (week) => {
        return (
          <div key={week} className="week">
            <h2 style={{ color: '#007bff' }}>Tuần {week}</h2>
            <table>
              <tbody>
                <tr>
                  <th style={{ color: '#007bff', padding: '10px 15px' }}></th>{}
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((lessonIndex) => (
                    <th key={lessonIndex} style={{ color: '#007bff', padding: '10px 15px' }}>Tiết {lessonIndex}</th>
                  ))}
                </tr>
                {days.map((day, dayIndex) => (
                  <tr key={dayIndex}>
                    <th style={{ color: '#007bff', padding: '10px 15px' }}>{day}</th>
                    {Array(10)
                      .fill(null)
                      .map((_, lessonIndex) => {
                        const lesson = subjects.find(
                          (s) =>
                            s.day === day &&
                            s.classStart <= lessonIndex + 1 &&
                            s.classStart + s.classNum - 1 >= lessonIndex + 1 &&
                            s.week.includes(week)
                        );
                        return (
                          <td
                            key={`${day}-${lessonIndex}-${week}`}
                            style={{
                              padding: '10px 15px',
                              backgroundColor: lesson ? subjectColors[lesson.name] || '#f8f9fa' : '#f8f9fa', // Use light gray color for cells without a lesson
                            }}
                          >
                            {lesson ? `${lesson.name} (${lesson.classStart}-${lesson.classStart + lesson.classNum - 1})` : ''}
                          </td>
                        );
                      })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
    };

  return (
    <div className="schedule">
      {subjects.length > 0 && subjects[0].week.map((week) => renderWeek(week))}
    </div>
  );
};

export default Schedule;