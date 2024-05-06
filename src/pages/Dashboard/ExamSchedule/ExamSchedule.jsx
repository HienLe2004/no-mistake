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
          <th rowSpan="2">HỌC KỲ</th>
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
            <td>{subject.semester}</td>
            <td>{subject.code}</td>
            <td>{subject.name}</td>
            <td>{subject.classNo}</td>
            <td>{subject.middle?.day}/{subject.middle?.month}</td>
            <td>{subject.middle?.hour}g{('0'+subject.middle?.minute).slice(-2)}</td>
            <td>{subject.middleRoom}</td>
            <td>{subject.final?.day}/{subject.final?.month}</td>
            <td>{subject.final?.hour}g{('0'+subject.final?.minute).slice(-2)}</td>
            <td>{subject.finalRoom}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ExamSchedule;
