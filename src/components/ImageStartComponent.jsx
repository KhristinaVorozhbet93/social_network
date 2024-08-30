import React from "react";
import style from "./Login.module.css";

function ImageStartComponent({ image }) {
  return (
      <div className={`${style.img} ${style.box}`}>
        <img src={image} className={style.image} />
      </div>
    );
  };

export default ImageStartComponent;