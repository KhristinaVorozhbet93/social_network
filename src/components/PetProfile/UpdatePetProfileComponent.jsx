import React from 'react';
import style from './PetPfofileComponent.module.css';

function UpdatePetProfileComponent({
    editedProfile,
    handleEditProfileChange,
    handleEditFileChange,
    handleEditProfile,
    handleCancelEdit,
    selectedFile
}) {
    return (
        <div className={style.formContent}>
             <input type="text" name="name" value={editedProfile.name} onChange={handleEditProfileChange} />
            <input type="text" name="type" value={editedProfile.type} onChange={handleEditProfileChange} />
            <input type="text" name="gender" value={editedProfile.gender} onChange={handleEditProfileChange} />
             <input type="number" name="years" value={editedProfile.years} onChange={handleEditProfileChange} />
             <textarea  name="description" value={editedProfile.description} onChange={handleEditProfileChange} />
             <input type="file"  onChange={handleEditFileChange} />
            {editedProfile.photo && typeof editedProfile.photo === 'string' ? (
                 <img src={editedProfile.photo} alt="Pet Profile" style={{ maxWidth: '100px' }}/>
                 ) : null}
             <button onClick={handleEditProfile}>Сохранить</button>
           <button onClick={handleCancelEdit}>Отменить</button>
        </div>
    );
}

export default UpdatePetProfileComponent;