import React, { useState }from 'react';
import './index.css';

let styles = {}
function Check(props) {
  return (
    <div style={{display:'flex'}}>
      <input type="checkbox" onChange={() => {props.whenChecked()}} disabled={false /*props.isChecked use this is we don't want toggle ability*/}/>
      <div className={"checkbox-text"} style={props.isChecked ? {textDecoration: "line-through",} : null}>{props.text}</div>
      {
        props.isChecked && <input type={"submit"} onClick={()=>{props.deleteComponent()}} value={'Delete'} className={"delete"}/>
      }
    </div>
  );
}

export function CheckList() {
  const [inputText, setInputText] = useState('');
  const [toDos, setToDos] = useState({});
  
  // When a To Do item is checked, toggle strike out
  const whenChecked = (key) => {
    let t = Object.assign({}, toDos);
    let oldFlag = t[key].isChecked;
    t[key].isChecked = !oldFlag; //in order to toggle
    setToDos(t);
  }

  //This deletes the component
  const deleteComponent = (key) => {
    let t = Object.assign({}, toDos);
    delete t[key];
    setToDos(t);
  }

  // Render-ing functions
  const renderCheck = (props) => {
    return (
      <Check key={props.key} text={props.text} whenChecked={props.whenChecked} isChecked={props.isChecked} deleteComponent={props.deleteComponent} />
    )
  }

  const renderToDos = () => {
    let toDoComponents = []
    for (let key in toDos){
      const toDo = toDos[key]
      toDoComponents.push(renderCheck(
        {
          key: key,
          text: toDo.inputText,
          whenChecked: () => { whenChecked(key) },
          isChecked: toDo.isChecked,
          deleteComponent: () => {deleteComponent(key)},
        }
      ))
    }
    return toDoComponents;
  }

  // To Do item Form functions
  const onSubmit = () => {
    if (!inputText) return;
    let t = Object.assign({}, toDos);
    const currentMax = Math.max(Object.keys(t).length); // Too lazy to generate real hashes for this so we're just using numbers
    t[currentMax + 1] = {
      inputText: inputText,
      isChecked: false,
    };
    setToDos(t);
  }
  const onTextChange = (event) => {
    setInputText(event.target.value);
  }

  return (
    <div style={styles}>
      <div>
        <input type="text" onChange={onTextChange} value={inputText} placeholder={'Enter To-Do item'}/>
        <div>
          <input type="submit" onClick={onSubmit} value={'Add!'}/>
        </div>
      </div>
      <div id="to-do-wrapper">
        {renderToDos()}
      </div>
    </div>
  );
}

styles = {
  margin: 'auto',
  width: '50vw',
  textAlign: 'center',
}