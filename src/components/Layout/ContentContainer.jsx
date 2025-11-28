import React from 'react';
import style from './ContentComponent.module.css'; 
import HeaderComponent from './HeaderComponent';
import AsideComponent from './AsideComponent';
import FooterComponent from './FooterComponent';

function ContentContainer({ children }) {
    return (
        <div className={style.container}>
            <HeaderComponent />
            <div className={style.content}>
                <AsideComponent />
                <div className={style.main_content}>
                    {children}
                </div>
            </div>
            <FooterComponent />
        </div>
    );
}

export default ContentContainer;