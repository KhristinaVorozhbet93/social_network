import React, { useState, useEffect } from 'react';
import { useAccountApi } from '../../App';
import style from './ChatCreateComponent.module.css';
import { Snackbar, Alert, CircularProgress } from '@mui/material';

function ChatCreateComponent({ onChatAdded }) {  
    const
        [friends, setFriends] = useState([]),
        [selectedFriendId, setSelectedFriendId] = useState(''),
        [loading, setLoading] = useState(true),
        [isAddingChat, setIsAddingChat] = useState(false),
        [snackbarOpen, setSnackbarOpen] = useState(false),
        [snackbarMessage, setSnackbarMessage] = useState(''),
        [snackbarSeverity, setSnackbarSeverity] = useState('success'),
        accountApi = useAccountApi(),
        profileId = localStorage.getItem('profileId');

    useEffect(() => {
        const fetchFriends = async () => {
            setLoading(true);
            try {
                const fetchedFriends = await accountApi.getFriends(profileId);
                setFriends(fetchedFriends);
            } finally {
                setLoading(false);
            }
        };

        fetchFriends();
    }, [accountApi]);

    const handleFriendChange = (event) => {
        setSelectedFriendId(event.target.value);
    };

    const handleAddChat = async () => {
        if (!selectedFriendId) {
            setSnackbarMessage("Пожалуйста, выберите друга.");
            setSnackbarSeverity("warning");
            setSnackbarOpen(true);
            return;
        }

        setIsAddingChat(true);
        try {
            const friendIds = [selectedFriendId, profileId];
            const newChat = await accountApi.addChat(friendIds);
            setSnackbarMessage("Чат успешно добавлен!");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);

            if (onChatAdded) {
                onChatAdded(); 
            }

        } catch (error) {
            setSnackbarMessage(error.message);
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
        } finally {
            setIsAddingChat(false);
        }
    };

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    if (loading) {
        return <div className={style.loading}>Загрузка друзей...</div>;
    }

    return (    
        <div>
            {friends.length > 0 ? (
                <div className={style.formContainer}>
                    <label htmlFor="friendSelect" className={style.label}>Выберите друга:</label>
                    <div className={style.selectContainer}>
                        <select id="friendSelect" className={style.select} value={selectedFriendId} onChange={handleFriendChange} required disabled={isAddingChat}>
                            <option value="">-- Выберите друга --</option>
                            {friends.map(friend => (
                                <option key={friend.id} value={friend.id}>
                                    {friend.firstName} {friend.lastName}
                                </option>
                            ))}
                        </select>
                        <button className={style.addButton} onClick={handleAddChat} disabled={isAddingChat}>
                            {isAddingChat ? <CircularProgress size={24} color="inherit" /> : 'Добавить чат'}
                        </button>
                    </div>
                </div>
            ) : (
                <p className={style.noFriends}>У вас нет друзей</p>
            )}
            <Snackbar open={snackbarOpen}
                autoHideDuration={5000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}>
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default ChatCreateComponent;