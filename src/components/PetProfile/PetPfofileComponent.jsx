import React, { useEffect, useState } from 'react';
import style from './PetPfofileComponent.module.css';
import PetProfileFormComponent from './PetProfileFormComponent';
import HeaderComponent from '../HeaderComponent';
import AsideComponent from '../AsideComponent';
import FooterComponent from '../FooterComponent';
import { useAccountApi } from '../../App';

function PetProfileComponent() {
    const
        [profiles, setProfiles] = useState([]),
        [activeProfileIndex, setActiveProfileIndex] = useState(0),
        [isFormVisible, setIsFormVisible] = useState(false),
        [loading, setLoading] = useState(false),
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
                    <div className={style.tabContent}>
                        {profiles[activeProfileIndex] ? (
                            <div className={style.formContent} >
                                <p>Имя животного: {profiles[activeProfileIndex].name}</p>
                                <p>Тип животного: {profiles[activeProfileIndex].type}</p>
                                <p>Возраст животного: {profiles[activeProfileIndex].years}</p>
                                <p>Пол животного: {profiles[activeProfileIndex].gender}</p>
                                <p>Описание животного: {profiles[activeProfileIndex].description}</p>
                                <button onClick={() => handleDeleteProfile(profiles[activeProfileIndex].id, activeProfileIndex)}>Удалить</button>
                            </div>
                        ) : (
                            !isFormVisible ? (
                                <div className={style.initialView}>
                                    <button className={style.addButton} onClick={handleAddProfileClick}>
                                        + Добавить профиль животного
                                    </button>
                                </div>
                            ) : (
                                <PetProfileFormComponent onSave={handleSaveProfile} />
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
