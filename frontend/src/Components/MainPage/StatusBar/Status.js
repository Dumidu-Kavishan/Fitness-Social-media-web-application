import { Paper } from "@mui/material";
import React, {Component} from "react";
import uploadIcon from "../../../images/upload.png";
import firebase from "../../../firebase";
import "firebase/compat/storage";
import { Avatar} from "@mui/material";

class Status extends Component {
    constructor(props) {
        super(props);
        this.state = {  }
    }
    openDialog = (event) => {
        let image = event.target.files[0];

        if(image == undefined || image == null)
            return;

        const thisContext = this;
        var storage = firebase.storage();
        var uploadTask = storage.ref("status").child(image.name).put(image);
        uploadTask.on(
            "state_changed",
            function(snapshot){
                
            },
            function(error){
                
            },
            function(){
                uploadTask.snapshot.ref.getDownloadURL().then(function(downloadURL){
                    
                    let payload = {
                        "userId" : JSON.parse(localStorage.getItem("user")).userId,
                        "userName": JSON.parse(localStorage.getItem("user")).userName,
                        "statusImageURL": downloadURL,
                        "userImage" : JSON.parse(localStorage.getItem("user")).userImage
                    }
        
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    };
        
                    fetch('http://localhost:8080/api/statusService/save', requestOptions)
                    .then(response => response.json())
                    .then(data =>{
                        
                    })
                    .catch(error =>{
                        throw new Error("Failed to save post");
                    })

                });
            }
        );
    }
    
    render() { 
        return (
        <div>

            {
                this.props.uploader == "true" ?
                <Paper className="statusbar_status">
                    <label for = "file-upload" class="upload_tabs">
                        <img src={uploadIcon} className="upload_icon"/>
                       
                    </label>   
                    
                    <input type="file" id="file-upload" onChange={this.openDialog_s}/> 
                </Paper>:
                
                <Paper className="statusbar_status">
                    <img src={this.props.object.statusImageURL} className="status_image"/>
                    <div className="name">
                        <Avatar src={this.props.object.userImage} className="user_img"/>
                        {this.props.object.userName}
                    </div>
                </Paper>

            }
           
        </div>  
        
        );
    }
}
 
export default Status;