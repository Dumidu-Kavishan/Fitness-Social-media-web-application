import React, { Component } from 'react';
import "./LoginHome.css";
import { Grid } from '@mui/material';
import {Paper} from '@mui/material';
import logo from "../../images/logo.png";
import firebase from '../../firebase';




class LoginHome extends Component {
    constructor(props) {
        super(props);
    
    this.state = { 
            signIN : true,

            //signin
            signin_email : null,
            signin_password : null,
            //signup
            signup_name : null,
            signup_email : null,
            signup_password : null
        };
        
    }
    switchPanel =() => {
        if(this.state.signIN)
            this.setState({signIN:false});
        else
            this.setState({signIN:true});
        
    }

    
    
    signUP=()=>{
        
       firebase.auth().createUserWithEmailAndPassword(this.state.signup_email, this.state.signup_password)
        .then((userCredential) => {
            
            var user = userCredential.user;

            let payload = {

                "userId" : user.uid,
                "userName" : this.state.signup_name,
                "userImage" : "https://gmfp.wapda.gov.pk/images/pngwing.com.png"
                
            }

            const requestOptions = {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            };

            fetch('http://localhost:8080/api/userService/save', requestOptions)
            .then(response => response.json())
            .then(data =>{
               
                localStorage.setItem("user",JSON.stringify(data));
                window.location.reload();
            })
            .catch(error =>{
                
            })
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            console.error('Sign up error:', errorCode, errorMessage);
            this.setState({ signUpError: errorMessage });
            
        });
    }
    signInMethod = () => {

        firebase.auth().signInWithEmailAndPassword(this.state.signin_email, this.state.signin_password)
        .then((userCredential) => {

            var user = userCredential.user;
            fetch('http://localhost:8080/api/userService/getAllUsers/'+user.uid)
            .then(response => response.json())
            .then(data =>{
               
                localStorage.setItem("user",JSON.stringify(data));
                window.location.reload();
            })
            .catch(error =>{
                
            })
            
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
        })
    }
    render() { 
        return ( 
            <Grid className="main_container">
                <Grid className="main_content" container>
                    <Grid item xs={7}>
                        <div className="logo">
                            <img src={logo} width="300px"/>
                        </div>
                        {/* <div>
                            <h1 className="text">HealthHub helps you connect and share with the people in your life</h1> 
                        </div> */}
                    </Grid>
                    <Grid item xs={3}>
                        <Paper className="logincard_container">
                         {
                            this.state.signIN == true ?

                            <div container = "login_panel" className='login_panel'>
                                <div>
                                    <input onChange={(event)=>{this.state.signin_email=event.currentTarget.value}} type="email" className="login_input" placeholder="Email address" />
                                </div>
                                <div>
                                    <input onChange={(event)=>{this.state.signin_password=event.currentTarget.value}} type="password" className="login_input" placeholder="Password" />
                                </div>
                                <div>
                                    <button onClick={this.signInMethod} className="login_button">Log In</button>
                                </div>
                                <div>
                                    <div className="forgot_Text">Forgot Password?</div>
                                </div>
                                <div>
                                    <div className="divider"></div>
                                </div>
                                <div>
                                    <button className="login_createnew" onClick={this.switchPanel}>Create New Account</button>
                                </div>
                            </div>
                            :
                            <div container = "login_panel">
                                <div>
                                    <input onChange={(event)=>{this.state.signup_name=event.currentTarget.value}} type="text" className="login_input" placeholder="Name"/>
                                </div>
                                <div>
                                    <input onChange={(event)=>{this.state.signup_email=event.currentTarget.value}} type="text" className="login_input" placeholder="Email address"/>
                                </div>
                                <div>
                                    <input onChange={(event)=>{this.state.signup_password=event.currentTarget.value}} type="password" className="login_input" placeholder="Password"/>
                                </div>
                               <div className='fgt-btn'>
                                    <div>
                                        <button onClick={this.signUP}  className="login_button">Sign Up</button>
                                    </div>
                                    <div>
                                        <div onClick={this.switchPanel} className="forgot_Text">Already have an account?</div>
                                    </div>
                               </div>
                            </div>
                         }   
                        </Paper>   
                    </Grid>
                    <Grid item xs={1}></Grid>

                </Grid>
            </Grid>

            
        );
    }
}
 
export default LoginHome;