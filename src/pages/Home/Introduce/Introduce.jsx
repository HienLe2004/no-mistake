import './Introduce.css'

export default function Introduce() {
    return <div className='introduce-layout'>
        <div className="achievement-header">
            <div className='achievement-hl'><span className='achievement-inside'>Thành tựu nổi bật</span></div>
            <div className='achievement-hl-text'>Một trong bốn trường đại học tại Việt Nam được công nhận đạt chất lượng kiểm định cơ sở giáo dục theo tiêu chuẩn HCERES, Châu Âu</div>
        </div>
        <div className='achievement-box-1'>
            <div className='achievement-box-2-odd'>
                <div className='achievement-box-3'>
                    <div className='number-achievement'>64</div>
                    <div className='text-achievement'>Chương trình đào tạo được công nhận đạt chuẩn bởi các tổ chức kiểm định uy tín trên thế giới</div>
                </div>
            </div>
            <div className='achievement-box-2-even'>
                <div className='achievement-box-3'>
                    <div className='number-achievement'>1.076</div>
                    <div className='text-achievement'>Bài báo khoa học công nghệ được đăng trên các tạp chí quốc tế uy tín quốc tế (Năm 2023)</div>
                </div>
            </div>
            <div className='achievement-box-2-odd'>
                <div className='achievement-box-3'>
                    <div className='number-achievement'>28.000</div>
                    <div className='text-achievement'>Sinh viên các hệ đào tạo</div>
                </div>
            </div>
            <div className='achievement-box-2-even'>
                <div className='achievement-box-3'>
                    <div className='number-achievement'>350</div>
                    <div className='text-achievement'>Đối tác trên toàn thế giới</div>
                </div>
            </div>
        </div>
    </div>
}