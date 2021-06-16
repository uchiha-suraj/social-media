import { Avatar } from '@material-ui/core';
import React from 'react';
import { useState } from 'react';
import './Post.css';

function Post({ username, caption, imageUrl }) {
    const [comments, setComments] = useState([]);

    return (
        <div className = "post">
            <div className = "post__header">
                {/* header -> avatar + username */}
                <Avatar
                    className = "post__avatar"
                    alt = 'suraj123'
                    src = "/static/images/avatar/1.jpg"
                />

                <h2>{username}</h2>
            </div>
            

            {/* image */}
            <img 
                className = "post__image" 
                src = {imageUrl}
                alt = ""
            /> 

            {/* username + caption */}
            <h4 className = "post__text">
                <strong>{username}</strong> {caption}</h4>
        </div>
    )
}

export default Post
