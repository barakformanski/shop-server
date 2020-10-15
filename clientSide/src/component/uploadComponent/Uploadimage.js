import React, { useState, useRef, useContext } from "react";
import axios from "axios";
import "./uploadImage.css"
import Context from '../Context';

function UploadImage() {
    const {
        userImage, setUserImage
    } = useContext(Context);

    const fileInput = useRef();
    const uploadImage = async () => {



        const uploadedFile = fileInput.current;
        axios.post("http://localhost:5000/upload", uploadedFile.files[0], {
            params: { filename: uploadedFile.files[0].name },
            onUploadProgress: (progressEvent) => {
                const percentCompleted = Math.round(
                    (progressEvent.loaded * 100) / progressEvent.total
                );
                console.log("percentCompleted:", percentCompleted);
                setUserImage("http://localhost:5000/images/" + uploadedFile.files[0].name);
            },
        });
        await console.log(userImage);

    };

    return (
        <div>
            <input type="file" ref={fileInput} />

            <button onClick={uploadImage}>העלה את התמונה שבחרת</button>
        </div>
    )
};

export default UploadImage;
