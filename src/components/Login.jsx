import { useState } from "react";
import { useAccountApi } from "../App";
import style from "../components/Login.module.css";
import image from "../images/pets.png"; 
import { useNavigate } from 'react-router-dom';

function Login() {

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
                await accountApi.Login(email, password);
                setPasswordError(false);
                //перенаправить на нужную страницу
                //navigate("/user/login");
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
        //сделать подмену страниц
        navigate("/auth/login/password");
    }

    return (
        <div className={style.main}>
            <hr />
            <div className={style.container}>
                <div className={`${style.img} ${style.box}`}>
                    <img src={image} className={style.image} />
                </div>

                <div className={`${style.registration} ${style.box}`}>
                <p className={`${style.text} ${style.text_size}`}>ДАЙ ЛАПУ</p>
                <p className={style.text}>Вход</p>
                    <hr className={style.line} />
                    <form onSubmit={submitAuthentificationData}>
                        <div>
                            <input type="email" className={style.field} placeholder="Введите e-mail" value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div>
                            <input type="password" className={style.field} placeholder="Введите пароль" value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                        <div>
                            <label className={style.hidden_field} id="incorrectData" hidden={!passwordError}>{errorMessage}</label>
                        </div>
                        <button className={style.button_form} type="submit">Войти</button>
                    </form>

                    <div className={style.group_buttons}>
                        <button className={style.button} type="submit" onClick={handleForgotPasswordClick}>Забыли пароль?</button>
                        <button className={style.button} type="submit" onClick={handleRegistrationClick}>Регистрация</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login; 