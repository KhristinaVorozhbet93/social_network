import React from 'react';
import style from './AsideComponent.module.css';
import { useNavigate } from "react-router-dom";
import profileIcon from '../../images/userProfile.png';
import petIcon from '../../images/petProfile.png';
import friendsIcon from '../../images/friends.png';
import chatsIcon from '../../images/chats.png';
import calendarIcon from '../../images/calendar.png';
import storeIcon from '../../images/shop.png';
import forumIcon from '../../images/forum.png';
import serviceIcon from '../../images/services.png';
import settingsIcon from '../../images/settings.png';
import reservationIcon from '../../images/reservation.png';

function AsideComponent() {
    const navigate = useNavigate();

    const handleNavigate = (path) => {
        navigate(path);
    };

    return (
        <aside className={style.aside}>
        <div className={style.container}>
            <div className={style.menuItem} onClick={() => handleNavigate('/profile/user')}>
                <img src={profileIcon} alt="Profile Icon" className={style.icon} />
                <span>Мой профиль</span>
            </div>
            <div className={style.menuItem} onClick={() => handleNavigate('/profile/pet')}>
                <img src={petIcon} alt="Pet Icon" className={style.icon} />
                <span>Профиль животного</span>
            </div>
            <div className={style.menuItem} onClick={() => handleNavigate('/friends')}>
                <img src={friendsIcon} alt="Friends Icon" className={style.icon} />
                <span>Друзья</span>
            </div>
            <div className={style.menuItem} onClick={() => handleNavigate('/chats')}>
                <img src={chatsIcon} alt="Chats Icon" className={style.icon} />
                <span>Сообщения</span>
            </div>
            <div className={style.menuItem} onClick={() => handleNavigate('/calendar')}>
                <img src={calendarIcon} alt="Calendar Icon" className={style.icon} />
                <span>Календарь</span>
            </div>
            <div className={style.menuItem} onClick={() => handleNavigate('/services')}>
                <img src={serviceIcon} alt="Service Icon" className={style.icon} />
                <span>Услуги</span>
            </div>
                 <div className={style.menuItem} onClick={() => handleNavigate('/reservations')}>
                <img src={reservationIcon} alt="Reservation" className={style.icon} />
                <span>Бронирования</span>
            </div>
            <div className={style.menuItem} onClick={() => handleNavigate('/profile')}>
                <img src={settingsIcon} alt="Settings Icon" className={style.icon} />
                <span>Настройки</span>
            </div>

            {/* <div className={style.menuItem} onClick={() => handleNavigate('/profile')}>
                <img src={settingsIcon} alt="Settings Icon" className={style.icon} />
                <span>Настройки</span>
            </div>
            <div className={style.menuItem} onClick={() => handleNavigate('/profile')}>
                <img src={storeIcon} alt="Store Icon" className={style.icon} />
                <span>Магазин</span>
            </div>
            <div className={style.menuItem} onClick={() => handleNavigate('/profile')}>
                <img src={forumIcon} alt="Forum Icon" className={style.icon} />
                <span>Форум</span>
            </div> */}

        </div>
    </aside>
);
}

export default AsideComponent; 