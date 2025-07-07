import "./App.css";
import Home from "./components/Home";
import About from "./components/About";
import Navbar from "./components/Navbar";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NoteState from "./context/notes/NoteState";
import Alert from "./components/Alert";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { useState } from "react";
import KanbanBoard from "./components/KanbanBoard";
import ActivityLog from "./components/ActivityLog";
function App() {
  // eslint-disable-next-line
  const [alert,setAlert] = useState(null);
  const showAlert = (message,type) =>{
    setAlert({
      msg : message,
      type: type
    });
    setTimeout(() => {
      setAlert(null);
    }, 3000);
  }
  return (
    <div className="">
      <NoteState>
        <Router>
          <Navbar/>
          <Alert alert={alert}/>
            <div className="container">
            <Routes>
              <Route exact path="/" element={<Home showAlert={showAlert} />}></Route>
              <Route exact path="/about" element={<About />}></Route>
              <Route path="/kanban" element={<KanbanBoard />} />
              <Route exact path="/login" element={<Login showAlert={showAlert} />}></Route>
              <Route exact path="/signup" element={<Signup showAlert={showAlert} />}></Route>
              <Route exact path="/activity-log" element={<ActivityLog />} />
            </Routes>
            </div>
        </Router>
      </NoteState>
    </div>
  );
}

export default App;
