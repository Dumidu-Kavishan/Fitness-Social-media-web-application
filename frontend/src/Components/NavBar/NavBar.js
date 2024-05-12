import React, { Component } from 'react';
import "./NavBar.css"
import Grid from '@mui/material/Grid';
import logo from "../../images/logo.png";
import home from "../../images/Home.png";
import mealplan from "../../images/mealplan.png";
import workoutplan from "../../images/workoutplan.png";
import workoutstatus from "../../images/workoutstatus.png";
import { Avatar } from '@mui/material';
import { Link } from 'react-router-dom';
import { PiSignOutDuotone } from "react-icons/pi";





class NavBar extends Component {
    constructor(props) {
        super(props);
        this.state = { 
           
            userImage: '',
            userName : ''
         }
    }

    handleSignOut = () => {
        localStorage.removeItem('user');
        window.location.href = '/';
      };

    componentDidMount() {
        
        const userId = JSON.parse(localStorage.getItem("user")).userId;
        fetch(`http://localhost:8080/api/userService/getAllUsers/${userId}`)
          .then(response => response.json())
          .then(data => {
            
            this.setState({ userImage: data.userImage });
            this.setState({ userName : data.userName });
          })
          .catch(error => {
            console.error('Error fetching user image URL:', error);
          });
      }
    state = {  }
    render() { 
        return ( 
            <div>
               <Grid container className="navbar_main">
                <Grid item xs={3}>
                      <div className="navbar_leftbar">
                            <img class="navbar_logo" src={logo} width="55px"/>
                            <input className="navbar_search" type='text' placeholder='Search Healthhub'/>
                      </div>
                </Grid>
                <Grid item xs={6}>
                <div className='navbar_container'>
                        <div className='navbar_tabs'>
                        <Link to={'/'}>
                            <img src={home} height='35px' width='35px'/>
                        </Link>    
                        </div>
                       
                        <div className='navbar_tabs'>
                        <Link to={'/workoutplans'}>
                            <img src={workoutplan} height='35px' width='35px'/>
                        </Link>
                        </div>
                        
    
                        <div className='navbar_tabs'>
                            <Link to={'/workoutstatus'}>
                            <img src={workoutstatus} height='35px' width='35px'/>
                            </Link>
                        </div>
                       
                        <div className='navbar_tabs' >
                            <Link to={'/mealplans'}>
                                <img src={mealplan} height='35px' width='35px'/>
                            </Link>
                        </div>
                    </div>
                </Grid>
                <Grid item xs={3}>
                <div className='navbar_right'>
                        <div className='navbar_righttab'>
                            <Link to={'/UserAllPosts'}>
                            <Avatar className='navbar_rightimg' src={this.state.userImage}/>
                            </Link>
                            <Link to='/UserDetails'style={{ textDecoration: 'none' } }>
                            <div className='navbar_profilename'>{this.state.userName}</div>
                            </Link>

                            
                            <PiSignOutDuotone className="sign-out-btn" onClick={this.handleSignOut} />
                            
                            
                        </div>
                    </div>
                </Grid>
               </Grid>
            </div>
         );
    }
}
 
export default NavBar
;

