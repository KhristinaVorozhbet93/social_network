import React, { useState } from 'react';
import style from "./Registration.module.css";
import Snackbar from '@mui/material/SnackbarContent';
import { useAccountApi } from '../../App';
import { useNavigate } from 'react-router-dom';


function RegistrationFormComponent() {
    const
        [email, setEmail] = useState(''),
        [password, setPassword] = useState(''),
        [confirmedPassword, setConfirmedPassword] = useState(''),
        [passwordError, setPasswordError] = useState(false),
        [errorMessage, setErrorMessage] = useState(""),
        [open, setOpen] = useState(false),
        accountApi = useAccountApi(),
        navigate = useNavigate();

    const submitRegistrationData = (async (e) => {
        e.preventDefault();

        try {
            const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
            if (password === confirmedPassword && email && passwordPattern.test(password)) {
                await accountApi.registerAccount(email, password);
                setPasswordError(false);
                navigate("/auth/login");
            } else if (password !== confirmedPassword) {
                setErrorMessage("Пароли не совпадают");
                setPasswordError(true);
            } else {
                setErrorMessage("Пароль должен содержать по крайней мере одно число, одну заглавную и строчную буквы, а также не менее 8 и более символов");
                setPasswordError(true);
            }
        } catch (error) {
            setErrorMessage(error.message);
            setPasswordError(true);
        }

    });

    return (
        <div className={`${style.registration} ${style.box}`}>
            <p className={`${style.text} ${style.text_size}`}>ДАЙ ЛАПУ</p>
            <p className={style.text}>Регистрация</p>
            <hr className={style.line} />
            <form onSubmit={submitRegistrationData}>
                <div>
                    <input className={style.field} type="email" placeholder='Введите e-mail' value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
                <div>
                    <input className={style.field} type="password" placeholder='Введите пароль' value={password} onChange={(e) => setPassword(e.target.value)}
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Пароль должен содержать по крайней мере одно число, одну заглавную и строчную буквы, а также не менее 8 и более символов" required />
                </div>
                <div>
                    <input className={style.field} type="password" placeholder='Повторите пароль' value={confirmedPassword} onChange={(e) => setConfirmedPassword(e.target.value)}
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Пароль должен содержать по крайней мере одно число, одну заглавную и строчную буквы, а также не менее 8 и более символов" required />
                </div>
                <div>
                    <label className={style.hidden_field} id="incorrectData" hidden={!passwordError}>{errorMessage}</label>
                </div>
                <button className={style.button} type="submit">Зарегистрироваться</button>
            </form>
        </div>
    );


    {/* <Snackbar
                    open={open}
                    autoHideDuration={3000}
                    onClose={() => setOpen(!open)}
                    message="Вы успешно зарегистрированы"
                    action={
                        <button onClick={() => setOpen(false)}>Закрыть</button>
                    }>
                </Snackbar> */}




}

export default RegistrationFormComponent;
