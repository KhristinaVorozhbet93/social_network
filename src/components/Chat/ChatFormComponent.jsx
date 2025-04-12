import React, { useState, useEffect, useRef } from 'react';
import style from './ChatFormComponent.module.css';
import * as signalR from "@microsoft/signalr";
import { useAccountApi } from '../../App';
import { useParams } from 'react-router-dom';
import ContentContainer from '../ContentContainer';
import moment from 'moment';

function ChatFormComponent() {
    const
        [messages, setMessages] = useState([]),
        [profile, setProfile] = useState([]),
        [newMessageText, setNewMessageText] = useState(''),
        [loading, setLoading] = useState(true),
        accountApi = useAccountApi(),
        { id: chatId } = useParams(),
        profileId = localStorage.getItem('profileId'),
        connectionRef = useRef(null);

    useEffect(() => {
        const buildConnection = () => {
            const newConnection = new signalR.HubConnectionBuilder()
                .withUrl("https://localhost:7128/chatHub") 
                .withAutomaticReconnect()
                .configureLogging(signalR.LogLevel.Information)
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
        const fetchMessages = async () => {
            setLoading(true);
            try {
                const fetchedMessages = await accountApi.getChatMessages(chatId);
                setMessages(fetchedMessages);
                const data = await accountApi.getUserProfileById(profileId);
                setProfile(data);
            } finally {
                setLoading(false);
            }
        };

        if (chatId && profileId) {
            fetchMessages();
        }

    }, [chatId, profileId, accountApi]);

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

    if (loading) {
        return <div>Загрузка сообщений...</div>;
    }

    return (
        <ContentContainer>
            <h2>Чат</h2>
            {messages.length > 0 ? (
                <div className={style.messages}>
                    {messages.map((message, index) => (
                        <div
                            key={index}
                            className={`${style.message} ${message.userId === profileId ? style.myMessage : style.otherMessage}`}
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
                    <div />
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