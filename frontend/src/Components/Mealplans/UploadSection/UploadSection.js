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
        var uploadTask = storage.ref("mealplan").child(this.state.image.name).put(this.state.image);
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
                        "description": thisContext.state.description,
                        "mealpreferences" : thisContext.state.mealpreferences,
                        "caloricgoals":thisContext.state.caloricgoals,
                        "mealTiming":thisContext.state.mealTiming,
                        "healthGoals":thisContext.state.healthGoals,
                        "portionSize":thisContext.state.portionSize,
                        "mealpostImgURL": downloadURL,
                        "userImage" : JSON.parse(localStorage.getItem("user")).userImage
                    }
        
                    const requestOptions = {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(payload),
                    };
        
                    fetch('http://localhost:8080/api/mealpostService/save', requestOptions)
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
                   <div className="upload_header">Create Meal Plan</div>

                
                   <select
                            value={this.state.mealpreferences}
                            onChange={(event) => this.setState({ mealpreferences: event.target.value })}
                            className="upload_mealpreferences"
                            >
                                <option className="upload_mealpreferences" value="">Select Meal Preferences</option>
                                <option className="upload_mealpreferences" value="vegetarian">Vegetarian</option>
                                <option className="upload_mealpreferences" value="vegan">Vegan</option>
                                <option className="upload_mealpreferences" value="gluten-free">Gluten-Free</option>
                            {/* Add more options as needed */}
                    </select>
                    <select
                            value={this.state.caloricgoals}
                            onChange={(event) => this.setState({ caloricgoals: event.target.value })}
                            className="upload_caloricgoals"
                            >
                                <option className="upload_caloricgoals" value="">Select Caloric Goals</option>
                                <option className="upload_caloricgoals" value="less than 1500">less than 1500</option>
                                <option className="upload_caloricgoals" value="1500-2000">1500-2000</option>
                                <option className="upload_caloricgoals" value="2000-2500">2000-2500</option>
                                <option className="upload_caloricgoals" value="2500-4000">2500-4000</option>
                                <option className="upload_caloricgoals" value="more than 4000">more than 4000</option>
                            {/* Add more options as needed */}
                    </select>
                    
                    <select
                            value={this.state.mealTiming}
                            onChange={(event) => this.setState({ mealTiming: event.target.value })}
                            className="upload_mealTiming"
                                >
                                <option className="upload_mealTiming" value="">Select Meal Timing</option>
                                <option className="upload_mealTiming" value="breakfast">Breakfast</option>
                                <option className="upload_mealTiming" value="lunch">Lunch</option>
                                <option className="upload_mealTiming" value="dinner">Dinner</option>
                                <option className="upload_mealTiming" value="snack">Snack</option>
                                {/* Add more options as needed */}
                    </select>

                    <select
                            value={this.state.healthGoals}
                            onChange={(event) => this.setState({ healthGoals: event.target.value })}
                            className="upload_healthGoals"
                                >
                                <option className="upload_healthGoals" value="">Select Health Goals</option>
                                <option className="upload_healthGoals" value="weight-loss">Weight Loss</option>
                                <option className="upload_healthGoals" value="muscle-gain">Muscle Gain</option>
                                <option className="upload_healthGoals" value="maintain-weight">Maintain Weight</option>
                                <option className="upload_healthGoals" value="disease-management">Disease Management</option>
                                {/* Add more options as needed */}
                                </select>

                    <select
                            value={this.state.portionSize}
                            onChange={(event) => this.setState({ portionSize: event.target.value })}
                            className="upload_portionSize"
                                >
                                <option className="upload_portionSize" value="">Select Portion Size</option>
                                <option className="upload_portionSize" value="small">Small</option>
                                <option className="upload_portionSize" value="medium">Medium</option>
                                <option className="upload_portionSize" value="large">Large</option>
                                <option className="upload_portionSize" value="extra-large">Extra Large</option>
                                {/* Add more options as needed */}
                    </select>

                    <textarea onChange={(event)=> this.state.description = event.currentTarget.value} className="upload_area" placeholder="Type your Ingrediants" ></textarea>
                   
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
                        <img src={add}width="37px" height="35px"/>
                        <div className="upload_text">Add Meal Plan</div>
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