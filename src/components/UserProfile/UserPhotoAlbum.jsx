import React, { useState, useEffect } from 'react';
import style from './UserPhotoAlbum.module.css';
import { useNavigate } from 'react-router-dom';
import { useAccountApi } from '../../App';

function UserPhotoAlbum({ id }) {
    const
        [photos, setPhotos] = useState([]),
        [loading, setLoading] = useState(true),
        [isCurrentUserProfile, setIsCurrentUserProfile] = useState(false),
        accountApi = useAccountApi(),
        navigate = useNavigate(),
        MAX_PHOTOS_TO_DISPLAY = 6;

    useEffect(() => {
        const profileId = localStorage.getItem('profileId');
        const fetchPhotos = async () => {
            setLoading(true);
            try {
                const data = await accountApi.getUserPhotosInAlbum(id);
                setPhotos(data);
            } finally {
                setLoading(false);
            }
        };

        const checkIsCurrentUserProfile = () => {
            setIsCurrentUserProfile(profileId === id);
        };

        fetchPhotos();
        checkIsCurrentUserProfile();

    }, [id, accountApi]);

    const handleAddPhotoClick = () => {
        navigate(`/profile/user/add-photo`);
    };

    if (loading) {
        return <div>Загрузка альбома...</div>;
    }

    const displayedPhotos = photos.slice(0, MAX_PHOTOS_TO_DISPLAY);

    return (
        <div className={style.albumContainer}>
            {photos.length > 0 ? (
                <>
                    <div className={style.photoGrid}>
                        {displayedPhotos.map((photo) => (
                            <img
                                key={photo.id}
                                src={photo.filePath}
                                className={style.photo}
                                alt={`Photo ${photo.id}`}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <div className={style.noPhotosContainer}>
                    <div className={style.noPhotosText}>Нет фотографий</div>
                    {isCurrentUserProfile && (
                        <button onClick={handleAddPhotoClick} className={style.addButton}>Добавить фото</button>
                    )}
                </div>
            )}
        </div>
    );
}

export default UserPhotoAlbum;