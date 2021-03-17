/* eslint-disable no-use-before-define */
import * as React from 'react';
import useAutocomplete from "@material-ui/lab/useAutocomplete";
import CheckIcon from "@material-ui/icons/Check";
import CloseIcon from "@material-ui/icons/Close";
import styled from "styled-components";
import Chip from "@material-ui/core/Chip";
import {Button} from "@material-ui/core";

const InputWrapper = styled("div")`
  width: 40%;
  border: 1px solid #d9d9d9;
  background-color: #fff;
  border-radius: 4px;
  padding: 1px;
  display: flex;
  flex-wrap: wrap;

  &:hover {
    border-color: #40a9ff;
  }

  &.focused {
    border-color: #40a9ff;
    box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2);
  }

  & input {
    font-size: 14px;
    height: 30px;
    box-sizing: border-box;
    padding: 4px 6px;
    width: 0;
    min-width: 30px;
    flex-grow: 1;
    border: 0;
    margin: 0;
  }
`;

const Tag = styled(({ label, deleteHandler, onDelete, ...props }) => (
  <div {...props}>
    <Chip size="small" label={label} color="secondary"></Chip>
    <CloseIcon onClick={deleteHandler} />
  </div>
))`
  display: flex;
  align-items: center;
  height: 24px;
  margin: 2px;
  line-height: 22px;
  border-radius: 2px;
  box-sizing: content-box;
  padding: 0 4px 0 10px;
  outline: 0;
  overflow: hidden;

  & svg {
    font-size: 12px;
    cursor: pointer;
    padding: 4px;
  }
`;

const Listbox = styled("ul")`
  width: 300px;
  margin: 2px 0 0;
  padding: 0;
  position: absolute;
  list-style: none;
  background-color: #fff;
  overflow: auto;
  max-height: 250px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  z-index: 1;

  & li {
    padding: 5px 12px;
    display: flex;

    & span {
      flex-grow: 1;
    }

    & svg {
      color: transparent;
    }
  }

  & li[aria-selected="true"] {
    background-color: #fafafa;
    font-weight: 600;

    & svg {
      color: #1890ff;
    }
  }

  & li[data-focus="true"] {
    background-color: #e6f7ff;
    cursor: pointer;

    & svg {
      color: #000;
    }
  }
`;

const Tags: React.FC<{todoTag: object[], id: number, todoTagSpec: object[], addTagHandler, deleteTagHandler, updateTagHandler}> = (props) =>  {

  const todoTags = props.todoTag.map((val) => {return {title: val["title"]}});
  const todoTagSpec = props.todoTagSpec;
  let [inputTag, setInputTag] = React.useState("");

  const getInputValue =(event) => {
    setInputTag(event.target.value);
  }
  const saveNewTag = (event) => {
    event.preventDefault();
    props.addTagHandler(inputTag, props.id);
  }

  const updateTagHandler = (title: string) => {
    props.updateTagHandler(title, props.id);
  }

  const deleteHandler =(index: number, taskId: number, id:number) => {
    todoTagSpec.splice(index, 1);
    props.deleteTagHandler(taskId, id);
  }
  
  const {
    getRootProps,
    getInputProps,
    getTagProps,
    getListboxProps,
    getOptionProps,
    groupedOptions,
    value,
    focused,
    setAnchorEl
  } = useAutocomplete({
    multiple: true,
    options: todoTags,
    getOptionLabel: (option) => option["title"],
  });

  return (
      <div style={{marginLeft: "10px"}}>
        <div {...getRootProps()}>
          <InputWrapper ref={setAnchorEl} onChange={getInputValue} className={focused ? "focused" : ""}>
            {value.map((option: TodoOptions, index: number) => (
              <Tag label={option.title} {...getTagProps({ index }) } />
            ))}
            {todoTagSpec.map((option, index: number) => (
              (option["taskId"] == props.id && option["visible"]) ? 
              <Tag label={option["title"]} deleteHandler={() => deleteHandler(index, option["taskId"], option["id"])} {...getTagProps({ index })} />:
              null
            ))}
            <input {...getInputProps()}/>
            <Button onClick={saveNewTag} disabled={inputTag.length === 0}>Add Tag</Button>
          </InputWrapper>
        </div>
        {groupedOptions.length > 0 ? (
          <Listbox {...getListboxProps()}>
            {groupedOptions.map((option, index) => (
              <li {...getOptionProps({ option, index })} onClick={() => updateTagHandler(option.title)} >
                <span>{option.title}</span>
                <CheckIcon fontSize="small" />
              </li>
            ))}
          </Listbox>
        ) : null}
      </div>
  );
}
// 

interface TodoOptions {
  title: string;
}

export default Tags;