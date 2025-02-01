import React from 'react';
import style from './PetPfofileComponent.module.css';

function PetPhotoAlbum({ photos, onDeletePhoto, onSetMainPhoto }) {
    if (!photos || photos.length === 0) {
        return <p>Нет фотографий в альбоме</p>;
    }

    return (
        <div className={style.photoAlbum}>
            {photos.map(photo => (
                <div key={photo.id} className={style.photoItem}>
                    <img src={photo.url} alt="Pet Profile" className={style.albumPhoto} />
                    <div className={style.photoButtons}>
                        <button onClick={() => onDeletePhoto(photo.id)}>Удалить</button>
                        <button onClick={() => onSetMainPhoto(photo.id)}>Сделать главной</button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PetPhotoAlbum;