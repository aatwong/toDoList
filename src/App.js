import React, { Component } from 'react';
//var request = require('requests');
import axios from 'axios';
import logo from './logo.svg';
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h2>Welcome to To Do List!</h2>
        </div>
        <p className="App-intro">
          <ToDoData url='/todo' />
        </p>
      </div> //calling ToDoData component and passing in url property of 'todo'
    );
  }
}

class ToDoData extends Component {

    constructor(props) { //props are read only properties such as "url" above
      super(props);  //default from library--always have to pass it in when you have constructor
      this.state = {  //the properties you want to update (setting initial state)
        data:[],
        loaded: false
      }
    }

    componentDidMount() {  //once the page appears on screen
      this.loadTodoTask() //now calling the function
    }

    loadTodoTask() {
      axios.get(this.props.url)
        .then(function (response) {
          console.log(response);
          this.setState({data: response.data.foo, loaded: true});
        }.bind(this))  //bind so that "this" will refer to the component
        .catch(function (error) {
          console.log(error);
          this.setState({loaded: true});
        }.bind(this));
    }

      // $.ajax({  //HTTP request
      //   url: this.props.url, //equivalent (in this case) to '/todo'
      //   dataType: 'json',
      //   success: function(response) {  //200-299 status cyode = everything okay
      //     console.log(response);
      //     this.setState({data: response.foo, loaded: true})  //updating properties (data and loaded)
      //   }.bind(this),
      //   error: function(xhr, status, error) {
      //     console.error(this.props.url, status, error.toString());
      //     this.setState({loaded: true});
      //   }.bind(this) //bind so that error is part of the componenet
      // });


    render() {
      return (
        <div className="todoList">
          <table>
          <ToDoList data={this.state.data} />
          </table>
        </div>
      )
    }
}

class ToDoList extends Component {
  render() {
    let taskList = this.props.data.map(function(todo, index) {  //map function returns an arraylist of html
      return (
        <tr><ToDoItem key={index} id={index} name={todo} /></tr>
      );
    });
    return(
      <ul> {taskList} </ul>
    )
  }
}

class ToDoItem extends Component {
  render() {
    return (
      <li>{this.props.id}: {this.props.name} </li>
    )
  }
}

export default App;
