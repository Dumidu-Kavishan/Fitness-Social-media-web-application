import React,{Component} from "react";
import "./PostContainer.css";
import { Avatar, Paper } from "@mui/material";
import like from "../../../images/like.png"
import likebutton from "../../../images/likebutton.png"
import share from "../../../images/share.png"
import comment from "../../../images/comment.png"





class  Post extends Component {
    constructor(props) {
        super(props);
        this.state = { 
            //add comment thing
            commentList:[]
            //end
         }
    }

    //add comment thing
    componentDidMount(){
        this.getComments();
    }
    //end

    isImageAvailable=(data)=>{
        return data==""?false:true;
    }

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
        return (<div>
            <Paper className="post_container">
                {/*header*/}
                <div className="post_header">
                    <div className="post_header_image">
                        <Avatar src={this.props.object.userImage} className="post_img"/>
                    </div>
                    <div className="post_header_text">
                        {this.props.object.userName}
                    </div>
                </div>
                
                {/* topic */}
                {this.props.object.topic !== null ? (
                    <div className="post_topic">
                         <div className="post_head_topic">{this.props.object.topic}</div>
                    </div>
                ) : null}

                {/* burncalories */}
                {this.props.object.burncalories !== null ? (
                    <div className="post_burncalories">
                        <div className="post_content">Burn Calories: {this.props.object.burncalories} Calories </div>
                    </div>
                ) : null}

                {/* workouttime */}
                {this.props.object.workouttime !== null ? (
                    <div className="post_workouttime">
                        <div className="post_content">Workout Time: {this.props.object.workouttime} Minutes </div>
                    </div>
                ) : null}

                {/* workouttype */}
                {this.props.object.workouttype !== null ? (
                    <div className="post_workouttype">
                        <div className="post_content">workout Type: {this.props.object.workouttype}</div>
                    </div>
                ) : null}

                {/* Description */}
                {this.props.object.description && (
                    <textarea
                    className="workoutstatus_description"
                    value={this.props.object.description}
                    readOnly
                />
                )}   
                
                {/*image*/}
                <div className="post_image">
                    {
                        this.isImageAvailable(this.props.object.workoutstatusImgURL) ? <img src={this.props.object.workoutstatusImgURL} width="600px"/>:<span></span>
                    }
                    
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
