import { useEffect, useState } from "react";
import { useAccountApi } from "../../App";
import { useNavigate } from "react-router-dom";
import style from './FriendRequestComponent.module.css';
import { Snackbar, Alert, CircularProgress } from '@mui/material';

function FriendRequestComponent({ activeTab }) {
    const
        [receivedRequests, setReceivedRequests] = useState([]),
        [sentRequests, setSentRequests] = useState([]),
        [activeRequestTab, setActiveRequestTab] = useState('received'),
        [acceptLoading, setAcceptLoading] = useState(false),
        [rejectLoading, setRejectLoading] = useState(false),
        [snackbarOpen, setSnackbarOpen] = useState(false),
        [snackbarMessage, setSnackbarMessage] = useState(''),
        [snackbarSeverity, setSnackbarSeverity] = useState('success'),
        navigate = useNavigate(),
        accountApi = useAccountApi(),
        profileId = localStorage.getItem('profileId');

    useEffect(() => {
        const fetchRequests = async () => {
            try {
                const profileId = localStorage.getItem('profileId');
                const received = await accountApi.getReceivedFriendRequests(profileId);
                setReceivedRequests(received);

                const sent = await accountApi.getSentFriendRequests(profileId);
                setSentRequests(sent);

            } catch (error) {
                console.error("Ошибка при получении заявок в друзья:", error);
            }
        };

        fetchRequests();
    }, [activeTab]);

    const handleSnackbarClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setSnackbarOpen(false);
    };

    const handleClick = (id) => {
        navigate(`/profile/user/${id}`);
    }

    const handleRequestTabClick = (tab) => {
        setActiveRequestTab(tab);
    };

    const handleAcceptRequest = async (friendId, event) => {
        event.stopPropagation();
        setAcceptLoading(true);
        try {
            await accountApi.acceptFriendRequest(profileId, friendId);          
            setSnackbarSeverity('success');
            setSnackbarMessage('Заявка в друзья принята');
            setSnackbarOpen(true);
            setReceivedRequests(receivedRequests.filter(friend => friend.id !== friendId));
        }
        finally {
            setAcceptLoading(false);
        }
    };

    const handleRejectRequest = async (friendId, event) => {
        event.stopPropagation();
        setRejectLoading(true);
        try {
            await accountApi.rejectFriendRequest(profileId, friendId);
            setSnackbarSeverity('error');
            setSnackbarMessage('Заявка в друзья отклонена');
            setSnackbarOpen(true);
            setReceivedRequests(receivedRequests.filter(friend => friend.id !== friendId));
        }
        finally {
            setRejectLoading(false);
        }
    };

    return (
        <div className={style.friendRequestsContainer}>
            <div className={style.requestTabs}>
                <button
                    className={activeRequestTab === 'received' ? style.active : ''}
                    onClick={() => handleRequestTabClick('received')}
                >
                    Входящие заявки
                </button>
                <button
                    className={activeRequestTab === 'sent' ? style.active : ''}
                    onClick={() => handleRequestTabClick('sent')}
                >
                    Отправленные заявки
                </button>
            </div>

            {activeRequestTab === 'received' && (
                <div className={style.requestListContainer}>
                    {receivedRequests.length === 0 ? (
                        <div className={style.text}>Нет входящих заявок.</div>
                    ) : (
                        <ul>
                            {receivedRequests.map(request => (
                                <li key={request.id} onClick={() => handleClick(request.id)} className={style.requestItem}>
                                    {request.photoUrl && (
                                        <img
                                            src={request.photoUrl}
                                            alt={`${request.firstName} ${request.lastName}`}
                                            className={style.friendPhoto}
                                        />
                                    )}
                                    {request.firstName} {request.lastName}
                                    <div className={style.requestEditButtons}>

                                        <button onClick={(event) => handleAcceptRequest(request.id, event)} disabled={acceptLoading}>
                                            {acceptLoading ? <CircularProgress size={24} color="inherit" /> : 'Принять'}</button>
                                        <button onClick={(event) => handleRejectRequest(request.id, event)} disabled={rejectLoading}>
                                            {rejectLoading ? <CircularProgress size={24} color="inherit" /> : 'Отклонить'}</button>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}

            {activeRequestTab === 'sent' && (
                <div className={style.requestListContainer}>
                    {sentRequests.length === 0 ? (
                        <div className={style.text}>Нет исходящих заявок.</div>
                    ) : (
                        <ul>
                            {sentRequests.map(request => (
                                <li key={request.id} className={style.requestItem} onClick={() => handleClick(request.id)} >
                                    {request.photoUrl && (
                                        <img
                                            src={request.photoUrl}
                                            alt={`${request.firstName} ${request.lastName}`}
                                            className={style.friendPhoto}
                                        />
                                    )}
                                    <div className={style.friendInfo}>
                                        {request.firstName} {request.lastName}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            )}
            <Snackbar
                open={snackbarOpen}
                autoHideDuration={6000}
                onClose={handleSnackbarClose}
                anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
                className={style.snackbar}
            >
                <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
                    {snackbarMessage}
                </Alert>
            </Snackbar>
        </div>
    );
}

export default FriendRequestComponent;