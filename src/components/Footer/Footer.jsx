//Le Ngoc Hien
import React, { useState, useEffect } from 'react';
import Logo from '../../assets/logoBK.png'
import LogoFB from '../../assets/logoFB.png'
import LogoIG from '../../assets/logoIG.png'
import LogoYT from '../../assets/logoYT.png'
import LogoTT from '../../assets/logoTT.png'
import LogoLI from '../../assets/logoLI.png'
import './Footer.css'

export default function Footer() {
    return <>
    <div className='footer'>
        <div className='information'>
            <div className='about'>
                <div className='university'>
                    <img src={Logo} alt='logo' className='logo'></img>
                    <div className='university-name'>
                        <p>ĐẠI HỌC QUỐC GIA THÀNH PHỐ ABC</p>
                        <p>TRƯỜNG ĐẠI HỌC DEF</p>
                    </div>
                </div>
                <div className='campus'>
                    <p>Cơ sở 1: Số 1 BAC, Phường CAB, Quận BCA, TP. ABC</p>
                    <p>Cơ sở 2: Số 2 EDF, Phường FED, Quận DFE, TP. DEF</p>
                </div>  
            </div>
            <nav className='support'>
                <ul>
                    <p>Thông tin liên hệ và hỗ trợ:</p>
                    <li>
                        <p>Email: support-service@def.edu.vn</p>
                    </li>
                    <li>
                        <p>ĐT (Tel.): (84-8) 88888888 - 9999</p>
                    </li>
                </ul>
            </nav>
            <nav className='social-media'>
                <p>Liên kết mạng xã hội:</p>
                <ul>
                    <li>
                        <a href='https://google.com' target='_blank' title='link'>
                            <img src={LogoFB} alt='Facebook' className='logo'></img>
                        </a>
                    </li>
                    <li>
                        <a href='https://google.com' target='_blank' title='link'>
                            <img src={LogoIG} alt='Instagram' className='logo'></img>
                        </a>
                    </li>
                    <li>
                        <a href='https://google.com' target='_blank' title='link'>
                            <img src={LogoYT} alt='Youtube' className='logo'></img>
                        </a>
                    </li>
                    <li>    
                        <a href='https://google.com' target='_blank' title='link'>
                            <img src={LogoLI} alt='LinkedIn' className='logo'></img>
                        </a>
                    </li>
                    <li> 
                        <a href='https://google.com' target='_blank' title='link'>
                            <img src={LogoTT} alt='Tiktok' className='logo'></img>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
        
        <div className='copyright'>
            <p>Copyright 2024-2025 LMS DEF - Phát triển bởi No Mistake</p>
        </div> 
    </div>
    
    </>
}