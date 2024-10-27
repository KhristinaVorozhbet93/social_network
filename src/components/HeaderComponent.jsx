import React from 'react';
import style from './HeaderComponent.module.css'

function HeaderComponent() {
    return (
        <header className={style.header}>Здесь будет информация
          <div >Мой профиль</div>
            <div >Профиль животного</div>
            <div>Друзья</div></header>
    );
}

export default HeaderComponent;