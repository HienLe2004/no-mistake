import React from 'react';
import './ExamSchedule.css';

const ExamSchedule = ({ subjects }) => {
  if (!subjects) {
    return <p>No subjects found. Please check your data source.</p>;
  }

  return (
    <table className="exam-table">
      <thead>
        <tr>
          <th rowSpan="2">MÃ MH</th>
          <th rowSpan="2">TÊN MH</th>
          <th rowSpan="2">NHÓM</th>
          <th colSpan="3">NGÀY KTGK</th>
          <th colSpan="3">NGÀY KTCK</th>
        </tr>
        <tr>
          <th>NGÀY</th>
          <th>GIỜ</th>
          <th>PHÒNG</th>
          <th>NGÀY</th>
          <th>GIỜ</th>
          <th>PHÒNG</th>
        </tr>
      </thead>
      <tbody>
        {subjects.map((subject, index) => (
          <tr key={index}>
            <td>{subject.code}</td>
            <td>{subject.name}</td>
            <td>{subject.classNo}</td>
            <td>{subject.middleDate}</td>
            <td>{subject.middleTime}</td>
            <td>{subject.middleRoom}</td>
            <td>{subject.finalDate}</td>
            <td>{subject.finalTime}</td>
            <td>{subject.finalRoom}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExamSchedule;