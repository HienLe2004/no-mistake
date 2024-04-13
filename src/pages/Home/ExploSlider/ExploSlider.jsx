import './ExploSlider.css'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import explo_img1 from "/src/assets/explore1.jpg"
import explo_img2 from "/src/assets/explore2.jpg"
import explo_img3 from "/src/assets/explore3.jpg"
import explo_img4 from "/src/assets/explore4.jpg"
import explo_img5 from "/src/assets/explore5.jpg"
import explo_img6 from "/src/assets/explore6.jpg"



export default function ExploSlider() {

    return <>
    {/* */}
    <HelmetProvider>
    <Helmet>
        <script
            src="./src/pages/Home/ExploSlider/app.js"
            crossorigin="anonymous"
            async
        ></script>
    </Helmet>
    <div className="carousel">
        <div className="list">
            <div className="item">
                <img src={explo_img1} alt='img'/>
                <div className="content">
                    <div className="title">CÚP TOÀN NĂNG</div>
                    <div className="buttons"></div>
                </div>
            </div>

            <div className="item">
                <img src={explo_img2} alt='img'/>
                <div className="content">
                    <div className="title">THỰC HÀNH CƠ KHÍ</div>
                    <div className="buttons"></div>
                </div>
            </div>

            <div className="item">
                <img src={explo_img3} alt='img'/>
                <div className="content">
                    <div className="title">XIN CHỮ ĐẦU NĂM</div>
                    <div className="buttons"></div>
                </div>
            </div>

            <div className="item">
                <img src={explo_img4} alt='img'/>
                <div className="content">
                    <div className="title">GIẢI CHẠY VIỆT DÃ</div>
                    <div className="buttons"></div>
                </div>
            </div>

            <div className="item">
                <img src={explo_img5} alt='img'/>
                <div className="content">
                    <div className="title">MÙA HÈ XANH 2023</div>
                    <div className="buttons"></div>
                </div>
            </div>

            <div className="item">
                <img src={explo_img6} alt='img'/>
                <div className="content">
                    <div className="title">MÙA HÈ XANH 2023</div>
                    <div className="buttons"></div>
                </div>
            </div>
            
        </div>
        <div className="thumbnail">
            <div className="item">
                <img src={explo_img1}/>
            </div>
            <div className="item">
                <img src={explo_img2}/>
            </div>
            <div className="item">
                <img src={explo_img3}/>
            </div>
            <div className="item">
                <img src={explo_img4}/>
            </div>
            <div className="item">
                <img src={explo_img5}/>
            </div>
            <div className="item">
                <img src={explo_img6}/>
            </div>
        </div>
        <div className="arrows">
            <button id="prev">Prev</button>
            <button id="next">Next</button>
        </div>
        <div className="time"></div>
    </div>

    <script src='./app.js'></script>
    </HelmetProvider>
    
    </>
}

