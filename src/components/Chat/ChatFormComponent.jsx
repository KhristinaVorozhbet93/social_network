import React, { useState, useEffect, useRef, useCallback } from 'react';
import style from './ChatFormComponent.module.css';
import * as signalR from "@microsoft/signalr";
import { useAccountApi } from '../../App';
import { useParams } from 'react-router-dom';
import ContentContainer from '../Layout/ContentContainer';
import moment from 'moment';

function ChatFormComponent() {
    const
        [messages, setMessages] = useState([]),
        [profile, setProfile] = useState([]),
        [newMessageText, setNewMessageText] = useState(''),
        [loading, setLoading] = useState(true),
        [hasMore, setHasMore] = useState(true),
        [page, setPage] = useState(0),
        [scrollPosition, setScrollPosition] = useState(0),
        accountApi = useAccountApi(),
        { id: chatId } = useParams(),
        profileId = localStorage.getItem('profileId'),
        take = 10,
        observer = useRef(),
        lastMessageRef = useRef(null),
        scrollContainerRef = useRef(null),
        connectionRef = useRef(null);

    useEffect(() => {
        const buildConnection = () => {
            const newConnection = new signalR.HubConnectionBuilder()
                .withUrl(process.env.REACT_APP_CHAT_HUB_URL)
                .withAutomaticReconnect()
                .configureLogging(signalR.LogLevel.Error)
                .build();

            connectionRef.current = newConnection;
            connectionRef.current.start();
        };

        if (chatId) {
            buildConnection();
        }

        return () => {
            if (connectionRef.current) {
                connectionRef.current.stop();
                console.log("SignalR Disconnected.");
            }
        };
    }, [chatId]);

    useEffect(() => {
        if (connectionRef.current) {
            connectionRef.current.on("ReceiveMessage", (savedMessage) => {
                console.log("Received message:", savedMessage);
                setMessages(prevMessages => [...prevMessages, savedMessage]);
            });

            console.log("Starting signalR");

            return () => {
                connectionRef.current.off("ReceiveMessage");
            };


        }
    }, [connectionRef.current, chatId, profileId]);


    const handleNewMessageChange = (event) => {
        setNewMessageText(event.target.value);
    };

    const handleSendMessage = async () => {
        if (newMessageText.trim() === '') {
            return;
        }

        if (connectionRef.current) {
            try {
                const userName = `${profile.firstName} ${profile.lastName}`;
                await connectionRef.current.invoke("SendMessage", newMessageText, userName, profileId, chatId);
                setNewMessageText('');
            } catch (error) {
                console.error("Error sending message:", error);
                console.error("Error details:", error)
            }
        }
    };

    useEffect(() => {
        fetchMessages();
    }, [chatId, profileId]);

    const fetchMessages = useCallback(async () => {
        if (!hasMore) return;

        setLoading(true);
        try {
            const fetchedMessages = await accountApi.getChatMessages(chatId, take, page);
            setMessages(prevMessages => [...prevMessages, ...fetchedMessages]);
            const data = await accountApi.getUserProfileById(profileId);
            setProfile(data);
            setHasMore(fetchedMessages.length > 0);
            setPage(prevPage => prevPage + 1);
            if (!profile) {
                const data = await accountApi.getUserProfileById(profileId);
                setProfile(data);
            }
        } catch (error) {
            setHasMore(false);
        } finally {
            setLoading(false);
        }

    }, [chatId, profileId, accountApi, page, hasMore, loading, profile]);

    if (loading) {
        return <div>Загрузка сообщений...</div>;
    }

    return (
        <ContentContainer>
            <h2>Чат</h2>
            {messages.length > 0 ? (
                <div className={style.messages} ref={scrollContainerRef} style={{ overflowY: 'auto', height: '400px' }}>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`${style.message} ${message.userId === profileId ? style.myMessage : style.otherMessage}`}
                            ref={index === messages.length - 1 ? lastMessageRef : null}
                        >
                            <div className={style.messageHeader}>
                                <span className={style.messageAuthor}>
                                    {message.userId === profileId ? 'Вы' : message.userName}
                                </span>
                                <span className={style.messageTime}>
                                    {moment(message.dateRecord).format('YYYY-MM-DD HH:mm:ss')}
                                </span>
                            </div>
                            <div className={style.messageContent}>{message.messageText}</div>
                        </div>
                    ))}
                    {loading && <p>Загрузка...</p>}
                </div>
            ) : (
                <p>Сообщений пока нет.</p>
            )}
            <div className={style.newMessage}>
                <textarea
                    value={newMessageText}
                    onChange={handleNewMessageChange}
                    placeholder="Напишите сообщение..."
                    className={style.messageInput}
                />
                <button onClick={handleSendMessage} className={style.sendButton}>Отправить</button>
            </div>
        </ContentContainer>
    );
}

export default ChatFormComponent;