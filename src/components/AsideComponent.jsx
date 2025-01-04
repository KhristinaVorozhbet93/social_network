import React from 'react';
import style from './AsideComponent.module.css';
import { useNavigate } from "react-router-dom";
import profileIcon from '../images/userProfile.png';
import petIcon from '../images/petProfile.png';
import friendsIcon from '../images/friends.png';
import chatsIcon from '../images/chats.png';
import calendarIcon from '../images/calendar.png';
import storeIcon from '../images/shop.png';
import forumIcon from '../images/forum.png';
import settingsIcon from '../images/settings.png';


function AsideComponent() {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <aside className={style.aside}>
            <div className={style.container}> 
                <div onClick={() => handleNavigate('/profile/user')}>
                    Мой профиль
                    <img src={profileIcon} alt="Profile Icon" className={style.icon} />
                </div>
                <div onClick={() => handleNavigate('/profile/pet')}>
                    Профиль животного
                    <img src={petIcon} alt="Pet Icon" className={style.icon} />
                </div>
                <div onClick={() => handleNavigate('/fiends')}>
                    Друзья
                    <img src={friendsIcon} alt="Friends Icon" className={style.icon} />
                </div>
                <div onClick={() => handleNavigate('/chats')}>
                    Сообщения
                    <img src={chatsIcon} alt="Chats Icon" className={style.icon} />
                </div>
                <div onClick={() => handleNavigate('/profile')}>
                    Календарь
                    <img src={calendarIcon} alt="Calendar Icon" className={style.icon} />
                </div>

                <div onClick={() => handleNavigate('/profile')}>
                    Магазин
                    <img src={storeIcon} alt="Store Icon" className={style.icon} />
                </div>
                <div onClick={() => handleNavigate('/profile')}>
                    Форум
                    <img src={forumIcon} alt="Forum Icon" className={style.icon} />
                </div>
                <div onClick={() => handleNavigate('/profile')}>
                    Настройки
                    <img src={settingsIcon} alt="Settings Icon" className={style.icon} />
                </div>
            </div>
        </aside>
    );
}

export default AsideComponent; 