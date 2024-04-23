import React, { useState } from "react";
import "./Schedule.css";

const days = ["Thứ Hai", "Thứ Ba", "Thứ Tư", "Thứ Năm", "Thứ Sáu", "Thứ Bảy", "Chủ Nhật"];

const Schedule = ({ subjects, subjectColors }) => {
  const [selectedWeeks, setSelectedWeeks] = useState([]);
  const [showAllWeeks, setShowAllWeeks] = useState(false);

  const toggleWeek = (week) => {
    let updatedWeeks;
    if (selectedWeeks.includes(week)) {
      updatedWeeks = selectedWeeks.filter((selectedWeek) => selectedWeek !== week);
    } else {
      updatedWeeks = [...selectedWeeks, week];
    }
    setSelectedWeeks(updatedWeeks);
  };

  const toggleAllWeeks = () => {
    setShowAllWeeks(!showAllWeeks);
    setSelectedWeeks([]);
  };

  const renderWeek = (week) => {
    return (
      <div key={week} className="week">
        <button onClick={() => toggleWeek(week)} className={selectedWeeks.includes(week) ? "active" : ""}>
          Tuần {week}
        </button>
        {(showAllWeeks || selectedWeeks.includes(week)) && (
          <table style={{ marginTop: "10px" }}>
            <tbody>
              <tr>
                <th style={{ color: "#007bff", padding: "10px 15px" }}></th>
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((lessonIndex) => (
                  <th key={lessonIndex} style={{ color: "#007bff", padding: "10px 15px" }}>
                    Tiết {lessonIndex}
                  </th>
                ))}
              </tr>
              {days.map((day, dayIndex) => (
                <tr key={dayIndex}>
                  <th style={{ color: "#007bff", padding: "10px 15px" }}>{day}</th>
                  {Array(12)
                    .fill(null)
                    .map((_, lessonIndex) => {
                      const lesson = subjects.find(
                        (s) =>
                          s.day === day &&
                          s.classStart <= lessonIndex + 1 &&
                          s.classStart + s.classNum - 1 >= lessonIndex + 1 &&
                          (showAllWeeks || selectedWeeks.some((selectedWeek) => s.week.includes(selectedWeek)))
                      );
                      return (
                        <td
                          key={`${day}-${lessonIndex}-${week}`}
                          style={{
                            padding: "10px 15px",
                            backgroundColor: lesson
                              ? subjectColors[lesson.name] || "#f8f9fa"
                              : "#f8f9fa",
                          }}
                        >
                          {lesson ? `${lesson.name} ${lesson.classNo} ${lesson.room}` : null}
                        </td>
                      );
                    })}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };

  return (
    <div className="schedule">
      <div className="toggle-buttons">
        <button onClick={toggleAllWeeks}>
          {showAllWeeks ? "Ẩn tất cả" : "Hiện tất cả"}
        </button>
      </div>
      {subjects.length > 0 && subjects[0].week.map((week) => renderWeek(week))}
    </div>
  );
};

export default Schedule;