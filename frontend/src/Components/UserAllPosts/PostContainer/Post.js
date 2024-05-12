import React, { Component } from "react";
import "./PostContainer.css";
import { Avatar, Paper } from "@mui/material";
import like from "../../../images/like.png";
import likebutton from "../../../images/likebutton.png";
import share from "../../../images/share.png";
import comment from "../../../images/comment.png";
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

class Post extends Component {
    constructor(props) {
        super(props);
        this.state = {
            commentList: [],
            editMode: false,
            updatedDescription: this.props.object.description,
            updatedPostImgURL: null
        };
        this.handleDeletePost = this.handleDeletePost.bind(this);
        this.handleEditPost = this.handleEditPost.bind(this);
        this.handleUpdatePost = this.handleUpdatePost.bind(this);
    }

    componentDidMount() {
        this.getComments();
    }

    isImageAvailable = (data) => {
        return data === "" ? false : true;
    };

    handleDeletePost = () => {
        const { postId } = this.props.object;

        fetch(`http://localhost:8080/api/postService/delete/${postId}`, {
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
        const { postId } = this.props.object;
        const { updatedDescription } = this.state;

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
            postImgURL: updatedPostImgURL,
        };

        fetch(`http://localhost:8080/api/postService/update/${postId}`, {
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

    getComments = () => {
        fetch('http://localhost:8080/api/commentService/getAllComments/' + this.props.object.postId)
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
    };

    submitComments = (event) => {
        if (event.key === "Enter") {
            let comment = event.currentTarget.value;
            if (comment.trim() !== "") {

                let payload = {
                    "commentId": Math.floor(Math.random() * 1000000).toString(),
                    "userId": JSON.parse(localStorage.getItem("user")).userId,
                    "postId": this.props.object.postId,
                    "comment": comment,
                    "userName": JSON.parse(localStorage.getItem("user")).userName,
                    "userImage": JSON.parse(localStorage.getItem("user")).userImage,
                };

                const requestOptions = {
                    method: "POST",
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload),
                };

                fetch("http://localhost:8080/api/commentService/save", requestOptions)
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
    };

    render() {
        const { editMode, updatedDescription } = this.state;

        return (
            <div>
                <Paper className="post_container">
                    {/*header*/}
                    <div className="post_header">
                        <div className="post_header_main">
                            <div className="post_header_image">
                                <Avatar src={this.props.object.userImage} className="post_img" />
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

                    {/*description*/}
                    {editMode ? (
                        <textarea
                            value={updatedDescription}
                            onChange={(e) => this.setState({ updatedDescription: e.target.value })}
                            className="update_post_description"
                        />
                    ) : (
                        <div className="post_description">{this.props.object.description}</div>
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
                            <img className="post_img" src={like} alt="Like" />
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
