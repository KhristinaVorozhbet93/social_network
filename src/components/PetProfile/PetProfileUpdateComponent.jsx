import React, { useEffect, useState } from 'react';
import style from './PetProfileUpdateComponent.module.css';
import { useNavigate, useParams } from 'react-router-dom';
import { useAccountApi } from '../../App';
import ContentContainer from '../Layout/ContentContainer';
import { Snackbar, Alert, CircularProgress } from '@mui/material';

function PetProfileUpdateComponent() {
    const
        { id } = useParams(),
        [profile, setProfile] = useState(null),
        [selectedFile, setSelectedFile] = useState(null),
        [isLoading, setLoading] = useState(false),
        [snackbarOpen, setSnackbarOpen] = useState(false),
        [snackbarMessage, setSnackbarMessage] = useState(''),
        [snackbarSeverity, setSnackbarSeverity] = useState('success'),
        [previewURL, setPreviewURL] = useState(null),
        navigate = useNavigate(),
        accountApi = useAccountApi(), 
        profileId = localStorage.getItem('profileId');

    useEffect(() => {
        const fetchProfile = async () => {
            const data = await accountApi.getPetProfileById(id);
            setProfile(data);
        };

        fetchProfile();
    }, [id, accountApi]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);

        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewURL(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewURL(null);
        }
    };

    const handleEditProfile = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const formData = new FormData();
            formData.append('id', profile.id);
            formData.append('profileId', profileId);
            formData.append('name', profile.name);
            formData.append('type', profile.type);
            formData.append('gender', profile.gender);
            formData.append('age', profile.age);
            formData.append('description', profile.description);

            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            await accountApi.updatePetProfile(formData);
            setSnackbarSeverity('success');
            setSnackbarMessage('Данные успешно отредактированы');
            setSnackbarOpen(true);
            setTimeout(() => {
                navigate('/profile/pet');
            }, 3000);
        }
        finally {
            setLoading(false);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleCancelEdit = () => {
        navigate("/profile/pet");
    };

    if (!profile) {
        return <div>Загрузка...</div>;
    }

    return (
        <ContentContainer>
            <h2>Редактирование профиля</h2>
            <form onSubmit={handleEditProfile} className={`${style.form_container}`}>
                <div className={style.form_left}>
                    <div className={style.form_group}>
                        <label htmlFor="name">Кличка:</label>
                        <input
                            type="text"
                            name="name"
                            value={profile.name}
                            onChange={handleInputChange}
                            className={style.form_input}
                            required
                        />
                    </div>

                    <div className={style.form_group}>
                        <label htmlFor="type">Вид:</label>
                        <input
                            type="text"
                            name="type"
                            value={profile.type}
                            onChange={handleInputChange}
                            className={style.form_input}
                            required
                        />
                    </div>

                    <div className={style.form_group}>
                        <label htmlFor="gender">Пол:</label>
                        <select
                            required
                            name="gender"
                            value={profile.gender}
                            onChange={handleInputChange}
                            className={style.form_input}>
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
                            value={profile.age}
                            onChange={handleInputChange}
                            className={style.form_input}
                            required
                        />
                    </div>

                    <div className={style.form_group}>
                        <label htmlFor="description">Описание:</label>
                        <textarea
                            name="description"
                            value={profile.description}
                            onChange={handleInputChange}
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
                        {previewURL ? (
                            <img
                                src={previewURL}
                                alt="Предпросмотр"
                                className={style.profile_preview}
                            />
                        ) : profile.photoUrl ? (
                            <img
                                src={profile.photoUrl}
                                alt="Pet Profile"
                                className={style.profile_preview}
                            />
                        ) : null}
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

export default PetProfileUpdateComponent;

