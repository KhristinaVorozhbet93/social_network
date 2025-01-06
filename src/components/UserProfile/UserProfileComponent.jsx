import React, { useState, useEffect } from 'react';
import style from './UserProfileComponent.module.css';
import HeaderComponent from "../HeaderComponent";
import AsideComponent from "../AsideComponent";
import FooterComponent from "../FooterComponent";
import { useAccountApi } from '../../App';
import UpdateUserProfileComponent from './UpdateUserProfileComponent';

function UserProfileComponent() {
    const
        [profile, setProfile] = useState(null),
        [loading, setLoading] = useState(true),
        [isEditMode, setIsEditMode] = useState(false),
        [editedProfile, setEditedProfile] = useState(null),
        [selectedFile, setSelectedFile] = useState(null),
        accountApi = useAccountApi();

    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const accountId = localStorage.getItem('accountId');
                const data = await accountApi.getUserProfile(accountId);
                setProfile(data);
            }
            catch (error) {
                console.error("Failed to fetch user profile", error)
            }
            finally {
                setLoading(false);
            }
        };
        fetchProfile();
    }, []);

    const handleEditClick = () => {
        setIsEditMode(true);
        setEditedProfile({ ...profile });
        setSelectedFile(null);
    };

    const handleEditProfileChange = (e) => {
        setEditedProfile({ ...editedProfile, [e.target.name]: e.target.value });
    };

    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleEditProfile = async () => {
        try {
            if (selectedFile) {
                editedProfile.photo = selectedFile;
            }
            const updatedProfile = await accountApi.updateUserProfile(editedProfile);
            setProfile(updatedProfile);
            setIsEditMode(false);
            setEditedProfile(null);
            setSelectedFile(null);
        } catch (error) {
            console.error("Failed to update user profile:", error);
        }
    };
    
    const handleCancelEdit = () => {
        setIsEditMode(false);
        setEditedProfile(null);
        setSelectedFile(null);
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
                    {isEditMode ? (
                        <UpdateUserProfileComponent
                            editedProfile={editedProfile}
                            handleEditProfileChange={handleEditProfileChange}
                            handleFileChange={handleFileChange}
                            handleEditProfile={handleEditProfile}
                            handleCancelEdit={handleCancelEdit}
                            selectedFile={selectedFile}
                        />
                    ) : (
                        <div className={style.formContent} >
                            {profile.photo && <img src={profile.photo} alt="User Profile" style={{ maxWidth: '100px' }} />}
                            <p>Имя: {profile.firstName}</p>
                            <p>Фамилия: {profile.lastName}</p>
                            <p>Дата рождения: {profile.dateOfBirth?.split('T')[0]}</p>
                            <p>Гуляет с собаками: {profile.walksDogs ? 'Да' : 'Нет'}</p>
                            <p>Профессия: {profile.profession}</p>
                            <button onClick={handleEditClick}>Редактировать</button>
                        </div>
                    )}
                </div>
            </div>
            <FooterComponent />
        </div>
    );
}

export default UserProfileComponent;