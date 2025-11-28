import { useState, useEffect } from 'react';
import { useAccountApi } from '../../App';
import { useNavigate } from 'react-router-dom';
import { Snackbar, Alert, CircularProgress } from '@mui/material';
import style from './DogWalkingUpdateComponent.module.css';

function DogWalkingUpdateComponent({ serviceId }) {
    const
        [formData, setFormData] = useState({
            price: '',
            description: '',
            maxDogs: '',
            walkDurationMinutes: ''}),
        [service, setService] = useState(null),
        [dogWalking, setDogWalking] = useState(null),
        [loading, setLoading] = useState(false),
        [initialLoading, setInitialLoading] = useState(true),
        [snackbarOpen, setSnackbarOpen] = useState(false),
        [snackbarMessage, setSnackbarMessage] = useState(''),
        [snackbarSeverity, setSnackbarSeverity] = useState('success'),
        accountApi = useAccountApi(),
        navigate = useNavigate();

    useEffect(() => {
        const fetchServiceData = async () => {
            if (!serviceId) {
                setInitialLoading(false);
                return;
            }

            try {
                setInitialLoading(true);
                const serviceData = await accountApi.getServiceById(serviceId);
                setService(serviceData);
                const dogWalkingDetails = await accountApi.getDogWalkingService(serviceId);
                setDogWalking(dogWalkingDetails);
                setFormData({
                    price: serviceData.price || '',
                    description: serviceData.description || '',
                    maxDogs: dogWalkingDetails?.maxDogs || '',
                    walkDurationMinutes: dogWalkingDetails?.walkDurationMinutes || ''
                });
            } finally {
                setInitialLoading(false);
            }
        };

        fetchServiceData();
    }, [serviceId, accountApi]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            await accountApi.updateServiceGeneralInfo(serviceId, formData.price, formData.description);
            await accountApi.updateDogWalkingInfo(dogWalking.id, parseInt(formData.maxDogs), parseInt(formData.walkDurationMinutes));
            setSnackbarSeverity('success');
            setSnackbarMessage('Данные успешно обновлены!');
            setSnackbarOpen(true);

            setTimeout(() => {
                navigate('/services');
            }, 2000);

        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate('/services');
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') return;
        setSnackbarOpen(false);
    };

    if (initialLoading) {
        return (
            <div className={style.updateContainer}>
                <div className={style.loading}>Загрузка данных...</div>
            </div>
        );
    }

    if (!service) {
        return (
            <div className={style.updateContainer}>
                <div className={style.errorMessage}>Услуга не найдена</div>
            </div>
        );
    }

    return (
        <div className={style.updateContainer}>
            <form onSubmit={handleSubmit} className={style.form}>
                <div className={style.section}>
                    <div className={style.formGroup}>
                        <label htmlFor="price">Цена (₽):</label>
                        <input
                            type="number"
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            className={style.input}
                            placeholder="Введите цену"
                            disabled={loading}
                        />
                    </div>

                    <div className={style.formGroup}>
                        <label htmlFor="description">Описание услуги:</label>
                        <textarea
                            id="description"
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className={style.textarea}
                            rows="4"
                            disabled={loading}
                        />
                    </div>

                    <div className={style.formGroup}>
                        <label htmlFor="maxDogs">Максимум собак за раз:</label>
                        <input
                            type="number"
                            id="maxDogs"
                            name="maxDogs"
                            value={formData.maxDogs}
                            onChange={handleChange}
                            className={style.input}
                            required
                            disabled={loading}
                        />
                    </div>

                    <div className={style.formGroup}>
                        <label htmlFor="walkDurationMinutes">Длительность прогулки (минуты):</label>
                        <select
                            id="walkDurationMinutes"
                            name="walkDurationMinutes"
                            value={formData.walkDurationMinutes}
                            onChange={handleChange}
                            className={style.select}
                            required
                            disabled={loading}
                        >
                            <option value="">Выберите длительность</option>
                            <option value="30">30 минут</option>
                            <option value="45">45 минут</option>
                            <option value="60">1 час</option>
                            <option value="90">1.5 часа</option>
                            <option value="120">2 часа</option>
                        </select>
                    </div>
                </div>

                <div className={style.buttons}>
                    <button
                        type="submit"
                        className={style.submitButton}
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={20} color="inherit" /> : 'Сохранить изменения'}
                    </button>

                    <button
                        type="button"
                        onClick={handleCancel}
                        className={style.cancelButton}
                        disabled={loading}
                    >
                        Отмена
                    </button>
                </div>
            </form>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default DogWalkingUpdateComponent;