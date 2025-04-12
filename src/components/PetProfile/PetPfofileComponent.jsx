import React, { useEffect, useState } from 'react';
import style from './PetPfofileComponent.module.css';
import { useAccountApi } from '../../App';
import { useNavigate } from 'react-router-dom';
import PetPhotoAlbum from './PetPhotoAlbum';
import ContentContainer from '../ContentContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Snackbar, Alert, CircularProgress } from '@mui/material';

function PetProfileComponent() {
    const
        [profiles, setProfiles] = useState([]),
        [activeProfileIndex, setActiveProfileIndex] = useState(0),
        [loading, setLoading] = useState(false),
        [snackbarOpen, setSnackbarOpen] = useState(false),
        [snackbarMessage, setSnackbarMessage] = useState(''),
        [snackbarSeverity, setSnackbarSeverity] = useState('success'),
        [isMenuOpen, setIsMenuOpen] = useState(false),
        [accountId, setAccountId] = useState([]),
        navigate = useNavigate(),
        accountApi = useAccountApi(),
        profileId = localStorage.getItem('profileId');

    useEffect(() => {
        const fetchProfiles = async () => {
            setLoading(true);
            try {

                setAccountId(accountId);
                const data = await accountApi.getPetProfiles(profileId);
                if (data && data.length > 0) {
                    setProfiles(data);
                }
            } finally {
                setLoading(false);
            }
        };
        fetchProfiles();
    }, []);

    const handleDeleteProfile = async (id, index) => {
        setLoading(true);
        try {
            await accountApi.deletePetProfile(id, accountId);
            setSnackbarSeverity('success');
            setSnackbarMessage('Профиль успешно удален');
            setSnackbarOpen(true);
            setTimeout(() => {
                navigate('/profile/pet');
            }, 3000);

            const newProfiles = [...profiles];
            newProfiles.splice(index, 1);
            setProfiles(newProfiles);
            if (activeProfileIndex >= newProfiles.length) {
                setActiveProfileIndex(newProfiles.length - 1);
            }
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

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleTabClick = (index) => {
        setActiveProfileIndex(index);
    };

    const handleAddTab = () => {
        navigate('/profile/pet/create');
    };

    const handleEditClick = (profile) => {
        navigate(`/profile/pet/${profile.id}/update`);
    };

    const navigateToGallery = () => {
        navigate(`/profile/pet/${currentProfile.id}/photos`, { state: { userProfileId: profileId } });
    };

    if (!profiles || profiles.length === 0) {
        return (
            <ContentContainer>
                <div className={style.addProfile}>
                    <div>Нет питомцев</div>
                    <button onClick={handleAddTab} >Добавить</button>
                </div>
            </ContentContainer>
        );
    }

    const currentProfile = profiles[activeProfileIndex];
    return (
        <ContentContainer>
            <div className={style.tabs}>
                {profiles.map((profile, index) => (
                    <div
                        key={profile.id}
                        className={`${style.tab} ${index === activeProfileIndex ? style.activeTab : ''}`}
                        onClick={() => {
                            handleTabClick(index);
                            setActiveProfileIndex(index);
                        }}
                    >
                        {profile.name}
                    </div>
                ))}
                <div className={style.tab} onClick={handleAddTab}>+</div>
            </div>

            <div className={style.tabContent}>
                <div className={style.formContent}>
                    <section>
                        <h2 className={style.galleryHeading}>Профиль</h2>
                        <div className={style.profileContainer}>
                            <div className={style.profilePhotoAndInfo}>
                                {currentProfile && (
                                    <>
                                        {profiles[activeProfileIndex].photoUrl && (
                                            <img
                                                src={profiles[activeProfileIndex].photoUrl}
                                                alt={`Фото ${profiles[activeProfileIndex].name}`}
                                                className={style.profilePhoto}
                                            />
                                        )}
                                        <div>
                                            {profiles.length > 0 && (
                                                <>
                                                    {profiles[activeProfileIndex].name && (
                                                        <p>Имя животного: {profiles[activeProfileIndex].name}</p>
                                                    )}
                                                    {profiles[activeProfileIndex].type && (
                                                        <p>Тип животного: {profiles[activeProfileIndex].type}</p>
                                                    )}
                                                    {profiles[activeProfileIndex].age && (
                                                        <p>Возраст животного: {profiles[activeProfileIndex].age}</p>
                                                    )}
                                                    {profiles[activeProfileIndex].gender && (
                                                        <p>Пол животного: {profiles[activeProfileIndex].gender}</p>
                                                    )}
                                                    {profiles[activeProfileIndex].description && (
                                                        <p>Описание животного: {profiles[activeProfileIndex].description}</p>
                                                    )}
                                                </>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>

                            <div className={style.menuContainer}>
                                <FontAwesomeIcon
                                    icon={faEllipsisV}
                                    onClick={handleMenuClick}
                                    className={style.menuIcon}
                                />
                                {isMenuOpen && (
                                    <div className={style.menuDropdown}>
                                        <button onClick={() => handleEditClick(currentProfile)}>Редактировать</button>
                                        <button onClick={() => handleDeleteProfile(currentProfile.id, activeProfileIndex)} disabled={loading}>
                                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Удалить'}
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>

                    <section className={style.gallerySection}>
                        <div className={style.headerContainer}>
                            <h2 className={style.galleryHeading} onClick={() => navigateToGallery()}>Галерея</h2>
                            <div className={style.buttonContainer}>
                                <button onClick={() => navigateToGallery()} className={style.viewAllButton}>
                                    Просмотр галереи
                                </button>
                            </div>
                        </div>
                        {currentProfile && <PetPhotoAlbum id={currentProfile.id} userProfileId={profileId} />}
                    </section>
                </div>
            </div>
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

export default PetProfileComponent;
