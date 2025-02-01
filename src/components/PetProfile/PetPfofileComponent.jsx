import React, { useEffect, useState } from 'react';
import style from './PetPfofileComponent.module.css';
import PetProfileFormComponent from './PetProfileFormComponent';
import HeaderComponent from '../HeaderComponent';
import AsideComponent from '../AsideComponent';
import FooterComponent from '../FooterComponent';
import { useAccountApi } from '../../App';
import UpdatePetProfileComponent from './UpdatePetProfileComponent';
import { useNavigate } from 'react-router-dom';
import PetPhotoAlbum from './PetPhotoAlbum';
import PetPhotoUploadForm from './PetPhotoUploadForm';

function PetProfileComponent() {
    const
        [profiles, setProfiles] = useState([]),
        [activeProfileIndex, setActiveProfileIndex] = useState(0),
        [isFormVisible, setIsFormVisible] = useState(false),
        [isEditMode, setIsEditMode] = useState(false),
        [loading, setLoading] = useState(false),
        [editedProfile, setEditedProfile] = useState(null),
        [selectedFile, setSelectedFile] = useState(null),
        [albumPhotos, setAlbumPhotos] = useState([]),
        [accountId, setAccountId] = useState([]),
        [isPhotoFormVisible, setIsPhotoFormVisible] = useState(false),
        navigate = useNavigate(),
        accountApi = useAccountApi();

    useEffect(() => {
        const fetchProfiles = async () => {
            setLoading(true);
            try {
                const accountId = localStorage.getItem('accountId');
                setAccountId(accountId);
                const data = await accountApi.getPetProfiles(accountId);
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
        await accountApi.deletePetProfile(id, accountId);
        const newProfiles = [...profiles];
        newProfiles.splice(index, 1);
        setProfiles(newProfiles);
        if (activeProfileIndex >= newProfiles.length) {
            setActiveProfileIndex(newProfiles.length - 1);
        }
    };

    const handleAddProfileClick = () => {
        setIsFormVisible(true);
    };

    const handleTabClick = (index) => {
        setActiveProfileIndex(index);
    };

    const handleAddTab = () => {
        setIsFormVisible(true);
        setActiveProfileIndex(profiles.length);
    };







    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleEditFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    //вот это для добавление профиля животного
    const handleSaveProfile = async (newProfile) => {
        const formData = new FormData();
        formData.append('name', newProfile.name);
        formData.append('type', newProfile.type);
        formData.append('gender', newProfile.gender);
        formData.append('age', newProfile.age);
        formData.append('description', newProfile.description);
        formData.append('accountId', newProfile.accountId);

        if (newProfile.selectedFile) {
            formData.append('file', newProfile.selectedFile);
        }
        const data = await accountApi.saveProfile(formData)
        setProfiles([...profiles, data]);
        setIsFormVisible(false);
        setActiveProfileIndex(profiles.length);
    };

    const handleEditClick = (profile) => {
        navigate("/profile/pet/update");
    };







    //от этого места не реализовано
    const handleAddPhotoClick = () => {
        setIsPhotoFormVisible(true);
    }
    const closePhotoForm = () => {
        setIsPhotoFormVisible(false);
    }

    const onDeletePhoto = async (photoId) => {
        await accountApi.deletePetPhotoInAlbum(photoId);
        setAlbumPhotos(prev => prev.filter(photo => photo.id !== photoId))
    }

    const handleUploadNewPhoto = async () => {
        const formData = new FormData();
        formData.append('petId', profiles[activeProfileIndex].id);
        formData.append('accountId', accountId);
        if (selectedFile) {
            formData.append('file', selectedFile);
        }

        await accountApi.addPetPhoto(formData);
        const photos = await accountApi.getPetPhotoInAlbum(accountId, profiles[activeProfileIndex].id)
        setAlbumPhotos(photos);
        setIsPhotoFormVisible(false)
    }


    const onSetMainPhoto = async (photoId) => {
        //await accountApi.setMainPhoto(photoId, activeProfileId)
        // обновим стейт, чтобы отображалась нужная картинка как главная
    }

    if (loading) {
        return <div>Loading...</div>;
    }




    
    return (
        <div className={style.container}>
            <HeaderComponent />
            <div className={style.content}>
                <AsideComponent />
                <div className={style.main_content}>
                    {profiles.length > 0 ? (
                        <div className={style.tabs}>
                            {profiles.map((profile, index) => (
                                <div
                                    key={index}
                                    className={`${style.tab} ${index === activeProfileIndex ? style.activeTab : ''}`}
                                    onClick={() => handleTabClick(index)}
                                >
                                    {profile.name}
                                </div>
                            ))}
                            <div className={style.tab} onClick={handleAddTab}>+</div>
                        </div>
                    ) : null}
                    <div className={style.tabContent}>
                        <div className={style.formContent} >
                            <p>Имя животного: {profiles[activeProfileIndex].name}</p>
                            <p>Тип животного: {profiles[activeProfileIndex].type}</p>
                            <p>Возраст животного: {profiles[activeProfileIndex].age}</p>
                            <p>Пол животного: {profiles[activeProfileIndex].gender}</p>
                            <p>Описание животного: {profiles[activeProfileIndex].description}</p>
                            <img src={profiles[activeProfileIndex].photoUrl} alt="Pet Profile" className={style.photo} />
                            <button onClick={() => handleEditClick(profiles[activeProfileIndex])}>Редактировать</button>
                            <button onClick={() => handleDeleteProfile(profiles[activeProfileIndex].id, activeProfileIndex)}>Удалить</button>







                            {isPhotoFormVisible && <PetPhotoUploadForm
                                onUpload={handleUploadNewPhoto}
                                onCancel={closePhotoForm}
                            />}
                            <PetPhotoAlbum
                                photos={albumPhotos}
                                onDeletePhoto={onDeletePhoto}
                                onSetMainPhoto={onSetMainPhoto}
                            />
                            <button onClick={handleAddPhotoClick}>Добавить фото в альбом</button>
                        </div>

                        (
                        !isFormVisible ? (
                        <div className={style.initialView}>
                            <button className={style.addButton} onClick={handleAddProfileClick}>
                                + Добавить профиль животного
                            </button>
                        </div>
                        ) : (
                        <PetProfileFormComponent onSave={handleSaveProfile} handleFileChange={handleFileChange} setIsFormVisible={setIsFormVisible} />
                        )
                        )

                    </div>
                </div>
            </div>
            <FooterComponent />
        </div>
    );
}

export default PetProfileComponent;
