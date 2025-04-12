import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './Login.module.css';
import { Snackbar, Alert, CircularProgress } from '@mui/material';
import { useAccountApi } from '../../App';

function LoginFormComponent() {
  const
    [email, setEmail] = useState(''),
    [password, setPassword] = useState(''),
    [isLoading, setIsLoading] = useState(false),
    [snackbarOpen, setSnackbarOpen] = useState(false),
    [snackbarMessage, setSnackbarMessage] = useState(''),
    accountApi = useAccountApi(),
    navigate = useNavigate();

  const submitAuthentificationData = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      if (password && email) {
        const response = await accountApi.login(email, password);
        localStorage.clear();
        localStorage.setItem('authToken', response.token);
        localStorage.setItem('accountId', response.id);
        const profile = await accountApi.getUserProfile(response.id);
        localStorage.setItem('profileId', profile.id);
        setIsLoading(false);
        navigate("/profile/user");
      } else {
        setIsLoading(false);
        showSnackbar("Заполните все поля", "error");
      }
    } catch (error) {
      setIsLoading(false);
      showSnackbar(error.message, "error");
    }
  }

  const handleRegistrationClick = async (e) => {
    e.preventDefault();
    navigate("/auth/registration");
  }

  const handleForgotPasswordClick = async (e) => {
    e.preventDefault();
    navigate("/auth/password");
  }

  const showSnackbar = (message) => {
    setSnackbarMessage(message);
    setSnackbarOpen(true);
  }

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };


  useEffect(() => {
    return () => {
    };
  }, []);

  return (
    <div className={`${style.registration} ${style.box}`}>
      <p className={`${style.text} ${style.text_size}`}>ДАЙ ЛАПУ</p>
      <p className={style.text}>Вход</p>

      <hr className={style.line} />
      <form onSubmit={submitAuthentificationData}>
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
            placeholder="Введите пароль"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <button className={style.button_form} type="submit" disabled={isLoading}>
          {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Войти'}
        </button>
      </form>

      <div className={style.group_buttons}>
        <button
          className={style.button}
          type="button"
          onClick={handleForgotPasswordClick}
        >
          Забыли пароль?
        </button>
        <button
          className={style.button}
          type="button"
          onClick={handleRegistrationClick}
        >
          Регистрация
        </button>
      </div>

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
  );
};

export default LoginFormComponent;