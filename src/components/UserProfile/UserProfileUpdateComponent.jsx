import { useState, useEffect } from "react";
import { useAccountApi } from "../../App";
import { useNavigate } from "react-router-dom";
import ContentContainer from '../ContentContainer';
import style from './UserProfileUpdateComponent.module.css';
import { Snackbar, Alert, CircularProgress } from '@mui/material';

function UserProfileUpdateComponent() {
    const
        [firstName, setFirstName] = useState(''),
        [lastName, setLastName] = useState(''),
        [dateOfBirth, setDateOfBirth] = useState(''),
        [walksDogs, setWalksDogs] = useState(false),
        [profession, setProfession] = useState(''),
        [aboutSelf, setAboutSelf] = useState(''),
        [interests, setInterests] = useState(''),
        [isLoading, setLoading] = useState(false),
        [snackbarOpen, setSnackbarOpen] = useState(false),
        [snackbarMessage, setSnackbarMessage] = useState(''),
        [snackbarSeverity, setSnackbarSeverity] = useState('success'),
        [profile, setProfile] = useState(false),
        [selectedFile, setSelectedFile] = useState(null),
        [previewURL, setPreviewURL] = useState(null),
        accountApi = useAccountApi(),
        navigate = useNavigate(), 
        accountId = localStorage.getItem('accountId');

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const accountId = localStorage.getItem('accountId');
                const data = await accountApi.getUserProfile(accountId);
                setFirstName(data.firstName);
                setLastName(data.lastName);
                setDateOfBirth(data.dateOfBirth?.split('T')[0] || '');
                setWalksDogs(data.walksDogs);
                setProfession(data.profession);
                setAboutSelf(data.aboutSelf);
                setInterests(data.interests);
                setProfile(data);
            }
            finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

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
            const formData = new FormData();
            formData.append('id', profile.id);
            formData.append('accountId', accountId);
            formData.append('firstName', firstName);
            formData.append('lastName', lastName);
            formData.append('walksDogs', walksDogs);
            if (profession && profession.trim() !== "") {
                formData.append('profession', profession);
            }
            if (aboutSelf && aboutSelf.trim() !== "") {
                formData.append('aboutSelf', aboutSelf);
            }
            if (interests && interests.trim() !== "") {
                formData.append('interests', interests);
            }

            if (dateOfBirth && dateOfBirth.trim() !== '') {
                formData.append('dateOfBirth', new Date(dateOfBirth).toISOString());
            }

            if (selectedFile) {
                formData.append('file', selectedFile);
            }

            await accountApi.updateUserProfile(formData);
            setSnackbarSeverity('success');
            setSnackbarMessage('Данные успешно отредактированы');
            setSnackbarOpen(true);
            setTimeout(() => {
                navigate('/profile/user');
            }, 3000);
        } finally {
            setLoading(false);
        }
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

    const handleCancelEdit = () => {
        navigate("/profile/user");
    };

    const handlelEditPassword = () => {
        navigate("/auth/password/update");
    };

    return (
        <ContentContainer>
            <h2>Редактирование профиля</h2>
            <form onSubmit={handleSubmit} className={`${style.form_container}`}>
                <div className={style.form_left}>
                    <div className={style.form_group}>
                        <label htmlFor="firstName">Имя:</label>
                        <input
                            type="text"
                            id="firstName"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                            required
                            className={style.form_input}
                        />
                    </div>
                    <div className={style.form_group}>
                        <label htmlFor="lastName">Фамилия:</label>
                        <input
                            type="text"
                            id="lastName"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                            required
                            className={style.form_input}
                        />
                    </div>
                    <div className={style.form_group}>
                        <label htmlFor="dateOfBirth">День рождения:</label>
                        <input
                            type="date"
                            id="dateOfBirth"
                            value={dateOfBirth}
                            onChange={(e) => setDateOfBirth(e.target.value)}
                            className={style.form_input}
                        />
                    </div>
                    <div className={style.form_group}>
                        <label htmlFor="walksDogs">Выгул собак:</label>
                        <input
                            type="checkbox"
                            id="walksDogs"
                            checked={walksDogs}
                            onChange={(e) => setWalksDogs(e.target.checked)}
                            className={style.form_checkbox}
                        />
                    </div>
                    <div className={style.form_group}>
                        <label htmlFor="profession">Профессия:</label>
                        <input
                            type="text"
                            id="profession"
                            value={profession}
                            onChange={(e) => setProfession(e.target.value)}
                            className={style.form_input}
                        />
                        <div className={style.form_group}>
                            <label htmlFor="aboutSelf">О себе:</label>
                            <textarea
                                name="aboutSelf"
                                value={aboutSelf}
                                onChange={(e) => setAboutSelf(e.target.value)}
                                className={style.form_input} />
                        </div>
                    </div>

                </div>

                <div className={style.form_right}>
                    <div className={style.form_group}>
                        <label htmlFor="interests">Интересы:</label>
                        <textarea
                            name="interests"
                            value={interests}
                            onChange={(e) => setInterests(e.target.value)}
                            className={style.form_input} />
                    </div>
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
                    <button type="button" onClick={handlelEditPassword} className={style.form_button} disabled={isLoading}>
                        Изменить пароль
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

export default UserProfileUpdateComponent;