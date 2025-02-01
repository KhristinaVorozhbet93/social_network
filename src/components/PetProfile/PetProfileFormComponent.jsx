import React, { useState } from 'react';
import style from './PetPfofileComponent.module.css'


//переименовать данный компонент 
//и сделать добавление профиля прямо отсюда
function PetProfileFormComponent({ onSave, handleCancelEdit }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const accountId = localStorage.getItem('accountId');
    const newProfile = {
      accountId: accountId,
      name: name,
      type: type,
      gender: gender,
      age: parseInt(age),
      description: description,
      selectedFile: selectedFile
    };

    onSave(newProfile)
    setName('');
    setType('');
    setGender('');
    setAge('');
    setDescription('');
    setSelectedFile(null);
  };

  return (
    <div>
      <form className={style.form} onSubmit={handleSubmit}>
        <div className={style.formGroup}>
          <label htmlFor="name">Имя животного:</label>
          <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>
        <div className={style.formGroup}>
          <label htmlFor="type">Тип животного:</label>
          <input type="text" id="type" value={type} onChange={(e) => setType(e.target.value)} required />
        </div>
        <div className={style.formGroup}>
          <label htmlFor="gender">Пол:</label>
          <select id="gender" value={gender} onChange={(e) => setGender(e.target.value)} required>
            <option value="">Выберите пол</option>
            <option value="Самец">Самец</option>
            <option value="Самка">Самка</option>
            <option value="unknown">Неизвестно</option>
          </select>
        </div>
        <div className={style.formGroup}>
          <label htmlFor="age">Возраст:</label>
          <input type="number" id="age" value={age} onChange={(e) => setAge(e.target.value)} required />
        </div>
        <div className={style.formGroup}>
          <label htmlFor="description">Описание:</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        <div className={style.formGroup}>
          <label htmlFor="photo">Фото:</label>
          <input type="file" id="photo" onChange={handleFileChange} />
        </div>
        <button type="submit">Сохранить</button>
        <button onClick={handleCancelEdit}>Отменить</button>
      </form>
    </div>
  );
}

export default PetProfileFormComponent;