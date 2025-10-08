import React, { useState, useEffect } from "react";
import style from "./CodeComponent.module.css";
import { useLocation, useNavigate } from "react-router-dom";
import { useAccountApi } from '../../App';
import { Snackbar, Alert, CircularProgress } from '@mui/material';
import FooterComponent from "../FooterComponent";

function CodeComponent() {
    const
        [code, setCode] = useState(""),
        [sendCode, setSendCode] = useState(""),
        [isSubmitting, setIsSubmitting] = useState(false),
        [isResending, setIsResending] = useState(false),
        [snackbarOpen, setSnackbarOpen] = useState(false),
        [snackbarMessage, setSnackbarMessage] = useState(""),
        [snackbarSeverity, setSnackbarSeverity] = useState("error"),
        accountApi = useAccountApi(),
        location = useLocation(),
        navigate = useNavigate();

    useEffect(() => {
        const fetchDataOnLoad = async () => {
            const codeSent = localStorage.getItem('codeSent');

            if (!codeSent) {
                try {
                    setIsResending(true);
                    await fetchCodeFromBackend();
                    localStorage.setItem('codeSent', 'true');
                } finally {
                    setIsResending(false);
                }
            }
        };
        fetchDataOnLoad();
    }, []);

    const fetchCodeFromBackend = async () => {
        const email = location.state?.email;
        const code = await accountApi.sendCodeToEmail(email);
        setSendCode(code);
    }

    const resendCodeToEmail = async (e) => {
        e.preventDefault();
        const email = location.state?.email;
        try {
            setIsResending(true);
            const code = await accountApi.sendCodeToEmail(email);
            setSendCode(code);
            handleSnackbarOpen("Код повторно отправлен на вашу почту", "success");
        } finally {
            setIsResending(false);
        }
    }

    const submitChangePasswordData = async (e) => {
        e.preventDefault();
        e.preventDefault();
        try {
            if (code.trim() !== String(sendCode).trim()) {
                handleSnackbarOpen("Введен неверный код", "error");
            }
            else {
                setIsSubmitting(true);
                const { email, password } = location.state || {};
                console.log(email);
                console.log(password);
                await accountApi.resetPassword(email, password);
                handleSnackbarOpen("Пароль успешно изменен", "success");
                setTimeout(() => {
                    navigate("/auth/login");
                }, 5000);
            }

        } catch (error) {
            handleSnackbarOpen(error.message, "error");
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleSnackbarOpen = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    return (
        <div className={style.container}>
            <div className={style.main}>
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
                                disabled={isSubmitting || isResending}
                            />
                        </div>
                        <button className={style.button_form} type="submit" disabled={isSubmitting || isResending}>
                            {isSubmitting ? <CircularProgress size={24} color="inherit" /> : 'Изменить пароль'}
                        </button>
                    </form>
                    <form onSubmit={resendCodeToEmail}>
                        <button className={style.button_form} type="submit" disabled={isSubmitting || isResending}>
                            {isResending ? <CircularProgress size={24} color="inherit" /> : 'Отправить код повторно'}
                        </button>
                    </form>
                    <Snackbar
                        open={snackbarOpen}
                        autoHideDuration={5000}
                        onClose={handleSnackbarClose}
                        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                    >
                        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                            {snackbarMessage}
                        </Alert>
                    </Snackbar>
                </div>
            </div>
            <FooterComponent />
        </div>
    );
};

export default CodeComponent;