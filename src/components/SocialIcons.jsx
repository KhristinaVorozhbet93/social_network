import React from 'react';
import { FaTelegram, FaVk } from 'react-icons/fa'; 

function SocialIcons() {
  return (
    <div>
        <a href="https://t.me/Khris_Vorozhbet">
           <FaTelegram size={30} color="#0088cc"/>
        </a>
          <a href="https://vk.com/id588754987">
             <FaVk size={30} color="#4a76a8"/>
         </a>
    </div>
  );
}

export default SocialIcons;