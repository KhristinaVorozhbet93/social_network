import { useState } from "react";
import { useAccountApi } from "../App";
import style from "../components/Login.module.css"
import image from "../images/pets.png"

function Login() {

    const
        [email, setEmail] = useState(''),
        [password, setPassword] = useState(''),
        accountApiClient = useAccountApi();

    const submitAuthentificationData = async (e) => {
        e.preventDefault();

        try {
            if (password && email) {
                await accountApiClient.Login(email, password);
                alert('Вы успешно вошли');
            } else {
                alert("Заполните корректно поля, помеченные звездочкой");
            }
        } catch (error) {
            console.log(error.message);
        }
    }





    return (
        <div className={style.main}>
            <hr />
            <div className={style.container}>
                <div className={`${style.img} ${style.box}`}>
                    <img src={image} className={style.image} />
                </div>

                <div className={`${style.registration} ${style.box}`}>
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
                            <label className={style.hidden_field} id="incorrectData" hidden>Неверный логин и/или пароль</label>
                        </div>
                        <button className={style.button_form} type="submit">Войти</button>
                    </form>

                    <div className={style.group_buttons}>
                        <button className={style.button} type="submit">Забыли пароль?</button>
                        <button className={style.button} type="submit">Регистрация</button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login; 