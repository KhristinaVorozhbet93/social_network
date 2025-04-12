import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import style from './PetPfofileComponent.module.css';
import { useAccountApi } from '../../App';
import PetPhotoAlbum from './PetPhotoAlbum';
import ContentContainer from '../ContentContainer';

function PetProfileViewComponent() {
    const
        [profile, setProfile] = useState([]),
        [loading, setLoading] = useState(true),
        { id } = useParams(),
        navigate = useNavigate(),
        accountApi = useAccountApi();

    useEffect(() => {
        const fetchPets = async () => {
            setLoading(true);
            try {
                const data = await accountApi.getPetProfileById(id);
                setProfile(data);
            } finally {
                setLoading(false);
            }
        };
        fetchPets();
    }, [id, accountApi]);

    const navigateToGallery = () => {
        navigate(`/profile/pet/${id}/photos`, { state: { userProfileId: profile.profileId } });
    };

    if (loading) {
        return <div>Загрузка...</div>;
    }

    return (
        <ContentContainer>
            <div className={style.formContent}>
                <section>
                    <h2>Профиль</h2>
                    <div className={style.profileContainer}>
                        <div className={style.profilePhotoAndInfo}>
                            <>
                                {profile.photoUrl && (
                                    <img
                                        src={profile.photoUrl}
                                        alt={`Фото ${profile.name}`}
                                        className={style.profilePhoto}
                                    />
                                )}
                                <div>
                                    <>
                                        {profile.name && (
                                            <p>Имя животного: {profile.name}</p>
                                        )}
                                        {profile.type && (
                                            <p>Тип животного: {profile.type}</p>
                                        )}
                                        {profile.age && (
                                            <p>Возраст животного: {profile.age}</p>
                                        )}
                                        {profile.gender && (
                                            <p>Пол животного: {profile.gender}</p>
                                        )}
                                        {profile.description && (
                                            <p>Описание животного: {profile.description}</p>
                                        )}
                                    </>

                                </div>
                            </>

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
                    <PetPhotoAlbum id={id} userProfileId={profile.profileId} />
                </section>
            </div>
        </ContentContainer>
    );
}

export default PetProfileViewComponent;