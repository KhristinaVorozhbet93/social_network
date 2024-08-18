import React, { useEffect, useState } from 'react';
import AccountClient from '../api-client/account-api';
import style from "../components/Registration.module.css"
import image from "../images/pets.png"

function Registration() {
    const
        [email, setEmail] = useState(''),
        [password, setPassword] = useState(''),
        [confirmedPassword, setConfirmedPassword] = useState(''),
        accountApiClient = new AccountClient();


    const submitRegistrationData = (async (e) => {
        e.preventDefault();

        try {
            const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
            if (password === confirmedPassword && email && passwordPattern.test(password)) {
                await accountApiClient.registerAccount(email, password);
                alert('Вы успешно зарегистрированы');

            } else {
                alert("Заполните корректно поля, помеченные звездочкой");
            }
        } catch (error) {
            console.log(error.message);
        }

    });





    return (
        <div className={style.main}>
            <hr />
            <div className={style.container}>
                <div className={`${style.picture} ${style.box}`}>
                    <img src={image} className={style.picture_inner} />
                </div>
                <div className={`${style.registration} ${style.box}`}>
                    <p className={style.text}>Регистрация</p>
                    <hr className={style.line} />
                    <form onSubmit={submitRegistrationData}>
                        <div>
                            <input className={style.field} type="email" placeholder='Введите e-mail' value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                        <div>
                            <input className={style.field} type="password" placeholder='Введите пароль' value={password} onChange={(e) => setPassword(e.target.value)} required
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Пароль должен содержать по крайней мере одно число, одну заглавную и строчную буквы, а также не менее 8 и более символов" />
                        </div>
                        <div>
                            <input className={style.field} type="password" placeholder='Повторите пароль' value={confirmedPassword} onChange={(e) => setConfirmedPassword(e.target.value)}
                                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}" title="Пароль должен содержать по крайней мере одно число, одну заглавную и строчную буквы, а также не менее 8 и более символов" required />
                        </div>
                        <div>
                            <label className={style.hidden_field} id="incorrectData" hidden>Пароль должен содержать по крайней мере одно число, одну заглавную и строчную буквы, а также не менее 8 и более символов</label>
                        </div>
                        <button className={style.button} type="submit">Зарегистрироваться</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Registration;
