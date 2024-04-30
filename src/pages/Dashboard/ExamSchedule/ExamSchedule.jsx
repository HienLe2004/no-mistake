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
            <td>{subject.middle[0]}</td>
            <td>{subject.middle[1]}</td>
            <td>{subject.middle[2]}</td>
            <td>{subject.final[0]}</td>
            <td>{subject.final[1]}</td>
            <td>{subject.final[2]}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExamSchedule;