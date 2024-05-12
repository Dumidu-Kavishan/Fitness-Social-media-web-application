import React,{Component} from "react";
import Status from "./Status";
import "./StatusBar.css";



class StatusBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data : []
        }
    }
    

    getData = () => {
        fetch("http://localhost:8080/api/statusService/getAllStatus")
       .then(response => response.json())
       .then(json =>{
            this.setState({data: json});
       })
      
       .catch(error => {
         console.error("Error fetching Status:", error);
       })
       //console print
       console.log(this.state.data);
     };

     componentDidMount() {
       this.getData();
     }

    render() { 
        return ( <div className="statusbar_container">
           <Status uploader="true"/>
           {
                this.state.data.map((item) => (
                    <Status object = {item} />
                ))
           }
          
            
        </div> );
    }
}
 
export default StatusBar;