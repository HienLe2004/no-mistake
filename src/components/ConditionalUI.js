//Le Ngoc Hien
import { auth, db } from '../../firebase.config'
import { getDoc, doc } from 'firebase/firestore'
import { useState } from 'react';
export const currentUser = {role:''};
auth.onAuthStateChanged(user => {
    let showUser = document.querySelectorAll('.showUser');
    let hideUser = document.querySelectorAll('.hideUser');
    let showStudent = document.querySelectorAll('.showStudent');
    let showTeacher = document.querySelectorAll('.showTeacher');
    let showAdmin = document.querySelectorAll('.showAdmin');
    
    if (user) {
        showUser.forEach(el => {
            el.style.display = "flex";
        })
        hideUser.forEach(el => {
            el.style.display = "none";
        })
        readUserDoc(user.uid).then(role => {
            currentUser.role=role;
            if (role == "student") {
                showStudent.forEach(el => {
                    el.style.display = "flex";
                })
            }
            else if (role == "teacher") {
                showTeacher.forEach(el => {
                    el.style.display = "flex";
                })
            }
            else if (role == "admin") {
                showAdmin.forEach(el => {
                    el.style.display = "flex";
                })
            }
            //console.log('user ' + user.email + ' role ' + role);
        })
    }
    else {
        currentUser.role = "";
        showUser.forEach(el => {
            el.style.display = "none";
        })
        showStudent.forEach(el => {
            el.style.display = "none";
        })
        showTeacher.forEach(el => {
            el.style.display = "none";
        })
        showAdmin.forEach(el => {
            el.style.display = "none";
        })
        hideUser.forEach(el => {
            el.style.display = "flex";
        })
    }
})

async function readUserDoc(uid) {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        const userRole = userDoc.data().role;
        console.log("read role " + userRole);
        return userRole;
    }
    return null;
}
export default readUserDoc