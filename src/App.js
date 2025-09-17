import React from "react";
import Projects from "./components/Projects";
import Employees from "./components/Employees";
import Assignments from "./components/Assignments";
import './App.css';

function App() {
  return (
    <div className="App">
      <h1>DEFECT TRACKER</h1>
      <Projects /><br></br><br></br>
      <Employees /><br></br>
      <Assignments />
    </div>
  );
}
export default App;