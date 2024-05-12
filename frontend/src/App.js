import './App.css';
import Layout from './Components/MainPage/Layout';
import Layout1 from './Components/Mealplans/Layout';
import Layout2 from './Components/Workoutplans/Layout';
import Layout3 from './Components/UserAllPosts/Layout';
import Layout4 from './Components/UserDetails/PostContainer/PostContainer';
import Layout5 from './Components/Workoutstatus/Layout';
import LoginHome from './Components/LoginHome/LoginHome';
import NavBar from './Components/NavBar/NavBar';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          
          <Route path="/" element={localStorage.getItem("user") == undefined ? <LoginHome /> : <span><NavBar /><Layout /></span>} />
          <Route path="/mealplans" element={<span><NavBar /><Layout1 /></span>} />
          <Route path="/workoutplans" element={<span><NavBar /><Layout2 /></span>} />
          <Route path="/UserAllPosts" element={<span><NavBar /><Layout3 /></span>} />
          <Route path="/UserDetails" element={<span><NavBar /><Layout4 /></span>} />
          <Route path="/workoutstatus" element={<span><NavBar /><Layout5 /></span>} />
          
          
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

