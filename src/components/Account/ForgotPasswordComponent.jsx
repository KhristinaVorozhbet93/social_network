import React, { useState } from "react";
import style from "./ForgotPasswordComponent.module.css";
import { useNavigate } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import { useAccountApi } from '../../App';
import CircularProgress from '@mui/material/CircularProgress';
import FooterComponent from "../FooterComponent";

function ForgotPasswordComponent() {
  const
    [email, setEmail] = useState(''),
    [newPassword, setNewPassword] = useState(''),
    [checkNewPassword, setcheckNewPassword] = useState(''),
    [snackbarOpen, setSnackbarOpen] = useState(false),
    [snackbarMessage, setSnackbarMessage] = useState(''),
    [isLoading, setIsLoading] = useState(false),
    accountApi = useAccountApi(),
    navigate = useNavigate();

  const submitChangePasswordData = async (e) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      if (newPassword && checkNewPassword && email) {
        if (newPassword !== checkNewPassword) {
          showSnackbar("Пароли не совпадают", "error");
        }
        else {
          var response = await accountApi.isUserRegister(email, newPassword);
          var passworReponse = await accountApi.isTheSameUserPassword(email, newPassword);

          if (passworReponse) {
            showSnackbar("Новый пароль не должен совпадать со старым", "error");
            return;
          }

          if (response) {
            navigate("/auth/code", {
              state: {
                email: email,
                password: newPassword
              }
            });
          } else {
            showSnackbar("Пользователь с таким email не зарегистрирован", "error");
          }
        }
      } else {
        showSnackbar("Заполните все поля", "error");
      }
    } catch (error) {
      showSnackbar(error.message, "error");
    }
    finally {
      setIsLoading(false);
    }
  };

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
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
          <p className={style.text}>Изменение пароля</p>
          <hr className={style.line} />
          <form onSubmit={submitChangePasswordData}>
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
                placeholder="Введите новый пароль"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Пароль должен содержать по крайней мере одно число, одну заглавную и строчную буквы, а также не менее 8 и более символов"
                required
              />
            </div>
            <div>
              <input
                type="password"
                className={style.field}
                placeholder="Подтвердите новый пароль"
                value={checkNewPassword}
                onChange={(e) => setcheckNewPassword(e.target.value)}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Пароль должен содержать по крайней мере одно число, одну заглавную и строчную буквы, а также не менее 8 и более символов"
                required
              />
            </div>
            <button className={style.button_form} type="submit" disabled={isLoading}>
              {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Сохранить'}
            </button>
          </form>

          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            className={style.snackbar}
          >
            <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
              {snackbarMessage}
            </Alert>
          </Snackbar>
        </div>
      </div>
      <FooterComponent />
    </div>
  );
};

export default ForgotPasswordComponent;