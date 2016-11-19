import React, { Component } from 'react';

import logo from './logo.svg';
import './App.css';
import ToDo from './components/todo';


class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to To Do List!</h2>
        </div>
          <ToDo />
      </div> //calling ToDoData component and passing in url property of 'todo'
    );
  }
}





export default App;
