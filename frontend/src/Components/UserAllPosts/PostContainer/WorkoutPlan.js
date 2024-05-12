import React,{Component} from "react";
import "./PostContainer.css";
import { Avatar, Paper } from "@mui/material";
import like from "../../../images/like.png"
import likebutton from "../../../images/likebutton.png"
import share from "../../../images/share.png";
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
        super(props)
        this.state = { 
            //add comment thing
            commentList:[],
            editMode: false,
            updatedDescription: this.props.object.description,
            updatedfitnessgoal : this.props.object.fitnessgoal,
            updatedexercisedetails : this.props.object.exercisedetails,
            updatedrestdays : this.props.object.restdays,
            updatedfitnesslevel : this.props.object.fitnesslevel,
            updatedPostImgURL: null
            //end
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
        const { planId } = this.props.object;
       
      
        
        fetch(`http://localhost:8080/api/workplanService/delete/${planId}`, {
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
        const { planId } = this.props.object;
        const { updatedDescription } = this.state;
        const{updatedfitnessgoal} = this.state;
        const{updatedexercisedetails} = this.state;
        const{updatedrestdays} = this.state;
        const{updatedfitnesslevel} = this.state;
        
            

        let updatedPostImgURL = '';
        if (this.state.updatedPostImgURL) {
            try {
                updatedPostImgURL = await uploadImageToFirebase(this.state.updatedPostImgURL);
            } catch (error) {
                console.error('Error uploading image:', error);
                return;
            }
        } else {
            updatedPostImgURL = this.props.object.postImgURL;
        }

        const payload = {
            description: updatedDescription,
            fitnessgoal:updatedfitnessgoal,
            exercisedetails:updatedexercisedetails,
            restdays:updatedrestdays,
            fitnesslevel:updatedfitnesslevel,
            postImgURL: updatedPostImgURL,
        };

        fetch(`http://localhost:8080/api/workplanService/update/${planId}`, {
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
        fetch('http://localhost:8080/api/workplancommentService/getAllComments/' + this.props.object.planId)
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
                    "planId": this.props.object.postId,
                    "comment": comment,
                    "userName":JSON.parse(localStorage.getItem("user")).userName,
                    "userImage" :JSON.parse(localStorage.getItem("user")).userImage,
                }

                const requestOptions = {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                }

                fetch("http://localhost:8080/api/workplancommentService/save", requestOptions)
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
        

        const {editMode, updatedDescription ,updatedfitnessgoal ,updatedexercisedetails ,updatedrestdays ,updatedfitnesslevel} = this.state;

        return (<div>
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
                    <div className="post-btns" >
                    {editMode ? (
                                <BiSolidEdit color="green" fontSize="20px" cursor="pointer" onClick={this.handleUpdatePost} />
                            ) : (
                                <BiSolidEdit color="green" fontSize="20px" cursor="pointer" onClick={this.handleEditPost} />
                            )}
                            <MdOutlineDelete color="red" fontSize="20px" cursor="pointer" onClick={this.handleDeletePost} />
                    </div>
                </div>
              {/* Render fitness goal if present */}
                {editMode ? (
                    <select
                        value={updatedfitnessgoal}
                        onChange={(e) => this.setState({ updatedfitnessgoal: e.target.value })}
                        className="upload_fitnessgoal"
                    >
                        <option  className="upload_fitnessgoal" value="">Select Fitness Goal</option>
                        <option  className="upload_fitnessgoal" value="Weight Loss">Weight Loss</option>
                        <option  className="upload_fitnessgoal" value="Muscle Gain">Muscle Gain</option>
                        <option  className="upload_fitnessgoal" value="Endurance Improvement">Endurance Improvement</option>

                    </select>    
                ) : (
                    this.props.object.fitnessgoal !== null && (
                        <div className="post_fitnessgoal">
                        <div className="post_content">Fitness Goal : {this.props.object.fitnessgoal}</div>
                    </div>
                    )
                )}

                {/* Render exercise details if present */}
                {editMode ? (
                    <select
                        value={updatedexercisedetails}
                        onChange={(e) => this.setState({ updatedexercisedetails: e.target.value })}
                        className="upload_exercisedetails"
                    >
                        <option className="upload_exercisedetails" value="">Select Exercise Details</option>
                        <option className="upload_exercisedetails" value="Sets and Reps">Sets and Reps</option>
                        <option className="upload_exercisedetails" value="Strength Training">Strength Training</option>
                        <option className="upload_exercisedetails" value="Intensity">Intensity</option>
                        

                    </select> 
                ) : (
                    this.props.object.exercisedetails && (
                        <div className="post_exercisedetails">
                    
                    <div className="post_content">Exercise Type :{this.props.object.exercisedetails}</div>
                </div>
                    )
                )}

                {/* Render rest days if present */}
                {editMode ? (
                    <select
                        value={updatedrestdays}
                        onChange={(e) => this.setState({ updatedrestdays: e.target.value })}
                        className="upload_restdays"
                    >
                        <option className="upload_restdays" value="">Select Rest Days</option>
                        <option className="upload_restdays" value="1 day per week">1 day per week</option>
                        <option className="upload_restdays" value="2 days per week">2 days per week</option>
                        <option className="upload_restdays" value="3 days per week">3 days per week</option>
                    </select>
                ) : (
                    this.props.object.restdays && (
                        <div className="post_restdays">
                    
                    <div className="post_content">Rest Days : {this.props.object.restdays}</div>
                </div>
                    )
                )}

                {/* Render fitness level if present */}
                {editMode ? (
                    <select
                        value={updatedfitnesslevel}
                        onChange={(e) => this.setState({ updatedfitnesslevel: e.target.value })}
                        className="upload_fitnesslevel"
                    >
                         <option className="upload_fitnesslevel" value="">Select Fitness Level</option>
                        <option className="upload_fitnesslevel" value="Beginner">Beginner</option>
                        <option className="upload_fitnesslevel" value="Intermediate">Intermediate</option>
                        <option className="upload_fitnesslevel" value="Advanced">Advanced</option>
                    </select>
                ) : (
                    this.props.object.fitnesslevel && (
                        <div className="post_fitnesslevel">
                    
                        <div className="post_content">Fitness Level : {this.props.object.fitnesslevel}</div>
                    </div>
                    )
                )}


                {/* Render description if present */}
                {editMode ? (
                        <textarea
                            value={updatedDescription}
                            onChange={(e) => this.setState({ updatedDescription: e.target.value })}
                            className="post_description_textarea"
                        />
                    ) : (
                        <textarea
                            className="workoutplanpost_description"
                            value={this.props.object.description}
                            readOnly
                    />
                    )}
                {/*image*/}
                <div className="post_image">
                        {editMode ? (
                            <input className="update-post-img"
                                type="file"
                                onChange={(e) => this.setState({ updatedPostImgURL: e.target.files[0] })}
                                accept="image/*"
                            />
                        ) : (
                            this.isImageAvailable(this.props.object.postImgURL) && (
                                <img src={this.props.object.postImgURL} width="600px" alt="Post" />
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