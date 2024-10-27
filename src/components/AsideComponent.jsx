import React from 'react';
import style from './AsideComponent.module.css';
import { useNavigate } from "react-router-dom";

function AsideComponent() {
    const navigate = useNavigate(); 

    const handleNavigate = (path) => {
        navigate(path);
    };
    return <aside className={style.asid}>
        <div className={style.asid}>
            <div onClick={() => handleNavigate('/profile/user')}>Мой профиль</div>
            <div onClick={() => handleNavigate('/profile/pet')}>Профиль животного</div>
            <div onClick={() => handleNavigate('/profile')}>Друзья</div>
            <div onClick={() => handleNavigate('/profile')}>Сообщения</div>
            <div onClick={() => handleNavigate('/profile')}>Планировщик</div>
            <div onClick={() => handleNavigate('/profile')}>Уход</div>
            <div onClick={() => handleNavigate('/profile')}>Магазин</div>
            <div onClick={() => handleNavigate('/profile')}>Ветеринарные клиник</div>
            <div onClick={() => handleNavigate('/profile')}>Форум</div>
            <div  onClick={() => handleNavigate('/profile')}>Настройки</div>
        </div>

{/* 
        <div onClick={() => handleNavigate('/profile/user')}>Мой профиль</div>
        <div onClick={() => handleNavigate('/profile/pet')}>Профиль животного</div>
        <div onClick={() => handleNavigate('/profile')}>Друзья</div>
        <div onClick={() => handleNavigate('/profile')}>Сообщения</div>
        <div onClick={() => handleNavigate('/profile')}>Планировщик</div>
        <div onClick={() => handleNavigate('/profile')}>Уход</div>
        <div onClick={() => handleNavigate('/profile')}>Магазин</div>
        <div onClick={() => handleNavigate('/profile')}>Ветеринарные клиник</div>
        <div onClick={() => handleNavigate('/profile')}>Форум</div>
        <div className={style.listitem} onClick={() => handleNavigate('/profile')}>Настройки</div> */}


    </aside>
}

export default AsideComponent; 