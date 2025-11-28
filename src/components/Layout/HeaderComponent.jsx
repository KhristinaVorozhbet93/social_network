import React from 'react';
import style from './HeaderComponent.module.css'
import exitIcon from '../../images/exit.png';
import { useNavigate } from 'react-router-dom';
import logo from '../../images/logo.png'; 

function HeaderComponent() {
     const navigate = useNavigate();

  const handleOnMainPageClick = async (e) => {
    e.preventDefault();
    navigate("/profile/user");
  }

  const handleLogout = () => {
    localStorage.clear();
    navigate('/auth/login'); 
  };

  return (
    <header className={style.container}>   
      <button className={`${style.text} ${style.logo_text}`} onClick={handleOnMainPageClick}>Дай лапу</button>
      <img src={logo} alt="Логотип" className={style.logo} onClick={handleOnMainPageClick}/>
         <div className={style.exit}>
                <button className={`${style.text} ${style.exit_text}`} onClick={handleLogout}>Выход</button>
                <img src={exitIcon} alt="Exit Icon" className={style.icon} />
            </div>
    </header>
  );
}

export default HeaderComponent;