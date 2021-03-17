import * as React from 'react';
import 'date-fns';
import {useHistory} from "react-router-dom"
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker} from '@material-ui/pickers';
import {Button, TextField, Checkbox, FormControlLabel} from '@material-ui/core';
import List from './List';
import './index.css';
import Tags from './Tags';
import { isAwaitExpression } from 'typescript';

const Todo: React.FC = () =>  {
  const history = useHistory();
  let [tasks, setTasks] = React.useState<object[]>([]);
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(new Date(),);
  const [selectedTime, setSelectedTime] = React.useState<Date | null>(new Date(),);
  let [name, setName] = React.useState<string | "">("");
  let [isCompleted, setisCompleted] = React.useState(false);
  const [todoTag, setTodoTag] = React.useState<object[]>([]);
  const [todoTagSpec, setTodoTagSpec] = React.useState<object[]>([]);

  React.useEffect(() => {
    const fetchTodos = async() => {
      const response = await fetch('http://localhost:9000/getTodos', 
      {
        credentials: 'include',
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'authorization': `${localStorage.getItem('token')}` }
      })
      const data = await response.json();
      setTasks(data[0].todos);
    }
    fetchTodos();

    const fetchAllTagNames = async() => {
      const res = await fetch(`http://localhost:9000/getAllTags`, {
        credentials: 'include',
        method: 'GET',
        headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` }
      })
      const data = await res.json();
      setTodoTag(data)
    }
    fetchAllTagNames();

  }, [tasks])

  // const fetchSpecificTags = async(id: number) => {
  //   const res = await fetch(`http://localhost:9000/getTags/${id}`, {
  //     credentials: 'include',
  //     method: 'GET',
  //     headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` }
  //   })
  //   const data = await res.json();
  //   if(data[0] && data[0].TaskTags){
  //     console.log("----",data[0].TaskTags)
  //     setTodoTagSpec(data[0].TaskTags)
  //   }
  // }

  const addTask = async(event) => {
    event.preventDefault();

    const newTask = {
        taskName: name,
        taskDate: selectedDate,
        taskTime: selectedTime,
        done: isCompleted,
        id: localStorage.getItem("id")
    }
    tasks.push(newTask);
    setTasks([...tasks]);

    await fetch('http://localhost:9000/createTodo', 
    {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
      body: JSON.stringify({tasks: newTask})
    })
  }

  const handleDateChange = (date: Date | null) => {
    setSelectedDate(date);
  };

  const handleTimeChange = (date: Date | null) => {
    setSelectedTime(date);
  };

  const updateHandler = async(idx: number, taskName: string, taskDate: Date, taskTime: Date, completed: boolean) => {
    if(tasks[idx]){
      const newTask = {
        taskName: taskName,
        taskDate: taskDate,
        taskTime: taskTime,
        done: completed,
        id: tasks[idx]["id"],
        userId: localStorage.getItem("id")
      }
      tasks[idx] = newTask;
      setTasks([...tasks]);

      const response = await fetch(`http://localhost:9000/updateTodo`, 
      {
        credentials: 'include',
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}`},
        body: JSON.stringify({tasks: newTask})
      })

      const data = response.json();
      console.log(data)
    }
  }

  const deleteHandler = async(index: number) => {
    const id = tasks[index]["id"];
    tasks.splice(index, 1);
    setTasks([...tasks]);

    await fetch(`http://localhost:9000/todo/${id}`, 
    {
      credentials: 'include',
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}`},
    })
  }

  const addTagHandler = async(title: string, id: number) => {
    const response = await fetch('http://localhost:9000/createTag', 
    {
      credentials: 'include',
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
      body: JSON.stringify({title: title, id: id, userId: localStorage.getItem("id")})
    })

    const data = await response.json();
    console.log("--",data)
    todoTag.push(data)
    setTodoTag([...todoTag])
  }

  const updateTagHandler = async(title: string, id: number) => {
    const response = await fetch('http://localhost:9000/updateTag', 
    {
      credentials: 'include',
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}` },
      body: JSON.stringify({visible:true, title: title, id: id, userId: localStorage.getItem("id")})
    })

    const data = await response.json();
    todoTag.push(data)
    setTodoTag([...todoTag])
    // console.log("drop down tag",todoTag)
  }

  const deleteTagHandler = async(taskId: number, id: number) => {
    const response = await fetch(`http://localhost:9000/deleteTag`, 
    {
      credentials: 'include',
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'Authorization': `${localStorage.getItem('token')}`},
      body: JSON.stringify({taskId: taskId, id: id, visible: false})
    })
    const data = await response.json();
  }

  const logOutHandler = ()=>{
    localStorage.removeItem("token");
    history.push("/");
  }

  return (
    <div>
      <div>
        {/* <p><b>TO DO</b></p> */}
        <Button style={{ position:"relative" , float:"right"}} onClick={logOutHandler} >Logout</Button>
      </div>
      <div style = {{margin: "3px"}}>
        <TextField id="filled-basic" variant="filled" placeholder="Enter Task" style = {{marginTop: "8px"}} value={name} onChange={(e) => setName(e.target.value)}>
        </TextField>
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <KeyboardDatePicker margin="normal" id="date-picker-dialog"
            label="Date picker dialog" format="MM/dd/yyyy" value={selectedDate}
            onChange={handleDateChange} KeyboardButtonProps={{'aria-label': 'change date',}}/>
          <KeyboardTimePicker margin="normal" id="time-picker" label="Time picker" value={selectedTime}
            onChange={handleTimeChange} KeyboardButtonProps={{'aria-label': 'change time',}}/>
        </MuiPickersUtilsProvider>
        <FormControlLabel value="" control={<Checkbox color="primary" />} label=""
            labelPlacement="start" onChange={e => {setisCompleted(!isCompleted)}}/> 
        <Button variant="contained" color="primary" onClick={addTask} disabled={name.length===0}>Add Task</Button>
      </div>
      <br/>
      {/* <h1 style={{textAlign: "center", color: "blue"}}>Tasks To Do</h1> */}
      {tasks.map((task: object, id: number) => {
        return <>
          <br/>
          <Tags todoTag={todoTag} id={task["id"]} 
              todoTagSpec={todoTag.filter((tag) => tag["taskId"] === task["id"])} 
              addTagHandler={addTagHandler}
              deleteTagHandler={deleteTagHandler}
              updateTagHandler={updateTagHandler}
              />
          <List key={`${id}_${task}`} id={id} task={task} onUpdate={updateHandler} onDelete={deleteHandler}></List>
        </>
      })}
    </div>
  );
}

export default Todo;
