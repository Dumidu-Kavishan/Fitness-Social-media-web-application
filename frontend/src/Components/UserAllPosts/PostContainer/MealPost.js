import React,{Component} from "react";
import "./PostContainer.css";
import { Avatar, Paper } from "@mui/material";
import like from "../../../images/like.png"
import likebutton from "../../../images/likebutton.png"
import share from "../../../images/share.png"
import comment from "../../../images/comment.png"
import { BiSolidEdit } from "react-icons/bi";
import { MdOutlineDelete } from "react-icons/md";
import firebase from "../../../firebase";
import "firebase/compat/storage";

const uploadImageToFirebase = (image) => {
    return new Promise((resolve, reject) => {
      const storageRef = firebase.storage().ref();
      const uploadTask = storageRef.child(`images/${image.name}`).put(image);
  
      uploadTask.on(
        'state_changed',
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


class  Post extends Component {
    constructor(props) {
        super(props);
        this.state = { 
        
            commentList:[],
            editMode: false,
            updatedDescription: this.props.object.description,
            updatedmealpreferences : this.props.object.mealpreferences,
            updatedcaloricgoals : this.props.object.caloricgoals,
            updatedmealTiming : this.props.object.mealTiming,
            updatedhealthGoals : this.props.object.healthGoals,
            updatedportionSize : this.props.object.portionSize,
            updatedmealpostImgURL: null
            
         }
         this.handleDeletePost = this.handleDeletePost.bind(this);
         this.handleEditPost = this.handleEditPost.bind(this);
         this.handleUpdatePost = this.handleUpdatePost.bind(this);
    }

    //add comment thing
    componentDidMount(){
        this.getComments();
    }
    //end

    isImageAvailable=(data)=>{
        return data==""?false:true;
    }

    handleDeletePost = () => {
        const { mealId } = this.props.object;
       
      
        
        fetch(`http://localhost:8080/api/mealpostService/delete/${mealId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then((response) => {
            if (response.ok) {
              
              console.log('Post deleted successfully');
              window.location.reload();
              
            } else {
              
              console.error('Failed to delete post');
            }
          })
          .catch((error) => {
            console.error('Error deleting post:', error);
          });
      };

    handleEditPost = () => {
        this.setState({ editMode: true });
    };

    handleUpdatePost = async () => {
        const { mealId } = this.props.object;
        const { updatedDescription } = this.state;
        const{updatedmealpreferences} = this.state;
        const{updatedcaloricgoals} = this.state;
        const{updatedmealTiming} = this.state;
        const{updatedhealthGoals} = this.state;
        const{updatedportionSize} = this.state;
            

        let updatedmealpostImgURL = '';
        if (this.state.updatedmealpostImgURL) {
            try {
                updatedmealpostImgURL = await uploadImageToFirebase(this.state.updatedmealpostImgURL);
            } catch (error) {
                console.error('Error uploading image:', error);
                return;
            }
        } else {
            updatedmealpostImgURL = this.props.object.mealpostImgURL;
        }

        const payload = {
            description: updatedDescription,
            mealpreferences:updatedmealpreferences,
            caloricgoals:updatedcaloricgoals,
            mealTiming:updatedmealTiming,
            healthGoals:updatedhealthGoals,
            portionSize:updatedportionSize,
            mealpostImgURL: updatedmealpostImgURL,
        };

        fetch(`http://localhost:8080/api/mealpostService/update/${mealId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
        })
            .then((response) => {
                if (response.ok) {
                    console.log('Post updated successfully');
                    this.setState({ editMode: false });
                } else {
                    console.error('Failed to update post');
                }
            })
            .catch((error) => {
                console.error('Error updating post:', error);
            });
    };


    //add comment thing
    getComments = () => {
        fetch('http://localhost:8080/api/mealcommentService/getAllComments/' + this.props.object.mealId)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch comments');
                }
                return response.json();
            })
            .then(data => {
                this.setState({ commentList: data });
            })
            .catch(error => {
                console.error('Error fetching comments:', error);
            });
    }

    submitComments = (event) => {
        if (event.key === "Enter") {
            let comment = event.currentTarget.value;
            if (comment.trim() !== "") {

                
                
                let payload = {
                    "commentId": Math.floor(Math.random() * 1000000).toString(),
                    "userId": JSON.parse(localStorage.getItem("user")).userId,
                    "mealId": this.props.object.mealId,
                    "comment": comment,
                    "userName":JSON.parse(localStorage.getItem("user")).userName,
                    "userImage" :JSON.parse(localStorage.getItem("user")).userImage,
                }

                const requestOptions = {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                }

                fetch("http://localhost:8080/api/mealcommentService/save", requestOptions)
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to submit comment');
                    }
                    return response.json();
                })
                    .then(data => {
                        this.getComments();
                        
                    })
                    .catch(error => {
                        console.error('Error submitting comment:', error);
                    });

            }
        }
    }

    //end
    render() { 

        const { editMode, updatedDescription ,updatedmealpreferences ,updatedcaloricgoals ,updatedmealTiming ,updatedhealthGoals ,updatedportionSize } = this.state;

        return (
        <div>
            <Paper className="post_container">
                {/*header*/}
                <div className="post_header">
                    <div className="post_header_main">
                        <div className="post_header_image">
                            <Avatar src={this.props.object.userImage} className="post_img"/>
                        </div>
                        <div className="post_header_text">
                            {this.props.object.userName}
                        </div>
                    </div>
                    <div className="post-btns">
                            {editMode ? (
                                <BiSolidEdit color="green" fontSize="20px" cursor="pointer" onClick={this.handleUpdatePost} />
                            ) : (
                                <BiSolidEdit color="green" fontSize="20px" cursor="pointer" onClick={this.handleEditPost} />
                            )}
                            <MdOutlineDelete color="red" fontSize="20px" cursor="pointer" onClick={this.handleDeletePost} />
                        </div>
                    </div>
                
               
                {/* Render meal preferences */}
                {editMode ? (
                <div className="upload_mealpreferences_edit_mode">
                    <select
                    className="upload_mealpreferences"
                    value={updatedmealpreferences}
                    onChange={(e) => this.setState({ updatedmealpreferences: e.target.value })}
                    >
                    <option className="upload_mealpreferences" value="">Select Meal Preferences</option>
                    <option className="upload_mealpreferences" value="vegetarian">Vegetarian</option>
                    <option className="upload_mealpreferences" value="vegan">Vegan</option>
                    <option className="upload_mealpreferences" value="gluten-free">Gluten-Free</option>
                    </select>
                </div>
                ) : (
                this.props.object.mealpreferences && (
                    <div className="post_mealpreferences">
                    <div className="post_content">Meal Preferences: {this.props.object.mealpreferences}</div>
                    </div>
                )
                )}

                {/* Render caloric goals */}
                {editMode ? (
                    <div className="upload_caloricgoals_edit_mode">
                        <select
                            type="text"
                            value={updatedcaloricgoals}
                            onChange={(e) => this.setState({ updatedcaloricgoals: e.target.value })}
                            className="upload_caloricgoals"
                        >
                        <option className="upload_caloricgoals" value="">Select Caloric Goals</option>
                        <option className="upload_caloricgoals" value="less than 1500">less than 1500</option>
                        <option className="upload_caloricgoals" value="1500-2000">1500-2000</option>
                        <option className="upload_caloricgoals" value="2000-2500">2000-2500</option>
                        <option className="upload_caloricgoals" value="2500-4000">2500-4000</option>
                        <option className="upload_caloricgoals" value="more than 4000">more than 4000</option>
                        </select>    
                    </div>
                ) : (
                    this.props.object.caloricgoals && (
                        <div className="post_caloricgoals">
                            <div className="post_content">Caloric Goals: {this.props.object.caloricgoals}</div>
                        </div>
                    )
                )}

                {/* Render meal timing */}
                {editMode ? (
                    <div className="post_mealTiming_edit_mode">
                        <select
                            type="text"
                            value={updatedmealTiming}
                            onChange={(e) => this.setState({ updatedmealTiming: e.target.value })}
                            className="post_mealTiming_input"
                        >
                                <option className="upload_mealTiming" value="">Select Meal Timing</option>
                                <option className="upload_mealTiming" value="breakfast">Breakfast</option>
                                <option className="upload_mealTiming" value="lunch">Lunch</option>
                                <option className="upload_mealTiming" value="dinner">Dinner</option>
                                <option className="upload_mealTiming" value="snack">Snack</option>
                        </select>    
                    </div>
                ) : (
                    this.props.object.mealTiming && (
                        <div className="post_mealTiming">
                            <div className="post_content">Meal Time: {this.props.object.mealTiming}</div>
                        </div>
                    )
                )}

                {/* Render portion size */}
                {editMode ? (
                    <div className="post_portionSize_edit_mode">
                        <select
                            type="text"
                            value={updatedportionSize}
                            onChange={(e) => this.setState({ updatedportionSize: e.target.value })}
                            className="post_portionSize_input"
                        >

                                <option className="upload_portionSize" value="">Select Portion Size</option>
                                <option className="upload_portionSize" value="small">Small</option>
                                <option className="upload_portionSize" value="medium">Medium</option>
                                <option className="upload_portionSize" value="large">Large</option>
                                <option className="upload_portionSize" value="extra-large">Extra Large</option>
                        </select>        
                    </div>
                ) : (
                    this.props.object.portionSize && (
                        <div className="post_portionSize">
                            <div className="post_content">Portion Size: {this.props.object.portionSize}</div>
                        </div>
                    )
                )}

                {/* Render health goals */}
                {editMode ? (
                    <div className="post_healthGoals_edit_mode">
                        <select
                            type="text"
                            value={updatedhealthGoals}
                            onChange={(e) => this.setState({ updatedhealthGoals: e.target.value })}
                            className="post_healthGoals_input"
                        >
                         <option className="upload_healthGoals" value="">Select Health Goals</option>
                                <option className="upload_healthGoals" value="weight-loss">Weight Loss</option>
                                <option className="upload_healthGoals" value="muscle-gain">Muscle Gain</option>
                                <option className="upload_healthGoals" value="maintain-weight">Maintain Weight</option>
                                <option className="upload_healthGoals" value="disease-management">Disease Management</option>
                        </select>
                    </div>
                ) : (
                    this.props.object.healthGoals && (
                        <div className="post_healthGoals">
                            <div className="post_content">Health Goals: {this.props.object.healthGoals}</div>
                        </div>
                    )
                )}

                {/* Render description */}
                {editMode ? (
                    <div className="post_description_edit_mode">
                        <textarea
                            value={updatedDescription}
                            onChange={(e) => this.setState({ updatedDescription: e.target.value })}
                            className="post_description_textarea"
                        />
                    </div>
                ) : (
                     
                        <textarea
                        className="mealplan_description"
                        value={this.props.object.description}
                        readOnly
                    />
                    
                )}

                {/*image*/}
                <div className="post_image">
                        {editMode ? (
                            <input className="update-post-img"
                                type="file"
                                onChange={(e) => this.setState({ updatedmealpostImgURL: e.target.files[0] })}
                                accept="image/*"
                            />
                        ) : (
                            this.isImageAvailable(this.props.object.mealpostImgURL) && (
                                <img src={this.props.object.mealpostImgURL} width="600px" alt="Post" />
                            )
                        )}
                    </div>
                    
                
                {/*like count*/}
                <div className="post_likecountContainer">
                    <div className="post_like">
                        <img className="post_img" src={like}/>
                    </div>
                    <div className="post_likecount">
                    {this.props.object.likes}
                    </div>
                </div>
                {/*like share box*/}
                <div className="post_likeshare">
                    <div className="post_tab">
                        <div className="post_tabfirst">
                           <img className="post_tabing" src={likebutton}/>
                        </div>
                        <div className="post_tabtext">
                        Like
                        </div>
                    </div>

                    <div className="post_tab">
                        <div className="post_tabfirst">
                           <img className="post_tabing" src={comment}/>
                        </div>
                        <div className="post_tabtext">
                        Comment
                        </div>
                    </div>

                    <div className="post_tab">
                        <div className="post_tabfirst">
                           <img className="post_tabing" src={share}/>
                        </div>
                        <div className="post_tabtext">
                        Share
                        </div>
                    </div>
                    
                </div>
                {/*comment box*/}
                {/* <div className="upload_comment">
                <div className="upload_top">
                <div>
                    <Avatar src={JSON.parse(localStorage.getItem("user")).userImage} className="upload_img"/>
                </div>
                <div>
                {
                                    this.state.commentList.map((item, index) => (
                                        index < 4 ?
                                            <div className="post_comment" key={item.commentId}><img className="post_img" src={item.userImage}/> {item.userName}  {item.comment}</div> : <span key={item.commentId}></span>
                                    ))
                                }
                                <input className="upload_box" onKeyPress={this.submitComments} placeholder="what's on your mind?" type="text" />
                            </div> */}
                            <div className="upload_comment">
                <div className="upload_top">
                <div>
                    
                </div>
                <div>
                {
                                    this.state.commentList.map((item, index) => (
                                        index < 4 ?
                                            <div className="post_comment" key={item.commentId}>
                                                <img className="post_img" src={item.userImage}/>
                                               
                                                <div className="comment_user"> {item.userName} </div> 
                                                <div className="comment"> {item.comment}</div> 
                                              
                                                
                                            </div> : <span key={item.commentId}></span>
                                    ))
                                }
                                <div className="comment-box">
                                <Avatar src={JSON.parse(localStorage.getItem("user")).userImage} className="upload_img"/>
                                <input className="upload_box" onKeyPress={this.submitComments} placeholder="what's on your mind?" type="text" />
                                </div>
                </div>
            </div>
                </div>
                </Paper>
            
        </div>  );
    }
}
 
export default Post;