import './CourseData.css'
import { useParams } from 'react-router-dom'
export default function CourseData() {
    const {cid} = useParams();
    return <h1> Course Data {cid} </h1>
}