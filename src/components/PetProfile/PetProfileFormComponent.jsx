import React, { useState } from 'react';
import style from './PetProfileUpdateComponent.module.css'
import { useAccountApi } from '../../App';
import { useNavigate } from 'react-router-dom';
import ContentContainer from '../Layout/ContentContainer';
import { Snackbar, Alert, CircularProgress } from '@mui/material';

function PetProfileFormComponent() {
  const
    [name, setName] = useState(''),
    [type, setType] = useState(''),
    [gender, setGender] = useState(''),
    [age, setAge] = useState(''),
    [description, setDescription] = useState(''),
    [selectedFile, setSelectedFile] = useState(null),
    [isLoading, setLoading] = useState(false),
    [snackbarOpen, setSnackbarOpen] = useState(false),
    [snackbarMessage, setSnackbarMessage] = useState(''),
    [snackbarSeverity, setSnackbarSeverity] = useState('success'),
    [previewURL, setPreviewURL] = useState(null),
    accountApi = useAccountApi(),
    navigate = useNavigate(),
    profileId = localStorage.getItem('profileId');

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
      const newProfile = new FormData();
      newProfile.append('profileId', profileId);
      newProfile.append('name', name);
      newProfile.append('type', type);
      newProfile.append('gender', gender);
      newProfile.append('age', parseInt(age));
      newProfile.append('description', description);

      if (selectedFile) {
        newProfile.append('file', selectedFile);
      } else {
        const defaultImage = require('../../images/default.png');
        const response = await fetch(defaultImage);
        const blob = await response.blob();
        newProfile.append('file', blob, 'default.png');
      }

      await accountApi.saveProfile(newProfile);
      setSnackbarSeverity('success');
      setSnackbarMessage('Профиль успешно создан');
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate('/profile/pet');
      }, 3000);
    }
    finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    navigate('/profile/pet');
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  return (
    <ContentContainer>
      <h2>Добавление профиля</h2>
      <form onSubmit={handleSubmit} className={`${style.form_container}`}>
        <div className={style.form_left}>
          <div className={style.form_group}>
            <label htmlFor="name">Кличка:</label>
            <input
              type="text"
              name="name"
              onChange={(e) => setName(e.target.value)}
              className={style.form_input}
              required
            />
          </div>

          <div className={style.form_group}>
            <label htmlFor="type">Вид:</label>
            <input
              type="text"
              name="type"
              onChange={(e) => setType(e.target.value)}
              className={style.form_input}
              required
            />
          </div>

          <div className={style.form_group}>
            <label htmlFor="gender">Пол:</label>
            <select
              required
              name="gender"
              onChange={(e) => setGender(e.target.value)}
              className={style.form_input}>
              <option value="">Выберите пол</option>
              <option value="Самец">Самец</option>
              <option value="Самка">Самка</option>
              <option value="Неизвестно">Неизвестно</option>
            </select>
          </div>

          <div className={style.form_group}>
            <label htmlFor="age">Возраст:</label>
            <input
              type="number"
              name="age"
              onChange={(e) => setAge(e.target.value)}
              className={style.form_input}
              required />
          </div>

          <div className={style.form_group}>
            <label htmlFor="description">Описание:</label>
            <textarea
              name="description"
              onChange={(e) => setDescription(e.target.value)}
              className={style.form_input} />
          </div>
        </div>


        <div className={style.form_right}>
          <div className={style.photoUploadForm}>
            <label htmlFor="profilePhoto">Фото профиля:</label>
            <input
              type="file"
              id="profilePhoto"
              onChange={handleFileChange}
              className={style.form_input}
            />
            {previewURL && (
              <img
                src={previewURL}
                alt="Предпросмотр"
                className={style.profile_preview}
              />
            )}
          </div>
        </div>
        
        <div className={style.form_buttons}>
          <button type="submit" className={style.form_button} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Сохранить'}
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
    </ContentContainer >
  );
}

export default PetProfileFormComponent;