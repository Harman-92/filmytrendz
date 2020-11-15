import React from "react";
import images from "../config/images";
import {Image} from "semantic-ui-react";


const Avatar = ({user, size}) => {
    return (
        <div style={{display: "flex", justifyContent:'center', alignItems: 'center', width: 'fit-content'}}>
           <Image src={images.avatar} circular size={size}
              />
              <div className='avatarText'>
                  <div style={{color: 'white', fontSize:36, fontWeight:'bold'}}>
                      {user.slice(0,1).toUpperCase()}</div>
              </div>
       </div>
    )
}


export default Avatar;
