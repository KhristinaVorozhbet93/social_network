import { useState } from "react";
import style from './FriendsComponent.module.css';
import FriendRequestComponent from "./FriendRequestComponent";
import FriendsSearchComponent from "./FriendsSearchComponent";
import ContentContainer from "../Layout/ContentContainer";
import FriendsListComponent from "./FriendsListComponent";

function FriendsComponent() {
    const
        [activeTab, setActiveTab] = useState('friends');

    const handleTabClick = (tab) => {
        setActiveTab(tab);
    };

    return (
        <ContentContainer>
            <div className={style.tabs}>
                <button
                    className={activeTab === 'friends' ? style.active : ''}
                    onClick={() => handleTabClick('friends')}
                >
                    Друзья
                </button>
                <button
                    className={activeTab === 'requests' ? style.active : ''}
                    onClick={() => handleTabClick('requests')}
                >
                    Заявки в друзья
                </button>
                <button
                    className={activeTab === 'search' ? style.active : ''}
                    onClick={() => handleTabClick('search')}
                >
                    Поиск друзей
                </button>
            </div>

            {activeTab === 'friends' && (
               <FriendsListComponent activeTab={activeTab} />
            )}

            {activeTab === 'requests' && (
                <FriendRequestComponent activeTab={activeTab} />
            )}

            {activeTab === 'search' && (
                <FriendsSearchComponent />
            )}
        </ContentContainer>
    );
};

export default FriendsComponent;