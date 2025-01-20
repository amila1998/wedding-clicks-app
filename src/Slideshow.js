/* eslint-disable */
import React, { useEffect, useState } from "react";

const Slideshow = ({ accessToken }) => {
    const [photos, setPhotos] = useState([]);
    const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

    useEffect(() => {
        // Retrieve photos and the initial index from localStorage
        const storedPhotos = JSON.parse(localStorage.getItem("slideshowPhotos"));
        const initialIndex = JSON.parse(localStorage.getItem("currentPhotoIndex"));

        if (storedPhotos) {
            setPhotos(storedPhotos);
            setCurrentPhotoIndex(initialIndex || 0);
        }
    }, []);

    // Auto-transition for the slideshow
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentPhotoIndex((prevIndex) =>
                prevIndex === photos.length - 1 ? 0 : prevIndex + 1
            );
        }, 3000); // Change image every 3 seconds
        return () => clearInterval(interval);
    }, [photos]);

    return (
        <div className="presentation-container">
            {photos.length > 0 ? (
                <div className="slideshow">
                    <div className="slideshow-image">
                        <img
                            src={photos[currentPhotoIndex]?.webViewLink}
                            alt={photos[currentPhotoIndex]?.name}
                        />
                    </div>
                </div>
            ) : (
                <p>No photos available.</p>
            )}
        </div>
    );
};

export default Slideshow;
