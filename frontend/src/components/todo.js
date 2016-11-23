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
          // console.log('received response successfuly');
          // console.log(response);
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
      //console.log(todo);
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
        <tbody>
          <tr>
            <th>Entry</th>
            <th>Task</th>
            <th>Do By</th>
            <th>Completion Status</th>
            <th>Actions</th>
          </tr>
          {taskList}
        </tbody>
      </table>
    )
  }
}

class ToDoItem extends Component {

  constructor(props) {
    super(props);
    this.handleComplete = this.handleComplete.bind(this);
    this.state = {
      isEditable : false,
      task : this.props.mytask,
      isComplete: this.props.completeness,
      dueDate : this.props.myDueDate
    };
  }

  handleComplete(event) {
    //console.log(event.target.value);
    let isComplete = !this.state.isComplete;
    this.setState({isComplete : isComplete});
    axios.request({
      method: 'put',
      url: `http://localhost:3000/tasks/complete/${this.props.id}`,
      data : {
        isComplete : isComplete
      }
    })
  }

  onClickEdit(event) {
    this.setState({isEditable : !this.state.isEditable});
  }

  handleChange(event) {
    let updateStateObj = {};
    let key = event.target.name;
    updateStateObj[key] = event.target.value;
    this.setState(updateStateObj); //input is the target
  }

  onSaveEdit(event) {
    axios.request({
      method: 'put',
      url: `http://localhost:3000/tasks/${this.props.id}`,
      data : {
        task : this.state.task,
        dueDate : this.state.dueDate
      }
    }).then(function(response) {
      this.setState({isEditable : false});
    }.bind(this))
  }


  render() {

    let editDisplayTask = this.state.isEditable ? <td><input type="text" name="task" value={this.state.task} onChange={this.handleChange.bind(this)} /></td>
                            : <td>{this.props.mytask}</td>
    let editDisplayDueDate = this.state.isEditable ? <td><input type="datetime" name="dueDate" value={this.state.dueDate} onChange={this.handleChange.bind(this)} /></td>
                            : <td>{this.props.myDueDate}</td>

    let editDisplayDelete = this.state.isEditable ? <td><input type="button" className="edit-button" value="Save" onClick={this.onSaveEdit.bind(this)} /><input type="button" value="Cancel" onClick={this.onClickEdit.bind(this)}/></td>
    : <td><input type="button" className="edit-button" value="Edit" onClick={this.onClickEdit.bind(this)}/><DeleteEntry taskToDelete={this.props.id} /></td>


    return (
      <tr>
        <td>{this.props.id}</td>
        {editDisplayTask}
        {editDisplayDueDate}
        <td>
          <input type="checkbox" onChange={this.handleComplete.bind(this)} />
        </td>
        {editDisplayDelete}
      </tr>

    )
  }
}

// class ToDoItem extends Component {  //TODO: turn this stuff into an HTML table
//
//   constructor(props) {
//     super(props);
//     this.state = {
//       isEditable : false
//     };
//   }
//
//   display() {
//     var displayType;
//     if (this.state.isEditable == true) {
//       displayType = <EditableItem
//                         id={this.props.id}
//                         mytask={this.props.mytask}
//                         myduedate={this.props.myDueDate}
//                         completeness={this.props.completeness}/>;
//     } else {
//       displayType =
//         <tr>
//           <td>{this.props.id}</td>
//           <td>{this.props.mytask}</td>
//           <td>{this.props.myDueDate} </td>
//           <td>{this.props.completeness ? 'Done' : 'Incomplete'}</td>
//           <td><DeleteEntry taskToDelete={this.props.id}/></td>
//         </tr>;
//     }
//     return displayType;
//   }
//
//
//   render() {
//     return (
//       <div>{display()}<div>
//     )
//   }
// }
//
// class EditableItem extends Component {
//   render() {
//     return (
//       <tr>
//         <td>{this.props.id}</td>
//         <td>{this.props.mytask}</td>
//         <td>{this.props.myduedate} </td>
//         <td>{this.props.completeness ? 'Done' : 'Incomplete'}</td>
//         <td><DeleteEntry taskToDelete={this.props.id}/></td>
//       </tr>;
//     )
//   }
// }


/////////////////////////////////////////////
// DELETE BUTTONS TODO: make the field disappear immediately on click

//parent component
class DeleteEntry extends Component {

  constructor(props) { //i tried setting state and then calling it later but that didnt work out   getinitialstate
    super(props);
    this.state = {
      taskId : 0
    }
  }

  render() {
    return(
      <DeleteButton whenClicked={this.deleteRequest.bind(this)} />

    )
  }
  //var deleteId = {this.props.taskToDelete};
  deleteRequest() {
    console.log(`Deleting task number ${this.props.taskToDelete}`);
    axios.request({
      method: 'delete',
      url: `http://localhost:3000/tasks/${this.props.taskToDelete}`
    })
  }
}

//child component
class DeleteButton extends Component {
  render() {
    return (
      <input type="button" onClick={this.props.whenClicked} className="delete-button" value="Delete" />
    )
  }
}


/////////////////////////////////////////////
//FORM

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
    //console.log(this);

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
