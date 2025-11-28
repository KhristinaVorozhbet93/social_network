import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAccountApi } from '../../App';
import ContentContainer from '../Layout/ContentContainer';
import style from './ChatComponent.module.css';
import ChatCreateComponent from './ChatCreateComponent';

function ChatComponent() {
    const [chats, setChats] = useState([]),
        [loading, setLoading] = useState(true),
        navigate = useNavigate(),
        accountApi = useAccountApi();
    const profileId = localStorage.getItem('profileId');

    useEffect(() => {
        const fetchChats = async () => {
            setLoading(true);
            try {
                const profileId = localStorage.getItem('profileId');
                const fetchedChats = await accountApi.getChats(profileId);
                setChats(fetchedChats);
            } finally {
                setLoading(false);
            }
        };

        fetchChats();
    }, [accountApi]);

    const handleChatClick = (chatId) => {
        navigate(`/chat/${chatId}`);
    };

    const handleChatDelete = async (chatId, event) => {
        event.stopPropagation();
        await accountApi.deleteChat(chatId);
        setChats(prevChats => prevChats.filter(chat => chat.id !== chatId));
    };

    const refreshChats = async () => {
        setLoading(true);
        try {
            const fetchedChats = await accountApi.getChats(profileId);
            setChats(fetchedChats);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <div>Загрузка чатов...</div>;
    }

    return (
        <ContentContainer>
            <ChatCreateComponent onChatAdded={refreshChats} />
            <h2 className={style.title}>Чаты</h2>
            {chats.length > 0 ? (
                <ul className={style.chatList}>
                    {chats.map(chat => (
                        <li className={style.chatItem} key={chat.id} onClick={() => handleChatClick(chat.id)}>
                            <img src={chat.photoUrl} alt="Profile" className={style.profileImage} />
                            <div className={style.chatInfo}>
                                <span className={style.chatName}>{chat.firstName} {chat.lastName}</span>
                                {chat.lastMessage && (
                                    <p className={style.lastMessage}>
                                        {chat.userName}: {chat.lastMessage}
                                    </p>
                                )}
                            </div>
                            <button className={style.deleteButton} onClick={(event) => handleChatDelete(chat.id, event)}>Удалить</button>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className={style.noChats}>У вас пока нет чатов</div>
            )}
        </ContentContainer>
    );
}


export default ChatComponent;