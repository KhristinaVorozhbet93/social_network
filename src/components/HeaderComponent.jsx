import React from 'react';
import style from './HeaderComponent.module.css'
import PawComponent from './Paw/PawComponent';
import { useNavigate } from 'react-router-dom';

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
      <PawComponent />
      <button className={style.text} onClick={handleOnMainPageClick}>Дай лапу</button>
         <div className={style.exit}>
                <button className={style.text} onClick={handleLogout}>Выход</button>
            </div>
    </header>
  );
}

export default HeaderComponent;