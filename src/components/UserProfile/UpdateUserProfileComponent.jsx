import React from 'react';
import style from './UserProfileComponent.module.css';

function UpdateUserProfileComponent({
    editedProfile,
    handleEditProfileChange,
    handleFileChange,
    handleEditProfile,
    handleCancelEdit,
    selectedFile
}) {
    return (
        <div className={style.formContent}>
            <input type="text" name="firstName" value={editedProfile.firstName || ''} onChange={handleEditProfileChange} placeholder="Имя" />
            <input type="text" name="lastName" value={editedProfile.lastName || ''} onChange={handleEditProfileChange} placeholder="Фамилия" />
            <input type="date" name="dateOfBirth" value={editedProfile.dateOfBirth?.split('T')[0] || ''} onChange={handleEditProfileChange} placeholder="Дата рождения" />
            <input type="checkbox" name="walksDogs" checked={editedProfile.walksDogs} onChange={(e) => handleEditProfileChange({ ...editedProfile, walksDogs: e.target.checked })} /> Гуляет с собаками?
            <input type="text" name="profession" value={editedProfile.profession || ''} onChange={handleEditProfileChange} placeholder="Профессия" />
            <input type="file" onChange={handleFileChange} />
            {editedProfile.photo && typeof editedProfile.photo === 'string' ? (
                <img src={editedProfile.photo} alt="User Profile" style={{ maxWidth: '100px' }} />
            ) : null}
            <button onClick={handleEditProfile}>Сохранить</button>
            <button onClick={handleCancelEdit}>Отменить</button>
        </div>
    );
}

export default UpdateUserProfileComponent;