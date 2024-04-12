import Footer from "../../components/Footer/Footer";
import Header from "../../components/Header/Header";
import ImageSlider from "./ImageSlider/ImageSlide"
import './Home.css'
import Introduce from "./Introduce/Introduce";
import ExploSlider from "./ExploSlider/ExploSlider";

const slides = [
    { url: "/src/assets/bg-1.jpg" },
    { url: "/src/assets/bg-2.jpg" },
    { url: "/src/assets/bg-3.jpg" },
];
const containerStyles = {
    width: "100%",
    height: "100vh",
    margin: "0 auto",
};

export default function Home() {
    return <>
        <Header />
        <div style={containerStyles}>
            <ImageSlider slides={slides} />
        </div>
        <Introduce />
        <h2>Khám phá Bách Khoa</h2>
        <ExploSlider />
        <Footer />
        
    </>
}