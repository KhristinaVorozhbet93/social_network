import React, { useState, useEffect } from "react";
import style from "./CodeComponent.module.css";
import { useLocation, useNavigate } from "react-router-dom";
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

    useEffect(() => {
        const fetchDataOnLoad = async () => {
            const codeSent = localStorage.getItem('codeSent');

            if (!codeSent) {
                try {
                    await fetchCodeFromBackend();
                    localStorage.setItem('codeSent', 'true') 
                    console.log(code);
                }
                catch (error) {
                    setErrorMessage(error.message);
                    setError(true);
                }
            }
        };
        fetchDataOnLoad();
    }, []);

    const fetchCodeFromBackend = async () => {
        const email = location.state?.email;
        try {
            await accountApi.sendCodeToEmail(email);
        }
        catch (error) {
            setErrorMessage(error.message);
            setError(true);
        }
    }

    const resendCodeToEmail = async (e) => {
        e.preventDefault();
        const email = location.state?.email;
        try {
            const code = await accountApi.sendCodeToEmail(email);
            setSendCode(code);
        }
        catch (error) {
            setErrorMessage(error.message);
            setError(true);
        }
    }

    const submitChangePasswordData = async (e) => {
        e.preventDefault();
        try {
            if (code.trim() !== String(sendCode).trim()) {
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
            <form onSubmit={resendCodeToEmail}>
                <button className={style.button_form} type="submit">
                    Отправить код повторно
                </button>
            </form>
        </div>
    );
};

export default CodeFormComponent;