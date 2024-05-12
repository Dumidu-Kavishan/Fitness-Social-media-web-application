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
            //add comment thing
            commentList:[],
            editMode: false,
            updatedtopic : this.props.object.topic,
            updatedDescription: this.props.object.description,
            updatedworkouttime : this.props.object.workouttime,
            updatedworkouttype : this.props.object.workouttype,
            updatedburncalories : this.props.object.burncalories,
            updatedworkoutstatusImgURL: null
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
        const { statusId } = this.props.object;
       
      
        
        fetch(`http://localhost:8080/api/workoutService/delete/${statusId}`, {
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

        const { statusId } = this.props.object;
        const {updatedtopic} = this.state;
        const { updatedDescription } = this.state;
        const{updatedworkouttime} = this.state;
        const{updatedworkouttype} = this.state;
        const{updatedburncalories} = this.state;
      

        let updatedworkoutstatusImgURL = '';
        if (this.state.updatedworkoutstatusImgURL) {
            try {
                updatedworkoutstatusImgURL = await uploadImageToFirebase(this.state.updatedworkoutstatusImgURL);
            } catch (error) {
                console.error('Error uploading image:', error);
                return;
            }
        } else {
            updatedworkoutstatusImgURL = this.props.object.workoutstatusImgURL;
        }

        const payload = {
            topic : updatedtopic,
            description: updatedDescription,
            workouttime:updatedworkouttime,
            workouttype:updatedworkouttype,
            burncalories:updatedburncalories,
            workoutstatusImgURL: updatedworkoutstatusImgURL,
        };

        fetch(`http://localhost:8080/api/workoutService/update/${statusId}`, {
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
        fetch('http://localhost:8080/api/workoutstatuscommentService/getAllComments/' + this.props.object.statusId)
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
                    "statusId": this.props.object.statusId,
                    "comment": comment,
                    "userName":JSON.parse(localStorage.getItem("user")).userName,
                    "userImage" :JSON.parse(localStorage.getItem("user")).userImage,
                }

                const requestOptions = {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                }

                fetch("http://localhost:8080/api/workoutstatuscommentService/save", requestOptions)
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

        const { editMode, updatedtopic ,updatedDescription ,updatedworkouttime ,updatedworkouttype ,updatedburncalories  } = this.state;

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
                
                    {/* topic */}
                    {editMode ? (
                    <div className="post_topic_edit_mode">
                        <input
                        value={updatedtopic}
                        onChange={(e) => this.setState({ updatedtopic: e.target.value })}
                        className="post_topic_input"
                        />
                    </div>
                    ) :(
                        <div className="post_topic">
                        <div className="post_head_topic">{this.props.object.topic}</div>
                   </div>
                    ) }

                    {/* burncalories */}
                    {editMode ? (
                    <div className="post_burncalories_edit_mode">
                        <input
                        value={updatedburncalories}
                        onChange={(e) => this.setState({ updatedburncalories: e.target.value })}
                        className="post_burncalories_input"
                        />
                    </div>
                    ) : (
                        <div className="post_burncalories">
                        <div className="post_content">Burn Calories: {this.props.object.burncalories} Calories </div>
                    </div>
                    ) }

                    {/* workouttime */}
                    {editMode ? (
                    <div className="post_workouttime_edit_mode">
                        <input
                        value={updatedworkouttime}
                        onChange={(e) => this.setState({ updatedworkouttime: e.target.value })}
                        className="post_workouttime_input"
                        />
                    </div>
                    ) :  (
                        <div className="post_workouttime">
                        <div className="post_content">Workout Time: {this.props.object.workouttime} Minutes </div>
                    </div>
                    )}


                {/* workouttype */}
                {editMode ? (
                    <select
                        value={updatedworkouttype}
                        onChange={(e) => this.setState({ updatedworkouttype: e.target.value })}
                        className="upload_workouttype_input"
                    >
                                <option className="upload_workouttype" value="">Select Workout Type</option>
                                <option className="upload_workouttype" value="Cardio">Cardio</option>
                                <option className="upload_workouttype" value="Yoga">Vegan</option>
                                <option className="upload_workouttype" value="Cycling">Cycling</option>
                                <option className="upload_workouttype" value="Swimming">Swimming</option>
                                <option className="upload_workouttype" value="HIIT">HIIT</option>
                    </select>
                ) : (
                    this.props.object.workouttype && (
                        <div className="post_workouttype">
                        <div className="post_content">workout Type: {this.props.object.workouttype}</div>
                    </div>
                    )
                )}

                {/* Description */}
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
                    className="workoutstatus_description"
                    value={this.props.object.description}
                    readOnly
                    />
                )}
                {/*image*/}
                <div className="post_image">
                        {editMode ? (
                            <input className="update-post-img"
                                type="file"
                                onChange={(e) => this.setState({ updatedworkoutstatusImgURL: e.target.files[0] })}
                                accept="image/*"
                            />
                        ) : (
                            this.isImageAvailable(this.props.object.workoutstatusImgURL) && (
                                <img src={this.props.object.workoutstatusImgURL} width="600px" alt="Post" />
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
