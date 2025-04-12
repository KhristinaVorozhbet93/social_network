import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { CircularProgress } from '@mui/material';
import style from './TaskItem.module.css';

function TaskItem({ task, index, onUpdateTask, onDeleteTask }) {
    const
        [isMenuOpen, setIsMenuOpen] = useState(false),
        [editingTask, setEditingTask] = useState(task.text),
        [isEditing, setIsEditing] = useState(false),
        [deleteTaskLoading, setDeleteTaskLoading] = useState(false),
        [editTaskLoading, setEditTaskLoading] = useState(false);

    const handleMenuClick = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleStartEdit = () => {
        setIsEditing(true);
        setIsMenuOpen(false);
    };

    const handleCancelEdit = () => {
        setIsEditing(false);
        setEditingTask(task.text);
    };

    const handleSaveEdit = async () => {
        setEditTaskLoading(true);
        try {
            console.log("Индекс " + index);
            await onUpdateTask(task.id, editingTask, index);
            setIsEditing(false);
        }
        finally {
            setEditTaskLoading(false);
        }
    };

    const handleDeleteTask = async () => {
        setDeleteTaskLoading(true);
        try {
            await onDeleteTask(task.id, index);
            setIsEditing(false);
        } finally {
            setDeleteTaskLoading(false);
        }
    };


    return (
        <li className={style.taskItem}> 
            {isEditing ? (
                <div className={style.editContainer}> 
                    <input
                        type="text"
                        value={editingTask}
                        onChange={(e) => setEditingTask(e.target.value)}
                        className={style.editInput} 
                    />
                    <div className={style.editButtons}> 
                        <button
                            onClick={handleSaveEdit}
                            disabled={editTaskLoading}
                            className={`${style.saveButton} ${editTaskLoading ? style.disabledButton : ''}`} 
                        >
                            {editTaskLoading ? <CircularProgress size={20} color="inherit" /> : 'Сохранить'}
                        </button>
                        <button
                            onClick={handleCancelEdit}
                            className={style.cancelButton} 
                        >
                            Отмена
                        </button>
                    </div>
                </div>
            ) : (
                <span className={style.taskText}>{task.text}</span> 
            )}

            <div className={style.menuContainer}>
                <FontAwesomeIcon
                    icon={faEllipsisV}
                    onClick={handleMenuClick}
                    className={style.menuIcon}
                />
                {isMenuOpen && (
                    <div className={style.menuDropdown}>
                        <button
                            onClick={handleStartEdit}
                            className={style.menuButton} 
                        >
                            Редактировать
                        </button>
                        <button
                            onClick={handleDeleteTask}
                            disabled={deleteTaskLoading}
                            className={`${style.menuButton} ${style.deleteButton} ${deleteTaskLoading ? style.disabledButton : ''}`} 
                        >
                            {deleteTaskLoading ? <CircularProgress size={20} color="inherit" /> : 'Удалить'}
                        </button>
                    </div>
                )}
            </div>
        </li>
    );
};

export default TaskItem;