import React from 'react';
import style from './FooterComponent.module.css'
import SocialIcons from './SocialIcons';
import dog from '../images/dog.png';

function FooterComponent() {
    return (
        <footer className={style.footer}>
            <div className = {style.central}>
                <button className={style.text}>© 2025 Paws.ru - социальная сеть</button>
                <SocialIcons />
            </div>
            <div className={style.rightContent}>
                <img src={dog} alt="Логотип Paws.ru" className={style.logo} />
            </div>
        </footer>
    );
}

export default FooterComponent;