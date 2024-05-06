import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../../firebase.config';
import { onAuthStateChanged } from 'firebase/auth';
import React, { useState, useEffect } from 'react';
import Schedule from './Schedule/Schedule';
import {Helmet} from 'react-helmet-async'

const generateRandomBlueColor = () => {
  const hue = Math.floor(Math.random() * 75) + 175;
  const saturation = Math.floor(Math.random() * 30) + 65;
  const lightness = Math.floor(Math.random() * 30) + 65;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

export default function Teaching() {
  const [subjectColors, setSubjectColors] = useState({});
  const [subjects, setSubjects] = useState([]);
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
              name: courseData.name,
              classNo: courseData.classNo,
              room: courseData.room,
              day: courseData.day,
              classStart: courseData.classStart,
              classNum: courseData.classNum,
              week: courseData.week,
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
    <div>        
      <Helmet>
        <title>Giảng dạy | LMS-DEF-NM</title>
      </Helmet>
      <h1 style={{ color: '#007bff', textAlign: 'center', padding: '20px' }}>
        LỊCH GIẢNG DẠY CỦA TÔI
      </h1>
      <button onClick={assignColors}>Tạo màu ngẫu nhiên</button>{' '}
      <Schedule
        subjects={subjects}
        subjectColors={subjectColors}
      />
    </div>
  );
}

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