import React, { useState } from 'react';
import style from './PetPfofileComponent.module.css'

function PetProfileFormComponent({ onSave }) {
  const [name, setName] = useState('');
  const [type, setType] = useState('');
  const [gender, setGender] = useState('');
  const [age, setAge] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    const accountId = localStorage.getItem('accountId');
    const newProfile = {
      accountId: accountId,
      name : name,
      type : type,
      gender : gender,
      age: parseInt(age),
      description,
    };
    onSave(newProfile)
    setName('');
    setType('');
    setGender('');
    setAge('');
    setDescription('');

  };

  return (
    <div className={style.formContainer}>
      <form className={style.form} onSubmit={handleSubmit}>
        <label>
          Имя животного:
          <input type="text" name="name" className={style.field} value={name} onChange={e => setName(e.target.value)} required/>
        </label>
        <label>
          Вид животного:
          <input type="text" name="type" className={style.field} value={type} onChange={e => setType(e.target.value)} required/>
        </label>
        <label>
          Пол животного:
          <select name="gender" className={style.field} value={gender} onChange={e => setGender(e.target.value)} required>
            <option value="Самец">Самец</option>
            <option value="Самка">Самка</option>
          </select>
        </label>
        <label>
          Возраст:
          <input type="number" name="age" className={style.field} value={age} onChange={e => setAge(e.target.value)} required/>
        </label>
        <label>
          Описание:
          <textarea name="description" className={style.field} value={description} onChange={e => setDescription(e.target.value)}></textarea>
        </label>
        <button type="submit" className={style.buttonForm}>Сохранить</button>
      </form>
    </div>
  );
}

export default PetProfileFormComponent;