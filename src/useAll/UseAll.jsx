import React from "react";
import { addDoc, arrayRemove, arrayUnion, deleteField, doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.config";

//read exact field of data
export async function readTeacherData(path, rol) {
    const userDocRef = doc(db, path);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        const userRol = userDoc.data()[rol];
        return userRol;
    }
    return null;
}
//read all field of this data, like object
export async function readTeacherData2(path) {
    const userDocRef = doc(db, path);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        const userRol = userDoc.data();
        return userRol;
    }
    return null;
}

//add, delete element in array
export async function addElementToArray(path, field, val) {
    const docRef = doc(db, path)
    try {
        await updateDoc(docRef, {
            [field]: arrayUnion(doc(db, val))
        })
        console.log('successfull update')
    } catch (error) {
        console.log('cannot update data')
    }
}
export async function deleteElementInArray(path, field, val) {
    const docRef = doc(db, path)
    try {
        await updateDoc(docRef, {
            [field]: arrayRemove(doc(db, val))
        })
        console.log('delete success')
    } catch (error) {
        console.log('cannot delete data')
    }
}
//end add, delete element in array

export async function readUserDoc1(uid) {
    const userDocRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userDocRef);
    if (userDoc.exists()) {
        const userRole = userDoc.data().role;
        // console.log("read role " + userRole);
        return userRole;
    }
    return null;
}

/* update and delete field not array */
//update field not array, if not exist -> create this field
export async function updateField(path, field, val) {
    const docRef = doc(db, path)
    try {
        await updateDoc(docRef, { [field]: doc(db, val) })
        console.log('update teacher to course oke')
    } catch (error) {
        console.log(error)
    }
}
//delete field
export async function deleteOneField(path, field) {
    const docRef = doc(db, path)
    try {
        await updateDoc(docRef, {
            [field]: deleteField()
        })
        console.log(`delete ${field} success`)
    } catch (error) {
        console.log(`delete ${field} fail`)
    }
}
/*end update and delete field not array */

//not important
export default function UseALL() {
    return (
        <>
            <div>check all</div>
        </>
    )
}