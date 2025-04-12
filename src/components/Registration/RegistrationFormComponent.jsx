import React, { useState } from 'react';
import style from "./Registration.module.css";
import { useAccountApi } from '../../App';
import { useNavigate } from 'react-router-dom';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

function RegistrationFormComponent() {
    const
        [email, setEmail] = useState(''),
        [password, setPassword] = useState(''),
        [confirmedPassword, setConfirmedPassword] = useState(''),
        [open, setOpen] = useState(false),
        [snackbarOpen, setSnackbarOpen] = useState(false),
        [snackbarMessage, setSnackbarMessage] = useState(''),
        [snackbarSeverity, setSnackbarSeverity] = useState("error"),
        [isLoading, setIsLoading] = useState(false),
        accountApi = useAccountApi(),
        navigate = useNavigate();

        const submitRegistrationData = async (e) => {
            e.preventDefault();
    
            setIsLoading(true);
    
            try {
                const passwordPattern = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}/;
                if (password === confirmedPassword && email && passwordPattern.test(password)) {
                    const formData = new FormData();
                    formData.append('email', email);
                    formData.append('password', password);

                    try {
                        const defaultImage = require('../../images/default.png');
                        const response = await fetch(defaultImage);
                        const blob = await response.blob();
                        formData.append('file', blob, 'default.png');
                    } catch (error) {
                        console.error("Error getting default image:", error);
                        showSnackbar("Ошибка при загрузке дефолтного изображения", "error");
                        setIsLoading(false);
                        return; 
                    }
    
                    await accountApi.registerAccount(formData);
                    setOpen(true);
                    setIsLoading(false);
                    showSnackbar("Вы успешно зарегистрированы", "success");
                    setEmail('');
                    setPassword('');
                    setConfirmedPassword('');
                    setTimeout(() => {
                        navigate("/auth/login");
                    }, 5000);
                } else if (password !== confirmedPassword) {
                    showSnackbar("Пароли не совпадают", "error");
                    setIsLoading(false);
                }
            } catch (error) {
                setIsLoading(false);
                if (error.message) {
                    showSnackbar(error.message, "error");
                } else {
                    showSnackbar("Ошибка при регистрации", "error");
                }
            }
        };
    
    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    }

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };
    return (
        <div className={`${style.registration} ${style.box}`}>
            <p className={`${style.text} ${style.text_size}`}>ДАЙ ЛАПУ</p>
            <p className={style.text}>Регистрация</p>
            <hr className={style.line} />
            <form onSubmit={submitRegistrationData}>
                <div>
                    <input
                        className={style.field}
                        type="email"
                        placeholder='Введите e-mail'
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        className={style.field}
                        type="password"
                        placeholder='Введите пароль'
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Пароль должен содержать по крайней мере одно число, одну заглавную и строчную буквы, а также не менее 8 и более символов"
                        required
                    />
                </div>
                <div>
                    <input
                        className={style.field}
                        type="password"
                        placeholder='Повторите пароль'
                        value={confirmedPassword}
                        onChange={(e) => setConfirmedPassword(e.target.value)}
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Пароль должен содержать по крайней мере одно число, одну заглавную и строчную буквы, а также не менее 8 и более символов"
                        required
                    />
                </div>
                <button className={style.button} type="submit" disabled={isLoading}>
                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Регистрация'}
                </button>
            </form>
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                className={style.snackbar}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
};

export default RegistrationFormComponent;