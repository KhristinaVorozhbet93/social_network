import React from 'react';
import pawImage from '../../images/paw.png';
import style from "./PawComponent.module.css";

function PawComponent() {
  return (
    <div className={style.paw}>
      <img className={style.paw_image} src={pawImage} alt="Paw" />
    </div>
  );
}

export default PawComponent;