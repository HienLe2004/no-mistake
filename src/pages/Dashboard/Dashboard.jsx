import React, { useState, useEffect } from 'react';
import ClassSchedule from './ClassSchedule/ClassSchedule';
import ExamSchedule from './ExamSchedule/ExamSchedule';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import { Helmet } from 'react-helmet-async'
import { currentUser } from '../../components/ConditionalUI';
import './Dashboard.css'

const generateRandomBlueColor = () => {
  const hue = Math.floor(Math.random() * 75) + 175;
  const saturation = Math.floor(Math.random() * 30) + 65;
  const lightness = Math.floor(Math.random() * 30) + 65;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

async function getCoursesForUser(userId) {
  const userRef = doc(db, 'users', userId);
  const userDoc = await getDoc(userRef);
  if (userDoc.exists) {
    return userDoc.data().courses;
  } else {
    console.log('No such document!');
    return [];
  }
}

async function getCourseData(courseRef) {
  const courseDoc = await getDoc(courseRef);
  if (courseDoc.exists) {
    return courseDoc.data();
  } else {
    console.log('No such course document:', courseRef);
    return null;
  }
}

export default function App() {
  const [activePage, setActivePage] = useState('main');
  const [subjectColors, setSubjectColors] = useState({});
  const [subjects, setSubjects] = useState([]);

  const handlePageChange = (page) => {
    setActivePage(page);
  };

  const assignColors = () => {
    const colors = {};
    subjects.forEach((subject) => {
      colors[subject.name] = generateRandomBlueColor();
    });
    setSubjectColors(colors);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user?.uid) {
        const coursesArray = await getCoursesForUser(user.uid);
        const subjects = [];
        for (const courseRef of coursesArray) {
          const courseData = await getCourseData(courseRef);
          if (courseData) {
            subjects.push({
              semester: courseData.semester,
              code: courseData.subject.id,
              name: courseData.name,
              classNo: courseData.classNo,
              room: courseData.room,
              day: courseData.day,
              classStart: courseData.classStart,
              classNum: courseData.classNum,
              week: courseData.week,
              final: courseData.final,
              finalRoom: courseData.finalRoom,
              middle: courseData.middle,
              middleRoom: courseData.middleRoom
            });
          }
        }

        setSubjects(subjects);
        assignColors();
      } else {
        console.log("User is not available. Cannot fetch courses.");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className='dashboard'>
      <Helmet>
        <title>Bảng điều khiển | LMS-DEF-NM</title>
      </Helmet>
      <ul>
        <li>{currentUser.role === 'student' && (
          <button onClick={() => handlePageChange('schedule')}>ClassSchedule</button>
        )}</li>
        <li><button onClick={() => handlePageChange('exam')}>ExamSchedule</button></li>
      </ul>

      {activePage === 'schedule' && currentUser.role === 'student' && (
        <div>
          <h1 style={{ color: '#007bff', textAlign: 'center', padding: '20px' }}>
            LỊCH HỌC CỦA TÔI
          </h1>
          <button onClick={assignColors}>Tạo màu ngẫu nhiên</button>
          <ClassSchedule subjects={subjects} subjectColors={subjectColors} />
        </div>
      )}

      {activePage === 'exam' && <ExamSchedule subjects={subjects} />}
    </div>
  );
}
