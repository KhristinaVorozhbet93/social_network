import React, { useEffect, useState } from 'react';
import { useAccountApi } from '../../App';
import { useNavigate } from 'react-router-dom';
import ContentContainer from '../Layout/ContentContainer';
import { Snackbar, Alert, CircularProgress } from '@mui/material';
import style from './ServiceFormComponent.module.css';

function ServiceFormComponent() {
  const
    [serviceTypes, setServiceTypes] = useState([]),
    [selectedServiceTypeId, setSelectedServiceTypeId] = useState(''),
    [isLoading, setLoading] = useState(false),
    [snackbarOpen, setSnackbarOpen] = useState(false),
    [snackbarMessage, setSnackbarMessage] = useState(''),
    [snackbarSeverity, setSnackbarSeverity] = useState('success'),
    accountApi = useAccountApi(),
    navigate = useNavigate(),
    profileId = localStorage.getItem('profileId');

  useEffect(() => {
    const fetchServiceTypes = async () => {
      try {
        setLoading(true);
        const types = await accountApi.getServiceTypes();
        setServiceTypes(types);
      } finally {
        setLoading(false);
      }
    };

    fetchServiceTypes();
  }, [accountApi]);

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
      await accountApi.saveService(profileId, selectedServiceTypeId);
      setSnackbarSeverity('success');
      setSnackbarMessage('Услуга успешно добавлена');
      setSnackbarOpen(true);
      setTimeout(() => {
        navigate('/services');
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelEdit = () => {
    navigate('/services');
  };

  return (
    <ContentContainer>
      <h2>Добавление услуги</h2>
      <form onSubmit={handleSubmit} className={`${style.form_container}`}>
        <div className={style.form_left}>
          <div className={style.form_group}>
            <label htmlFor="serviceType">Тип услуги:</label>
            <select
              required
              name="serviceType"
              value={selectedServiceTypeId}
              onChange={(e) => setSelectedServiceTypeId(e.target.value)} 
              className={style.form_input}
              disabled={isLoading}
            >
              <option value="">Выберите тип услуги</option>
              {serviceTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className={style.form_buttons}>
          <button type="submit" className={style.form_button} disabled={isLoading}>
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Создать услугу'}
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

export default ServiceFormComponent;