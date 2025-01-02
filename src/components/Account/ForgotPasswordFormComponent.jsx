import React, { useState } from "react";
import style from "./ForgotPasswordComponent.module.css";
import { useNavigate } from "react-router-dom";
// import image from "../../images/paws.jpg";

function ForgotPasswordFormComponent() {
  const
    [email, setEmail] = useState(''),
    [newPassword, setNewPassword] = useState(''),
    [checkNewPassword, setcheckNewPassword] = useState(''),
    [error, setError] = useState(false),
    [errorMessage, setErrorMessage] = useState(""),
    navigate = useNavigate();

  const submitChangePasswordData = async (e) => {
    e.preventDefault();

    try {
      if (newPassword && checkNewPassword) {
        if (newPassword !== checkNewPassword) {
          setErrorMessage("Пароли не совпадают");
          setError(true);
        }
        else {
          setError(false);
          navigate("/auth/code", {
            state: {
              email: email,
              password: newPassword
            }
          });
        }
      } else {
        setErrorMessage("Заполните все поля");
        setError(true);
      }
    } catch (error) {
      setErrorMessage(error.message);
      setError(true);
    }
  }

  return (
    <div className={`${style.registration} ${style.box}`}>
      {/* <img src={image}className={style.img}/> */}
      <p className={`${style.text} ${style.text_size}`}>ДАЙ ЛАПУ</p>
      <p className={style.text}>Изменение пароля</p>
      <hr className={style.line} />
      <form onSubmit={submitChangePasswordData}>
      <div>
          <input
            type="email"
            className={style.field}
            placeholder="Введите e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            className={style.field}
            placeholder="Введите новый пароль"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <input
            type="password"
            className={style.field}
            placeholder="Подтвердите новый пароль"
            value={checkNewPassword}
            onChange={(e) => setcheckNewPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label
            className={style.hidden_field}
            id="incorrectData"
            hidden={!error}
          >
            {errorMessage}
          </label>
        </div>
        <button className={style.button_form} type="submit">
          Сохранить
        </button>
      </form>
    </div>
  );
};

export default ForgotPasswordFormComponent;