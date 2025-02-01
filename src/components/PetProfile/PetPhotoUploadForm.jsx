import React, { useState } from 'react';
import style from './PetPfofileComponent.module.css';

const PetPhotoUploadForm = ({ onUpload, onCancel }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleSubmit = async () => {
      if(selectedFile){
        onUpload(selectedFile);
        setSelectedFile(null)
    }
  };
  const handleCancel = () => {
      setSelectedFile(null)
      onCancel();
  }

  return (
    <div className={style.photoUploadForm}>
      <input type="file" onChange={handleFileChange} />
      <div className={style.formButtons}>
         <button onClick={handleSubmit}>Загрузить</button>
         <button onClick={handleCancel}>Отмена</button>
      </div>

    </div>
  );
};

export default PetPhotoUploadForm;