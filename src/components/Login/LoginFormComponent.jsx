import React, { useState, useEffect } from "react";
import style from "./Login.module.css";
import { useNavigate } from "react-router-dom";
import { useAccountApi } from '../../App';
import PawComponent from "../Paw/PawComponent";

function LoginFormComponent () {
    const
        [email, setEmail] = useState(''),
        [password, setPassword] = useState(''),
        [passwordError, setPasswordError] = useState(false),
        [errorMessage, setErrorMessage] = useState(""),
        accountApi = useAccountApi(),      
        navigate = useNavigate();

  const submitAuthentificationData = async (e) => {
    e.preventDefault();

    try {
        if (password && email) {
            const response = await accountApi.login(email, password);
            localStorage.setItem('authToken', response.token);
            localStorage.setItem('accountId', response.id);
            setPasswordError(false);
            navigate("/profile/user");
        } else {
            setErrorMessage("Заполните все поля");
            setPasswordError(true);
        }
    } catch (error) {
        setErrorMessage(error.message);
        setPasswordError(true);
    }
}

const handleRegistrationClick = async (e) => {
    e.preventDefault();
    navigate("/auth/registration");
}

const handleForgotPasswordClick = async (e) => {
    e.preventDefault();
    navigate("/auth/password");
}

useEffect(() => {
  return () => {
  };
}, []);
  return (
    <div className={`${style.registration} ${style.box}`}>
      <PawComponent/>
      <p className={`${style.text} ${style.text_size}`}>ДАЙ ЛАПУ</p>
      <p className={style.text}>Вход</p>
  
      <hr className={style.line} />
      <form onSubmit={submitAuthentificationData}>
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
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label
            className={style.hidden_field}
            id="incorrectData"
            hidden={!passwordError}
          >
            {errorMessage}
          </label>
        </div>
        <button className={style.button_form} type="submit">
          Войти
        </button>
      </form>

      <div className={style.group_buttons}>
        <button
          className={style.button}
          type="button"
          onClick={handleForgotPasswordClick}
        >
          Забыли пароль?
        </button>
        <button
          className={style.button}
          type="button"
          onClick={handleRegistrationClick}
        >
          Регистрация
        </button>
      </div>
      <PawComponent/>
    </div>
  );
};

export default LoginFormComponent;