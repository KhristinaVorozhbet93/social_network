import React, { useState } from 'react';
import style from './PetPhotoUploadForm.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useAccountApi } from '../../App';
import CircularProgress from '@mui/material/CircularProgress';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import ContentContainer from '../ContentContainer';

function PetPhotoUploadForm() {
  const
    [selectedFile, setSelectedFile] = useState(null),
    [snackbarOpen, setSnackbarOpen] = useState(false),
    [snackbarMessage, setSnackbarMessage] = useState(''),
    [snackbarSeverity, setSnackbarSeverity] = useState('success'),
    [loading, setLoading] = useState(false),
    { id } = useParams(),
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
      formData.append('petId', id);
      formData.append('profileId', profileId);

      try {
        await accountApi.addPetPhoto(formData);
        setSelectedFile(null);
        showSnackbar('Фотография успешно загружена', 'success');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
    navigate('/profile/pet');
  };

  const handleCancel = () => {
    navigate('/profile/pet');
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
        <input type="file" onChange={handleFileChange} required disabled={loading} />
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
};

export default PetPhotoUploadForm;