import React from 'react';
import style from './FooterComponent.module.css'
import SocialIcons from './SocialIcons';

function FooterComponent() {
    return (
        <footer className={style.footer}>
            <button className={style.text}>© 2024 Paws.ru - социальная сеть</button>
            <SocialIcons/>
        </footer>
    );
}

export default FooterComponent;