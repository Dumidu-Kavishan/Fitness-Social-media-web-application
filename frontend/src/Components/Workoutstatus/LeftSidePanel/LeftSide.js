import React, { Component } from "react";
import "./LeftSide.css";
import ImageLayout from "../ImageLayout";


class LeftSide extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
  }

  getData = () => {

    let jsondata = [
      {
            image: JSON.parse(localStorage.getItem("user")).userImage,
            text: JSON.parse(localStorage.getItem("user")).userName
      }, 
    
    ];
    this.setState({ data: jsondata });
  };

  componentDidMount() {
    this.getData();
  }

  render() {
    return (
      <div>
        {this.state.data.map((item, index) => (
          <ImageLayout key={index} image={item.image} text={item.text} />
        ))}
      </div>
    );
  }
}

export default LeftSide;
