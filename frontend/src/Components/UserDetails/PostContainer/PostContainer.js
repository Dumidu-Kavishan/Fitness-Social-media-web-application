import React, { Component } from "react";
import "./PostContainer.css";
import firebase from "../../../firebase";
import "firebase/compat/storage";

class UserDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      editMode: false,
      editedUserData: null,
      selectedFile: null,
    };
  }

  componentDidMount() {
    const userId = JSON.parse(localStorage.getItem("user")).userId;
    fetch(`http://localhost:8080/api/userService/getAllUsers/${userId}`)
      .then((response) => response.json())
      .then((data) => this.setState({ userData: data }))
      .catch((error) => console.error("Error fetching user data:", error));
  }

  toggleEditMode = () => {
    this.setState((prevState) => ({
      editMode: !prevState.editMode,
      editedUserData: prevState.userData ? { ...prevState.userData } : null,
    }));
  };

  handleDataChange = (event) => {
    const { name, value } = event.target;
    this.setState((prevState) => ({
      editedUserData: {
        ...prevState.editedUserData,
        [name]: value,
      },
    }));
  };

  handleFileChange = (event) => {
    this.setState({ selectedFile: event.target.files[0] });
  };

  uploadToFirebase = () => {
    return new Promise((resolve, reject) => {
      const { selectedFile } = this.state;
      if (!selectedFile) {
        reject("No file selected");
        return;
      }

      const storage = firebase.storage();
      const uploadTask = storage
        .ref("userImages")
        .child(selectedFile.name)
        .put(selectedFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          
        },
        (error) => {
          reject(error);
        },
        () => {
          uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
            resolve(downloadURL);
          });
        }
      );
    });
  };

updateUserDetails = () => {
    const { editedUserData, selectedFile } = this.state;
    const userId = JSON.parse(localStorage.getItem("user")).userId;

    if (!selectedFile) {
      this.updateUserDataOnly(userId, editedUserData);
      return;
    }

    this.uploadToFirebase()
      .then((downloadURL) => {
        
        const userDataWithImage = {
          ...editedUserData,
          userImage: downloadURL,
        };
        this.updateUserDataOnly(userId, userDataWithImage);
      })
      .catch((error) => {
        console.error("Error uploading image to Firebase:", error);
      });
  };

  updateUserDataOnly = (userId, userData) => {
    fetch(`http://localhost:8080/api/userService/update/${userId}`, {
      method: "PUT",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((updatedData) => {
        this.setState({ userData: updatedData, editMode: false, selectedFile: null });
      })
      .catch((error) => {
        console.error("Error updating user data:", error);
      });
  };

  render() {
    const { userData, editMode, editedUserData } = this.state;

    if (!userData) {
      return <div>Loading...</div>;
    }

    return (
      
      <div className="user-details-container">
      <div className="user-details-card">
        <h2 className="user-details-heading">{userData.userName}</h2>
        <div className="user-details-image-container">
          <img
            src={editMode ? editedUserData.userImage : userData.userImage}
            alt="User Profile"
            className="user-details-image"
          />
        </div>
        <div className="user-details-info">
          <div className="user-details-row">
            <label id="userName" htmlFor="userName">User Name:</label>
            <input
              type="text"
              id="userName"
              name="userName"
              value={editMode ? editedUserData.userName : userData.userName}
              onChange={this.handleDataChange}
              disabled={!editMode}
            />
          </div>

          <div className="user-details-row">
            <label htmlFor="joiningDate">Joining Date:</label>
            <p id="joiningDate" name="joiningDate">{userData.joiningDate ? new Date(userData.joiningDate).toISOString().split('T')[0] : ''}</p>
          </div>

          {editMode && (
            <div className="user-details-row">
              <label htmlFor="userImage">User Image:</label>
              <input
                type="file"
                id="userImage"
                name="userImage"
                accept="image/*"
                onChange={this.handleFileChange}
              />
            </div>
          )}
        </div>
        <div className="user-details-buttons">
          {editMode ? (
            <>
              <button className="save-button" onClick={this.updateUserDetails}>Save</button>
              <button className="Cancel-button" onClick={this.toggleEditMode}>Cancel</button>
            </>
          ) : (
            <button className="edit-button" onClick={this.toggleEditMode}>Edit</button>
          )}
        </div>
      </div>
    </div>
    );
  }
}

export default UserDetails;
