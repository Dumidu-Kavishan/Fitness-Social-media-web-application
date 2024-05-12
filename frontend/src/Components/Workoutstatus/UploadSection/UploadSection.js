import React,{Component} from "react";
import "./UploadSection.css";
import { Avatar, Paper ,Dialog } from "@mui/material";
import firebase from "../../../firebase";
import "firebase/compat/storage";
import add from "../../../images/add.png";



class UploadSection extends Component {
    constructor(props) {
        super(props);
        const userData = JSON.parse(localStorage.getItem("user"));
        this.state = { 
            open : false,
            uploadImage : null,
            description : "",
            //1 change
            userImage: ''
         }
    }

    componentDidMount() {
       
        const userId = JSON.parse(localStorage.getItem("user")).userId;
        fetch(`http://localhost:8080/api/userService/getAllUsers/${userId}`)
          .then(response => response.json())
          .then(data => {
            
            this.setState({ userImage: data.userImage });
          })
          .catch(error => {
            console.error('Error fetching user image URL:', error);
          });
      }

    handleClose = () => {
        this.setState({open: false});
    }

    openDialog = (event) => {
        this.setState({open: true});   
        this.setState({uploadImage : URL.createObjectURL(event.target.files[0])});
        this.setState({image : event.target.files[0]})
    }
    uploadToFireBase=(event)=>{
        
        const thisContext = this;
        var storage = firebase.storage();
        var uploadTask = storage.ref("workoutstatus").child(this.state.image.name).put(this.state.image);
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
                        "topic" : thisContext.state.topic,
                        "burncalories" : thisContext.state.burncalories,
                        "workouttime" : thisContext.state.workouttime,
                        "workouttype" :thisContext.state.workouttype,
                        "description": thisContext.state.description,
                        "workoutstatusImgURL": downloadURL,
                        "userImage" : JSON.parse(localStorage.getItem("user")).userImage
                    }
        
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    };
        
                    fetch('http://localhost:8080/api/workoutService/save', requestOptions)
                    .then(response => response.json())
                    .then(data =>{
                       thisContext.setState({open: false});
                       thisContext.props.update();
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
             <Dialog onClose={this.handleClose}  aria-labelledby="simple-dialog-title" className="upload_dialogbox" open={this.state.open}>
                   <div className="upload_header">Create Workoutstatus</div>
                   
                   <input type="text" onChange={(event)=> this.state.topic = event.currentTarget.value}  className="upload_topic" placeholder="About"/>
                   <input type="number" onChange={(event)=> this.state.burncalories = event.currentTarget.value}  className="upload_burn" placeholder="burn calories"/>
                   <input type="number" onChange={(event)=> this.state.workouttime = event.currentTarget.value}  className="upload_workouttype" placeholder="Workout Time"/>

                   <select 
                            value={this.state.workouttype}
                            onChange={(event)=> this.setState({ workouttype: event.target.value })}  
                            className="upload_workouttype" 
                    >
                                <option className="upload_workouttype" value="">Select Workout Type</option>
                                <option className="upload_workouttype" value="Cardio">Cardio</option>
                                <option className="upload_workouttype" value="Yoga">Vegan</option>
                                <option className="upload_workouttype" value="Cycling">Cycling</option>
                                <option className="upload_workouttype" value="Swimming">Swimming</option>
                                <option className="upload_workouttype" value="HIIT">HIIT</option>
                                
                    </select>

                   <textarea onChange={(event)=> this.state.description = event.currentTarget.value}  className="upload_description" placeholder="What's on your mind .."></textarea>

                   <img src={this.state.uploadImage} className="upload_preview"/> 
                   <input type="button" value="Post" onClick={this.uploadToFireBase} className="upload_button"/>
             </Dialog>

            <Paper className="upload_container">
            <div className="upload_top">
                <div>
                    <Avatar src={this.state.userImage} className="upload_img"/>
                </div>
                <div>
                    <input className="upload_box" placeholder="what's on your mind?" type="text"/>
                </div>
            </div>
            <div className="upload_bottom">
                <div className="upload_tabs">
                    {/* <img src={live} width="35px"/>
                    <div className="upload_text">Live Video</div> */}

                </div> 
                <div className="upload_tabs">
                    <label for = "file-upload" class="upload_tabs">
                        <img src={add}width="35px" height="35px"/>
                        <div className="upload_text">Add Workout Status</div>
                    </label>   
                    <input type="file" id="file-upload" onChange={this.openDialog}/> 
                </div>
                <div className="upload_tabs">
                    {/* <img src={feeling}width="35px"/>
                    <div className="upload_text">Feeling/Activity</div> */}
                </div>          
                
            </div>
            </Paper>
        </div> );
    }
}
 
export default UploadSection;