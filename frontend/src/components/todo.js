import React, { Component } from 'react';
import axios from 'axios';

class ToDo extends Component {
  render () {
    return (
      <div className="App-intro">
        <ToDoData url='http://localhost:3000/tasks' pollInterval={5000}/>
      </div>
    );
  }
};

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
      setInterval(this.loadTodoTask.bind(this), this.props.pollInterval);
    }

    loadTodoTask() {
      axios.get(this.props.url)
        .then(function (response) {
          console.log('received response successfuly');
          console.log(response);
          this.setState({data: response.data.results, loaded: true});
        }.bind(this))  //bind so that "this" will refer to the component
        .catch(function (error) {
          console.log('failed to receive response');
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


    addTask(newTask) {
      console.log(this);
      this.setState({data: this.state.data.concat([newTask])})
    }


    render() {
      return (
        <div className="todoList">
          <ToDoList data={this.state.data} />
          <ToDoForm addTask={this.addTask.bind(this)}/>
        </div>
      )
    }
}


class ToDoList extends Component {
  render() {
    let taskList = this.props.data.map(function(todo) {  //map function returns an arraylist of html
      console.log(todo);
      return (
          <ToDoItem
            key={todo.id}
            id={todo.id}
            mytask={todo.task}
            myDueDate={todo.dueDate}
            completeness={todo.isComplete}/>
      );
    });
    return(
      <table>
        <tr>
          <th>Entry</th>
          <th>Task</th>
          <th>Do By</th>
          <th>Completion Status</th>
          <th>Actions</th>
        </tr>
        {taskList}
      </table>
    )
  }
}

class ToDoItem extends Component {  //TODO: turn this stuff into an HTML table
  render() {
    return (
      <tr>
        <td>{this.props.id}</td>
        <td>{this.props.mytask}</td>
        <td>{this.props.myDueDate} </td>
        <td>{this.props.completeness ? 'Done' : 'Incomplete'}</td>
        <td><button type="button" className="delete-button">Delete!</button></td>
      </tr>
    )
  }
}

/////////////////////////////////////////////

class ToDoForm extends Component {

  constructor(props) {
    super(props);  //default from library--always have to pass it in when you have constructor
    this.state = {  //the properties you want to update (setting initial state)
      task: "",
      date: ""
    }
  }

  handleChange(event) {
    let updateStateObj = {};
    let key = event.target.name;
    updateStateObj[key] = event.target.value;
    this.setState(updateStateObj); //input is the target
  }

  onSubmitHandler(event) {
    event.preventDefault();  //prevent default behaviour of page reloading after submit
    console.log(event);
    console.log(`This is currently ${this}`);

    console.log(`Task is: ${this.state.task}`);
    console.log(`Due Date is: ${this.state.dueDate}`);

    axios.post('http://localhost:3000/tasks', {
      task: this.state.task,
      dueDate: this.state.dueDate
    })
    .then(function (response) {
      console.log(response);
    })
    .catch(function (error) {
      console.log(error);
    });

    console.log(ToDoData);
    //this.props.addTask({task: this.state.task, dueDate: this.state.dueDate}).bind(this);

  }
  render() {
    console.log(this);

    return (
      <div className="inputForm">                        {/*TODO VALIDATE SUBMISSION */}
        <form onSubmit={this.onSubmitHandler.bind(this)}>  {/* "this" refers to the ToDoForm component object*/}
          <p>New Task: {this.state.task}</p>
          <input type="text" name="task" placeholder="Add a new task"
              value={this.state.task} onChange={this.handleChange.bind(this)}></input> {/* onChange calls handleChange, which immediately (char for char) updates "this.state.task" by using "event.target.value" */}
          <br/>
          <p>Due Date: {this.state.dueDate}</p>
          <input type="date" name="dueDate" value={this.state.dueDate} onChange={this.handleChange.bind(this)}></input>
          <br/>
          <input type="submit" value="Do This Eventually!"></input>
        </form>

      </div>
    );
  }
};
// ToDoForm.propTypes = {
//   addTask: React.PropTypes.func.isRequired
// };


export default ToDo;
