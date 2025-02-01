import React from 'react';
import style from './PetPfofileComponent.module.css';
import { useNavigate } from 'react-router-dom';
import { useAccountApi } from '../../App';


//сюда передается айдишник животного
function UpdatePetProfileComponent({
    editedProfile,
    handleEditProfileChange,
    handleEditFileChange,
    selectedFile
}) {

    const navigate = useNavigate(), 
    accountApi = useAccountApi();


    //useeffect для подгрузки данных по конкретному животному
    const handleEditProfile = async () => {
        const formData = new FormData();
        formData.append('id', editedProfile.id);
        formData.append('name', editedProfile.name);
        // formData.append('accountId', accountId);
        formData.append('type', editedProfile.type);
        formData.append('gender', editedProfile.gender);
        formData.append('age', editedProfile.age);
        formData.append('description', editedProfile.description);

        if (selectedFile) {
            formData.append('file', selectedFile);
        }
        const updatedProfile = await accountApi.updatePetProfile(formData);
    };

    const handleCancelEdit = () => {
        navigate("/profile/pet");
    };

    //вот эту часть тоже посмотреть
    return (
        <div className={style.formContent}>
            <input type="text" name="name" value={editedProfile.name} onChange={handleEditProfileChange} />
            <input type="text" name="type" value={editedProfile.type} onChange={handleEditProfileChange} />
            <select name="gender" value={editedProfile.gender} onChange={handleEditProfileChange}>
                <option value="Самец">Самец</option>
                <option value="Самка">Самка</option>
                <option value="Неизвестно">Неизвестно</option>
            </select>
            <input type="number" name="age" value={editedProfile.age} onChange={handleEditProfileChange} />
            <textarea name="description" value={editedProfile.description} onChange={handleEditProfileChange} />
            <input type="file" onChange={handleEditFileChange} />
            {selectedFile ? <img src={URL.createObjectURL(selectedFile)} alt="Pet Profile" style={{ maxWidth: '100px' }} /> : editedProfile.photo && typeof editedProfile.photo === 'string' ? (
                <img src={editedProfile.photo} alt="Pet Profile" style={{ maxWidth: '100px' }} />
            ) : null}

            <button onClick={handleEditProfile}>Сохранить</button>
            <button onClick={handleCancelEdit}>Отменить</button>
        </div>
    );
}

export default UpdatePetProfileComponent;