import React, { useState, useEffect } from 'react';
import style from './PetPhotoAlbum.module.css';
import { useNavigate } from 'react-router-dom';
import { useAccountApi } from '../../App';

function PetPhotoAlbum({ userProfileId, id }) {
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
                const data = await accountApi.getPetPhotoInAlbum(userProfileId, id);
                setPhotos(data);
                const pet = await accountApi.getPetProfileById(id);

                const checkIsCurrentUserProfile = () => {
                    setIsCurrentUserProfile(profileId === pet.profileId);
                };

                checkIsCurrentUserProfile();
            } finally {
                setLoading(false);
            }
        };

        fetchPhotos();
    }, [id, accountApi]);

    const handleAddPhotoClick = () => {
        navigate(`/profile/pet/${id}/add-photo`);
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
                                alt={`Фото ${id}`}
                                className={style.photo}
                            />
                        ))}
                    </div>
                </>
            ) : (
                <div className={style.noPhotosContainer}>
                     <div className={style.noPhotosText}>У этого питомца нет фотографий</div>
                    {isCurrentUserProfile && (
                        <button onClick={handleAddPhotoClick} className={style.addButton}>Добавить фото</button>
                    )} 
                </div>
            )}
        </div>
    );
}

export default PetPhotoAlbum;