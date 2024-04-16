import { auth, db } from '../../firebase.config'
import { getDoc, doc } from 'firebase/firestore'

auth.onAuthStateChanged(user => {
    let showUser = document.querySelectorAll('.showUser');
    let hideUser = document.querySelectorAll('.hideUser');
    let showStudent = document.querySelectorAll('.showStudent');
    let showTeacher = document.querySelectorAll('.showTeacher');
    let showAddP = document.querySelectorAll('.showAddP');
    if (user) {
        showUser.forEach(el => {
            el.style.display = "flex";
        })
        hideUser.forEach(el => {
            el.style.display = "none";
        })
        readUserDoc(user.uid).then(role => {
            if (role == "student") {
                showStudent.forEach(el => {
                    el.style.display = "flex";
                })
            }
            else if (role == "teacher") {
                showTeacher.forEach(el => {
                    el.style.display = "flex";
                })
                showAddP.forEach(el => {
                    el.style.display = "flex";
                })
            }
            console.log('user ' + user.email + ' role ' + role);
        })
    }
    else {
        showUser.forEach(el => {
            el.style.display = "none";
        })
        showStudent.forEach(el => {
            el.style.display = "none";
        })
        showTeacher.forEach(el => {
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