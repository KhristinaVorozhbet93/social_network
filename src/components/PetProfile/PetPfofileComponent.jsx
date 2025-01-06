import React, { useEffect, useState } from 'react';
import style from './PetPfofileComponent.module.css';
import PetProfileFormComponent from './PetProfileFormComponent';
import HeaderComponent from '../HeaderComponent';
import AsideComponent from '../AsideComponent';
import FooterComponent from '../FooterComponent';
import { useAccountApi } from '../../App';
import UpdatePetProfileComponent from './UpdatePetProfileComponent';
import { Navigate, useNavigate } from 'react-router-dom';

function PetProfileComponent() {
    const
        [profiles, setProfiles] = useState([]),
        [activeProfileIndex, setActiveProfileIndex] = useState(0),
        [isFormVisible, setIsFormVisible] = useState(false),
        [isEditMode, setIsEditMode] = useState(false),
        [loading, setLoading] = useState(false),
        [editedProfile, setEditedProfile] = useState(null),
        [selectedFile, setSelectedFile] = useState(null),
        navigate = useNavigate(),
        accountApi = useAccountApi();

    useEffect(() => {
        const fetchProfiles = async () => {
            setLoading(true);
            try {
                const accountId = localStorage.getItem('accountId');
                const data = await accountApi.getPetProfiles(accountId);
                setProfiles(data);
            } finally {
                setLoading(false);
            }
        };
        fetchProfiles();
    }, []);

    const handleAddProfileClick = () => {
        setIsFormVisible(true);
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleEditFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleSaveProfile = async (newProfile) => {
        const data = await accountApi.saveProfile(newProfile);
        setProfiles([...profiles, data]);
        setIsFormVisible(false);
        setActiveProfileIndex(profiles.length);
    };

    const handleTabClick = (index) => {
        setActiveProfileIndex(index);
    };

    const handleAddTab = () => {
        setIsFormVisible(true);
        setActiveProfileIndex(profiles.length);
    };

    const handleEditClick = (profile) => {
        setIsEditMode(true);
        setEditedProfile({ ...profile });
    };

    const handleEditProfileChange = (e) => {
        setEditedProfile({ ...editedProfile, [e.target.name]: e.target.value });
    };

    const handleEditProfile = async () => {
        const updatedProfile = await accountApi.updatePetProfile(editedProfile)
        const newProfiles = profiles.map((profile) => profile.id === updatedProfile.id ? updatedProfile : profile)
        setProfiles(newProfiles)
        setIsEditMode(false);
        setEditedProfile(null);
    };

    const handleCancelEdit = () => {
        navigate("/profile/pet");
    };

    const handleDeleteProfile = async (id, index) => {
        await accountApi.deletePetProfile(id);
        const newProfiles = [...profiles];
        newProfiles.splice(index, 1);
        setProfiles(newProfiles);
        if (activeProfileIndex >= newProfiles.length) {
            setActiveProfileIndex(newProfiles.length - 1);
        }
    };

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
                        {profiles[activeProfileIndex] ? (
                            isEditMode ? (
                                <UpdatePetProfileComponent
                                    editedProfile={editedProfile}
                                    handleEditProfileChange={handleEditProfileChange}
                                    handleEditFileChange={handleEditFileChange}
                                    handleEditProfile={handleEditProfile}
                                    handleCancelEdit={handleCancelEdit}
                                    selectedFile={selectedFile}
                                />
                            ) : (
                                <div className={style.formContent} >
                                    <p>Имя животного: {profiles[activeProfileIndex].name}</p>
                                    <p>Тип животного: {profiles[activeProfileIndex].type}</p>
                                    <p>Возраст животного: {profiles[activeProfileIndex].years}</p>
                                    <p>Пол животного: {profiles[activeProfileIndex].gender}</p>
                                    <p>Описание животного: {profiles[activeProfileIndex].description}</p>
                                    {profiles[activeProfileIndex].photo && <img src={profiles[activeProfileIndex].photo} alt="Pet Profile" style={{ maxWidth: '100px' }} />}
                                    <button onClick={() => handleEditClick(profiles[activeProfileIndex])}>Редактировать</button>
                                    <button onClick={() => handleDeleteProfile(profiles[activeProfileIndex].id, activeProfileIndex)}>Удалить</button>
                                </div>
                            )
                        ) : (
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
                        }
                    </div>
                </div>
            </div>
            <FooterComponent />
        </div>
    );
}

export default PetProfileComponent;
