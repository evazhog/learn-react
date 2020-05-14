import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
      id={props.id}
      style={{"cursor":"pointer"}}
    >
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        id={i}
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="status">{status}</div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null)
      }],
      xIsNext: true,
      stepNumber: 0,
      xNumRice: 0,
      oNumRice: 0,
      from: -1,
    };
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if (calculateWinner(squares)) return; //Do nothing if there's already a winner

    const xExecutingTurn = this.state.xIsNext;
    const numRice = xExecutingTurn ? this.state.xNumRice : this.state.oNumRice;

    if (numRice < 3) {
      if (squares[i]) return; //We can't insert a new rice in an already occupied square
      squares[i] = xExecutingTurn ? 'X' : '0';
      this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        xIsNext: !this.state.xIsNext,
        stepNumber: history.length,
        xNumRice: xExecutingTurn ? this.state.xNumRice + 1 : this.state.xNumRice,
        oNumRice: !xExecutingTurn ? this.state.oNumRice + 1 : this.state.oNumRice,
      });
    }
    else {
      const me = xExecutingTurn ? "X" : "0"
      const iOccupyCenter = squares[4] === me
      const adjSquareIndices = [[1, 4, 3], [0, 2, 3, 4, 5], [1, 4, 5], [0, 1, 4, 6, 7], [0, 1, 2, 3, 5, 6, 7, 8], [2, 1, 4, 7, 8], [3, 4, 7], [6, 3, 4, 5, 8], [7, 4, 5]];

      if (this.state.from === -1) {
        console.log("Selecting FROM: ", i)

        // if attempting to select from an empty square or from a square that has opponent's rice in it, early exit and ask user to select again
        if (!squares[i] || squares[i] !== me) {
          alert(`Please select again, you must pick a square with a ${me}`)
          return
        }

        document.getElementById(i).style.backgroundColor = "lightgreen";
        for (const adjSqIndex of adjSquareIndices[i]) {
          if (!squares[adjSqIndex]) {
            document.getElementById(adjSqIndex).style.backgroundColor = "lightcyan";
          }
        }
        this.setState({
          from: i
        })
      }
      else {
        console.log("FROM ", this.state.from, ", TO ", i)
        let moveIsValid = true;
        // TO square must be empty. if it's not, alert and set flag
        if (squares[i]) {
          alert(`You must select an empty square to move your rice, the square you selected currently has: ${squares[i]}\nPlease restart your selection.`)
          moveIsValid = false;
        }

        
        // TO square must be adjacent. if it's not alert and set flag
        if (!adjSquareIndices[this.state.from].includes(i)) {
          moveIsValid ? alert("You must select a square that is adjacent vertically, horizontally, or diagonally\nPlease restart your selection."): null;
          moveIsValid = false;
        }

        // Modify squares as if we've completed the move
        squares[this.state.from] = null;
        squares[i] = me;
        // If I occupy the center square my next move must either win or vacate the square, if it does not alert and set flag
        if (iOccupyCenter && !(calculateWinner(squares) || !squares[4])) {
          moveIsValid ? alert("You occupy the center square, your next move must either win or vacate the center\nPlease restart your selection.") : null;
          moveIsValid = false;
        }

        if (moveIsValid) {
          this.setState({
            history: history.concat([{
              squares: squares,
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
            from: -1
          })
        }
        else {
          // Reset this.state.from
          this.setState({
            from: -1
          })
        }

        // Regardless if move was successful or not, exiting will return user to start of selection,
        // Hence we reset the color of all squares
        for (let index = 0; index <= 8; index++) {
          document.getElementById(index).style.backgroundColor = "white";
        }
      }
    }
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner is: ' + winner;
      const squares = document.getElementsByClassName("square");
      for (const square of squares) {
        square.style.cursor = ""
      }
    }
    else {status = 'Next player: ' + (this.state.xIsNext ? 'X' : '0');}

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />

        </div>
        <div className="game-info">
          <div>{status}</div>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}