/* eslint-disable */
import React, { useState } from "react";
import { gapi } from "gapi-script";
import "./App.css"; // Import the CSS file

const CLIENT_ID = "556276449489-30aijmpjelqie282coomp16k9uan9404.apps.googleusercontent.com";
const API_KEY = "AIzaSyA-J52ik4lg43UOxxhiUYcEPiomODwt-rU";
const SCOPES = "https://www.googleapis.com/auth/drive.file";
const FOLDER_ID = "1pWRVKRWixgFAbZCgbKBvYtsgUBxDpiH9";

const Upload = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadStatus, setUploadStatus] = useState("");
  const [photos, setPhotos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  const initClient = () => {
    gapi.load("client:auth2", async () => {
      await gapi.client.init({
        apiKey: API_KEY,
        clientId: CLIENT_ID,
        discoveryDocs: [
          "https://www.googleapis.com/discovery/v1/apis/drive/v3/rest",
        ],
        scope: SCOPES,
      });
      const authInstance = gapi.auth2.getAuthInstance();
      setIsSignedIn(authInstance.isSignedIn.get());
      authInstance.isSignedIn.listen(setIsSignedIn);
    });
  };

  // Open slideshow in a new tab
  const openSlideshowInNewTab = async() => {
    try {
      const accessToken = gapi.auth.getToken().access_token;
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents&fields=files(id,name,webViewLink,thumbnailLink)&key=${API_KEY}`,
        {
          headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPhotos(data.files); // Update the state with fetched files
        if (data.files.length === 0) {
          alert("No photos available to display.");
          return;
        }
    
        // Save photos to localStorage
        localStorage.setItem("slideshowPhotos", JSON.stringify(data.files));
        localStorage.setItem("currentPhotoIndex", JSON.stringify(currentPhotoIndex));
    
        // Open a new tab and pass the slideshow page URL
        const newTab = window.open("/slideshow", "_blank");
        if (!newTab) {
          alert("Popup blocked! Please allow popups for this site.");
        }

      } else {
        console.error("Failed to fetch photos.");
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
    }

  };


  const handleSignIn = () => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOut = () => {
    gapi.auth2.getAuthInstance().signOut();
  };

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    setIsLoading(true)
    if (!selectedFile) {
      alert("Please select a file first.");
      return;
    }

    const fileMetadata = {
      name: selectedFile.name,
      parents: [FOLDER_ID],
    };
    const form = new FormData();
    form.append(
      "metadata",
      new Blob([JSON.stringify(fileMetadata)], { type: "application/json" })
    );
    form.append("file", selectedFile);

    try {
      const accessToken = gapi.auth.getToken().access_token;
      const response = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
          body: form,
        }
      );

      if (response.ok) {
        const data = await response.json();
        setUploadStatus(`File uploaded successfully. File ID: ${data.id}`);
      } else {
        setUploadStatus("Failed to upload file. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploadStatus("Error uploading file. Please try again.");
    } finally {
      setIsLoading(false)
    }
  };

  const fetchPhotos = async () => {
    try {
      const accessToken = gapi.auth.getToken().access_token;
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents&fields=files(id,name,webViewLink,thumbnailLink)&key=${API_KEY}`,
        {
          headers: new Headers({ Authorization: `Bearer ${accessToken}` }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setPhotos(data.files); // Update the state with fetched files
      } else {
        console.error("Failed to fetch photos.");
      }
    } catch (error) {
      console.error("Error fetching photos:", error);
    }
  };

  React.useEffect(() => {
    initClient();
  }, []);

  return (
    <div className="container">
      <h2>HASHINI & AMILA</h2>
      <h3>Wedding Day Clicks</h3>
      {!isSignedIn ? (
        <button onClick={handleSignIn}>Sign in with Google</button>
      ) : (
        <></>
      )}

      {isSignedIn && (
        <div>
          <input type="file" onChange={handleFileChange} accept="image/*" />
          <button onClick={handleUpload} disabled={!selectedFile}>
            Upload
          </button>
          <br />
          <br />
          <br />
          <div style={{
            cursor: "pointer"
          }}
           
              onClick={openSlideshowInNewTab}
          >Slide Show</div>
        </div>
      )}
    </div>
  );
};

export default Upload;
