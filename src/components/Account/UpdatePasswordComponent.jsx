import { useState } from "react";
import ContentContainer from "../ContentContainer";
import style from './UpdatePasswordComponent.module.css';
import { Snackbar, Alert, CircularProgress } from '@mui/material';
import { useAccountApi } from "../../App";
import { useNavigate } from "react-router-dom";

function UpdatePasswordAccount() {
    const
        [oldPassword, setOldPassword] = useState(false),
        [newPassword, setNewPassword] = useState(false),
        [checkNewPassword, setcheckNewPassword] = useState(false),
        [isLoading, setLoading] = useState(false),
        [snackbarOpen, setSnackbarOpen] = useState(false),
        [snackbarMessage, setSnackbarMessage] = useState(''),
        [snackbarSeverity, setSnackbarSeverity] = useState('success'),
        accountApi = useAccountApi(),
        navigate = useNavigate(),
        accountId = localStorage.getItem("accountId");

    const handleCancelEdit = () => {
        navigate("/profile/user");
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            if (newPassword != checkNewPassword) {
                setSnackbarSeverity('error');
                setSnackbarMessage('Новый пароль не совпадают');
                setSnackbarOpen(true);
                return;
            }
            await accountApi.updatePassword(accountId, oldPassword, newPassword);
            setSnackbarSeverity('success');
            setSnackbarMessage('Пароль успешно изменен');
            setSnackbarOpen(true);
            setTimeout(() => {
                navigate('/profile/user');
            }, 3000);
        }
        catch (error) {
            setSnackbarSeverity('error');
            setSnackbarMessage(error.message);
            setSnackbarOpen(true);
        } finally {
            setLoading(false);
        }
    };

    return (
        <ContentContainer>
            <h2>Изменение пароля</h2>
            <form onSubmit={handleSubmit} className={`${style.form_container}`}>
                <div className={style.form_group}>
                    <label htmlFor="oldPassword">Введите старый пароль:</label>
                    <input
                        type="password"
                        id="oldPassword"
                        onChange={(e) => setOldPassword(e.target.value)}
                        required
                        className={style.form_input}
                    />
                </div>
                <div className={style.form_group}>
                    <label htmlFor="newPassword">Введите новый пароль:</label>
                    <input
                        type="password"
                        id="newPassword"
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className={style.form_input}
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Пароль должен содержать по крайней мере одно число, одну заглавную и строчную буквы, а также не менее 8 и более символов"
                    />
                </div>
                <div className={style.form_group}>
                    <label htmlFor="checkNewPassword">Повторите новый пароль:</label>
                    <input
                        type="password"
                        id="checkNewPassword"
                        onChange={(e) => setcheckNewPassword(e.target.value)}
                        required
                        className={style.form_input}
                        pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                        title="Пароль должен содержать по крайней мере одно число, одну заглавную и строчную буквы, а также не менее 8 и более символов"
                    />
                </div>


                <div className={style.form_buttons}>
                    <button type="submit" className={style.form_button} disabled={isLoading}>
                        {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Изменить пароль'}
                    </button>
                    <button type="button" onClick={handleCancelEdit} className={style.form_button} disabled={isLoading}>
                        Отмена
                    </button>
                </div>
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
        </ContentContainer>

    );
}

export default UpdatePasswordAccount;