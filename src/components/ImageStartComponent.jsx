import React from "react";
import style from "./ImageStartComponent.module.css";
import image from "../images/pets.png"
import PawComponent from "../components/Paw/PawComponent";

//TODO: сделать генерацию картинок каждй раз разную
function ImageStartComponent() {
  return (
    <div >
      <div className={style.container}>
        <div className={style.blurredImage}>
          <img
            src={image}
            className={style.img}
          />
        </div>

        <div className={style.clearImage}>
          <img
            src={image}
            className={style.image}
          />
        </div>
      </div>
    </div>
  );
}

export default ImageStartComponent;