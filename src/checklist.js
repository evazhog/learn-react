import React, { useState }from 'react';
import './index.css';

let styles = {}
function Check(props) {
  return (
    <div style={{display:'flex'}}>
      <input type="checkbox" onChange={() => {props.whenChecked()}}/>
      <div className={"checkbox-text"}>{props.text}</div>
    </div>
  )
}

export function CheckList() {
  const [inputText, setInputText] = useState('');
  const [toDos, setToDos] = useState({});
  
  // When a To Do item is checked, remove it
  const whenChecked = (key) => {
    let t = Object.assign({}, toDos);
    delete t[key];
    setToDos(t);
  }

  // Render-ing functions
  const renderCheck = (props) => {
    return (
      <Check key={props.key} text={props.text} whenChecked={props.whenChecked}/>
    )
  }

  const renderToDos = () => {
    let toDoComponents = []
    for (let key in toDos){
      const text = toDos[key]
      toDoComponents.push(renderCheck(
        {
          key: key,
          text: text,
          whenChecked: () => { whenChecked(key) },
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
    t[currentMax + 1] = inputText;
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