import React, { useState, useEffect } from "react";
import style from "./CodeComponent.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import image from "../../images/paws.jpg";
import { useAccountApi } from '../../App';

function CodeFormComponent() {
    const
        [code, setCode] = useState(""),
        [sendCode, setSendCode] = useState(""),
        [error, setError] = useState(false),
        [errorMessage, setErrorMessage] = useState(""),
        accountApi = useAccountApi(),
        location = useLocation(),
        navigate = useNavigate();

    const fetchData = async () => {
        try {
            sendCodeToEmail();
        } catch (error) {
            setErrorMessage(error.message);
            setError(true);
        }
    };

    useEffect(() => {
        fetchData();
    });

    const sendCodeToEmail = async (e) => {
        const email = location.state?.email;
        const code = await accountApi.sendCodeToEmail(email);
        setSendCode(code);
    }

    const submitChangePasswordData = async (e) => {
        e.preventDefault();

        try {
            if (code !== sendCode) {
                setErrorMessage("Вы ввели неверынй код");
                setError(true);
            }
            else {
                const { email, password } = location.state || {};
                await accountApi.resetPassword(email, password);
                navigate("/auth/login");
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
            <p className={style.text}>Введите код, отправленный на вашу почту</p>
            <hr className={style.line} />
            <form onSubmit={submitChangePasswordData}>
                <div>
                    <input
                        type="text"
                        className={style.field}
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
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
                    Изменить пароль
                </button>
            </form>
            <form onSubmit={sendCodeToEmail}>
                <button className={style.button_form} type="submit">
                    Отправить код повторно
                </button>
            </form>
        </div>
    );
};

export default CodeFormComponent;