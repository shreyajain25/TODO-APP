import * as React from 'react';

import 'date-fns';
import DateFnsUtils from '@date-io/date-fns';
import {
  MuiPickersUtilsProvider,
  KeyboardTimePicker,
  KeyboardDatePicker,
} from '@material-ui/pickers';
import {Button, TextField, Checkbox, FormControlLabel} from '@material-ui/core';

const List: React.FC<{id: number, task, onUpdate, onDelete}> = (props) =>  {

    let [updatedTask, setUpdatedTask] = React.useState(props.task.taskName);
    let [edit, setToEdit] = React.useState(false);
    const [updatedDate, setUpdatedDate] = React.useState<Date | null>(props.task.taskDate);
    const [updatedTime, setUpdatedTime] = React.useState<Date | null>(props.task.taskTime);
    let [isCompleted, setisCompleted] = React.useState(props.task.done);

    const updateTask = () => {
        setToEdit(false);
        props.onUpdate(props.id, updatedTask, updatedDate, updatedTime, isCompleted);
    }

    const deleteTask =() => {
        props.onDelete(props.id);
    }

    const handleDateChange = (date: Date | null) => {
        setUpdatedDate(date);
    };

    const handleTimeChange = (date: Date | null) => {
        setUpdatedTime(date);
    };
    
    return (
        <div style={{marginLeft: "10px"}}>
            {props.task.taskName} --- {props.task.done ? "Completed": "Pending"}
            {
                edit ?
                <div>
                    <TextField  id="filled-basic" variant="filled" placeholder="Update Task" style = {{marginTop: "8px"}} onChange={e => setUpdatedTask(e.target.value)}></TextField>
                    <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardDatePicker
                        margin="normal" id="date-picker-dialog"
                        label="Date picker dialog" format="MM/dd/yyyy"
                        value={updatedDate} onChange={handleDateChange}
                        KeyboardButtonProps={{ 'aria-label': 'change date', }} />

                        <KeyboardTimePicker margin="normal" id="time-picker"
                        label="Time picker" value={updatedTime} onChange={handleTimeChange}
                        KeyboardButtonProps={{'aria-label': 'change time',}}
                        />
                    </MuiPickersUtilsProvider>
                    <FormControlLabel value="" control={<Checkbox color="primary" />} label=""
                        labelPlacement="start" onChange={e => {setisCompleted(!isCompleted)}}/>
                    <Button variant="contained" color="primary" onClick={updateTask}>Save Task</Button>
                </div>
                :
                <div>
                    <Button variant="contained" color="primary" onClick={() => {setToEdit(true)}}>Edit</Button>
                    <Button variant="contained" color="primary" onClick={deleteTask}>Delete</Button>
                </div>
            }
        </div>
    );
}

export default List;
