import React, { useState, useEffect, useRef } from 'react';
import style from './CommentComponent.module.css';
import { useAccountApi } from '../App';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEllipsisV } from '@fortawesome/free-solid-svg-icons';
import { Snackbar, Alert, CircularProgress } from '@mui/material';

function CommentComponent({ photoId, profileId }) {
    const
        [comments, setComments] = useState([]),
        [newCommentText, setNewCommentText] = useState(''),
        [editingCommentId, setEditingCommentId] = useState(null),
        [snackbarOpen, setSnackbarOpen] = useState(false),
        [snackbarMessage, setSnackbarMessage] = useState(''),
        [snackbarSeverity, setSnackbarSeverity] = useState('success'),
        [editText, setEditText] = useState(''),
        [saveLoading, setSaveLoading] = useState(false),
        [addLoading, setaddLoading] = useState(false),
        [deleteLoading, setDeleteLoading] = useState(false),
        [isMenuOpen, setIsMenuOpen] = useState(null),
        accountApi = useAccountApi(),
        menuRef = useRef(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const data = await accountApi.getCommentsForPhoto(photoId);
                setComments(data);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };

        if (photoId) {
            fetchComments();
        }
    }, [photoId, accountApi]);

    const showSnackbar = (message, severity) => {
        setSnackbarMessage(message);
        setSnackbarSeverity(severity);
        setSnackbarOpen(true);
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleAddComment = async () => {
        setaddLoading(true);
        if (newCommentText.trim() !== '') {
            try {
                const profileId = localStorage.getItem('profileId');
                await accountApi.addCommentToPhoto(profileId, photoId, newCommentText);
                setNewCommentText('');
                const data = await accountApi.getCommentsForPhoto(photoId);
                setComments(data);
                showSnackbar("Комментарий успешно добавлен", "success");
            } catch (error) {
                console.error("Error adding comment:", error);
            }
            finally {
                setaddLoading(false);
            }
        }
    };

    const handleEditCommentClick = (id, text, profileId) => {
        const currentprofileId = localStorage.getItem('profileId');
        if (currentprofileId === profileId) {
            setEditingCommentId(id);
            setEditText(text);
        } else {
            showSnackbar('Вы не можете редактировать чужой комментарий', 'error');
        }
    };

    const handleUpdateComment = async (id) => {
        setSaveLoading(true);
        try {
            if (editText.trim() !== '') {
                await accountApi.updateComment(id, editText);
                setEditingCommentId(null);
                const data = await accountApi.getCommentsForPhoto(photoId);
                setComments(data);
                showSnackbar("Комментарий успешно обновлен", "success");
            }
        }
        finally {
            setSaveLoading(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditText('');
    };


    const handleDeleteComment = async (id, userId) => {
        setDeleteLoading(true);
        try {
            const currentProfileId = localStorage.getItem('profileId');
            if (currentProfileId === profileId) {
                await accountApi.deleteComment(id);
                const data = await accountApi.getCommentsForPhoto(photoId);
                setComments(data);
                showSnackbar("Комментарий успешно удален", "success");
            } else {
                if (currentProfileId === userId) {
                    await accountApi.deleteComment(id);
                    const data = await accountApi.getCommentsForPhoto(photoId);
                    setComments(data);
                    showSnackbar("Комментарий успешно удален", "success");
                } else {
                    showSnackbar('Вы не можете удалять чужой комментарий', 'error');
                }
            }
        }
        finally {
            setDeleteLoading(false);
        }
    };

    const toggleMenu = (commentId) => {
        setIsMenuOpen(isMenuOpen === commentId ? null : commentId);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className={style.commentContainer}>
            <ul>
                {comments.map(comment => (
                    <li key={comment.id} className={style.commentItem}>
                        <div className={style.commentHeader}>
                            <img
                                src={comment.photoUrl}
                                alt={`${comment.firstName} ${comment.lastName}`}
                                className={style.commentAvatar}
                            />
                            <span className={style.commentAuthor}>
                                {localStorage.getItem('profileId') === (comment.userId) ? 'Вы' : `${comment.firstName} ${comment.lastName}`}
                            </span>
                            <span className={style.commentCreatedAt}>
                                Добавлен: {moment(comment.createdAt).format('DD.MM.YYYY HH:mm')}
                            </span>
                            <button onClick={() => toggleMenu(comment.id)} className={style.menuButton}>
                                <FontAwesomeIcon icon={faEllipsisV} />
                            </button>
                        </div>

                        {editingCommentId === comment.id ? (
                            <div className={style.commentEditContainer}>
                                <textarea
                                    className={style.commentEditTextarea}
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    onBlur={() => handleUpdateComment(comment.id)}
                                />
                                <div className={style.commentEditButtons}>
                                    <button onClick={() => handleUpdateComment(comment.id)} disabled={saveLoading}>
                                        {saveLoading ? <CircularProgress size={24} color="inherit" /> : 'Сохранить'}</button>
                                    <button onClick={handleCancelEdit}>Отмена</button>
                                </div>
                            </div>
                        ) : (
                            <>
                                {isMenuOpen === comment.id && (
                                    <div className={style.menu}>
                                        <button onClick={() => handleEditCommentClick(comment.id, comment.text, comment.userId)}>Редактировать</button>
                                        <button onClick={() => handleDeleteComment(comment.id, comment.userId)} disabled={deleteLoading}>
                                            {deleteLoading ? <CircularProgress size={24} color="inherit" /> : 'Удалить'}</button>
                                    </div>
                                )}
                                <div className={style.commentText}>{comment.text}</div>
                            </>
                        )}
                    </li>
                ))}
            </ul>
            <div className={style.addComment}>
                <textarea
                    value={newCommentText}
                    onChange={(e) => setNewCommentText(e.target.value)}
                    placeholder="Добавьте комментарий..."
                />
                <button onClick={handleAddComment} disabled={addLoading}>
                    {addLoading ? <CircularProgress size={24} color="inherit" /> : 'Добавить'}</button>
            </div>

            <Snackbar
                open={snackbarOpen}
                autoHideDuration={5000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>

    );
}

export default CommentComponent;