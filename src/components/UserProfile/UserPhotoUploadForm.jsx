import React, { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import style from './UserPhotoUploadForm.module.css';
import { useAccountApi } from '../../App';
import ContentContainer from '../Layout/ContentContainer';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';

function UserUploadFormComponent() {
  const
    [selectedFile, setSelectedFile] = useState(null),
    [snackbarOpen, setSnackbarOpen] = useState(false),
    [snackbarMessage, setSnackbarMessage] = useState(''),
    [snackbarSeverity, setSnackbarSeverity] = useState('success'),
    [loading, setLoading] = useState(false),
    fileInputRef = useRef(null),
    accountApi = useAccountApi(),
    navigate = useNavigate(),
    profileId = localStorage.getItem('profileId');

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
    if (selectedFile) {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('profileId', profileId);

      try {
        await accountApi.addUserPhoto(formData);
        setSelectedFile(null);
        showSnackbar('Фотография успешно загружена', 'success');
      } catch (error) {
        console.error("Error uploading photo:", error);
        showSnackbar('Ошибка при загрузке фотографии', 'error');
      } finally {
        setSelectedFile(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
        setLoading(false);
        setLoading(false);
      }
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  const handleCancel = () => {
    navigate('/profile/user');
  }

  const showSnackbar = (message, severity) => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  return (
    <ContentContainer>
      <div className={style.formContent}></div>
      <div className={style.photoUploadForm}>
        <input
          type="file"
          onChange={handleFileChange}
          required
          disabled={loading}
          ref={fileInputRef}
        />
        {loading ? (
          <CircularProgress />
        ) : (
          <div className={style.formButtons}>
            <button onClick={handleSubmit} disabled={loading}>Загрузить</button>
            <button onClick={handleCancel} disabled={loading}>Отмена</button>
          </div>
        )}
      </div>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ContentContainer>
  );
}

export default UserUploadFormComponent;