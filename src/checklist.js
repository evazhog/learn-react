import React, { useState }from 'react';
import './index.css';

let styles = {}
function Check(props) {
  return (
    <div style={{display:'flex', marginTop: '5px',}}>
      <input type="checkbox" onChange={() => {props.whenChecked()}} disabled={false /*props.isChecked use this is we don't want toggle ability*/}/>
      <div className={"checkbox-text"} style={props.isChecked ? {textDecoration: "line-through", opacity: 0.2,} : null}>{props.text}</div>
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
    let keys = Object.keys(t);
    keys = keys.map((key) => { //For good measure, sanitize all as ints
      return parseInt(key)
    }).sort((a,b) => { //Running a sort on this is probably a bit overkill. Pretty sure Object.keys() preserves order
      return a - b;
    });
    console.log(keys)
    let currentMax = parseInt(keys[keys.length - 1]) || 0; //The issue with previous code was we were measuring by array length, so if the last element == length then there's an issue when we try to insert a duplicate key. last element == length happens when you delete on of the todos in the middle of the array
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