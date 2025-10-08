import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import style from './UserProfilePhotoGallery.module.css';
import { useAccountApi } from '../../App';
import CommentComponent from '../CommentComponent';
import ContentContainer from '../ContentContainer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Snackbar, Alert, CircularProgress } from '@mui/material';

function UserProfilePhotoGallery() {
    const
        [photos, setPhotos] = useState([]),
        [currentPhotoIndex, setCurrentPhotoIndex] = useState(0),
        [loading, setLoading] = useState(true),
        [mainLoading, setMainLoading] = useState(false),
        [deleteLoading, setDeleteLoading] = useState(false),
        [snackbarOpen, setSnackbarOpen] = useState(false),
        [snackbarMessage, setSnackbarMessage] = useState(''),
        [snackbarSeverity, setSnackbarSeverity] = useState('success'),
        [isMenuOpen, setIsMenuOpen] = useState(false),
        { id } = useParams(),
        accountApi = useAccountApi(),
        navigate = useNavigate(),
        carouselRef = useRef(null),
        menuRef = useRef(null),
        isMyAlbum = id === localStorage.getItem('profileId');

    useEffect(() => {
        const fetchPhotos = async () => {
            setLoading(true);
            try {
                const fetchedPhotos = await accountApi.getUserPhotosInAlbum(id, 10, 0);
                setPhotos(fetchedPhotos);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchPhotos();
        }
    }, [id, accountApi]);

    useEffect(() => {
        if (photos.length > 0 && currentPhotoIndex >= photos.length) {
            setCurrentPhotoIndex(photos.length - 1);
        }
    }, [photos, currentPhotoIndex]);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handlePhotoClick = (index) => {
        setCurrentPhotoIndex(index);
    };

    const handleSetMainPhoto = async () => {
        setMainLoading(true);
        try {
            await accountApi.setUserPhotoAsMain(id, currentPhoto.id);
            setSnackbarSeverity('success');
            setSnackbarMessage('Фотогарфия установлена как главная');
            setSnackbarOpen(true);
            const updatedPhotos = await accountApi.getUserPhotosInAlbum(id, 10, 0);
            setPhotos(updatedPhotos);
        }
        finally {
            setMainLoading(false);
        }
    };

    const handleDeletePhoto = async () => {
        setDeleteLoading(true);
        try {
            await accountApi.deleteUserPhotoInAlbum(currentPhoto.id);
            setSnackbarSeverity('success');
            setSnackbarMessage('Фотогарфия удалена');
            setSnackbarOpen(true);
            const updatedPhotos = await accountApi.getUserPhotosInAlbum(id, 10, 0);
            setPhotos(updatedPhotos);
            setCurrentPhotoIndex(0);
        } finally {
            setDeleteLoading(false);
        }
    };

    const handleAddPhotoClick = () => {
        navigate(`/profile/user/add-photo`);
    };

    const handleCarouselDrag = (e) => {
        if (!carouselRef.current) return;

        let startX = e.clientX;
        let scrollLeft = carouselRef.current.scrollLeft;

        const handleMove = (e) => {
            if (!carouselRef.current) return;

            const x = e.clientX;
            const walk = (x - startX) * 2;
            carouselRef.current.scrollLeft = scrollLeft - walk;
        };

        const handleUp = () => {
            document.removeEventListener('mousemove', handleMove);
            document.removeEventListener('mouseup', handleUp);
        };

        document.addEventListener('mousemove', handleMove);
        document.addEventListener('mouseup', handleUp);
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    if (loading) {
        return <div>Загрузка галереи...</div>;
    }

    if (photos.length === 0) {
        return (
            <ContentContainer>
                <div className={style.noPhotosContainer}>
                    <div>Нет фотографий</div>
                    {isMyAlbum && (
                        <button onClick={() => navigate(`/profile/user/add-photo`)}>Добавить фото</button>
                    )}
                </div>
            </ContentContainer>
        );
    }

    const currentPhoto = photos[currentPhotoIndex];

    return (
        <ContentContainer>
            <div className={style.photoPageContainer}>
                <div className={style.photoViewer}>
                    <div className={style.mainPhotoContainer}>
                        <img src={currentPhoto.filePath} alt={`Фото ${id}`} className={style.currentPhoto} />
                        {isMyAlbum && (
                            <div className={style.menuContainer} ref={menuRef}>
                                <button onClick={toggleMenu} className={style.menuButton}>
                                    <FontAwesomeIcon icon={faEllipsisV} />
                                </button>
                                {isMenuOpen && (
                                    <div className={style.menu}>
                                        <button onClick={handleSetMainPhoto} disabled={mainLoading}>
                                            {mainLoading ? <CircularProgress size={24} color="inherit" /> : 'Установить как главное'}
                                        </button>
                                        <button onClick={handleDeletePhoto} disabled={deleteLoading}>
                                            {deleteLoading ? <CircularProgress size={24} color="inherit" /> : 'Удалить'}
                                        </button>
                                        <button onClick={handleAddPhotoClick}>Добавить фото</button>
                                    </div>
                                )}
                            </div>
                        )}

                    </div>

                    <div
                        className={style.photoCarousel}
                        ref={carouselRef}
                        onMouseDown={handleCarouselDrag}
                    >
                        {photos.map((photo, index) => (
                            <img
                                key={photo.id}
                                src={photo.filePath}
                                alt={`Превью фото ${index + 1}`}
                                className={`${style.carouselImage} ${index === currentPhotoIndex ? style.activeCarouselImage : ''}`}
                                onClick={() => handlePhotoClick(index)}
                            />
                        ))}
                    </div>

                    <CommentComponent photoId={currentPhoto.id} profileId={id} />
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
        </ContentContainer >
    );
}

export default UserProfilePhotoGallery;