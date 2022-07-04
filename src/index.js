import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// The Square button
function Square(props) {
  return (
    <button 
      className={props.className}
      id={props.id}
      onClick={props.onClick}
      >
      {props.value}
    </button>
  );
}

// The Board - parent component for Square, child for the Game
class Board extends React.Component {
  
  // 5. When someone wins, highlight the three squares that caused the win.
  setSquareClass(i) {
    let winningSquare = this.props.winner && this.props.winner.winningSquares.includes(i) ? true : false;
    let classNames = 'square';
    if (winningSquare) {
      classNames = 'square winner';
    }
    return classNames;
  }

  // Squares handling
  renderSquare(i) {
    return (
      <Square 
        id={i}
        className={this.setSquareClass(i)}
        value={this.props.squares[i]} 
        onClick={() => this.props.onClick(i)}
      />
    );
  }
  // 3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
  render() {
    const boardSide = 3;
    let boardSquares = [];
    for(let row = 0; row < boardSide; row++){
      let boardRow = [];
      for(let col = 0; col < boardSide; col++){
        boardRow.push(<span key={(row * boardSide) + col}>{this.renderSquare((row * boardSide) + col)}</span>);
      }
      boardSquares.push(<div className="board-row" key={row}>{boardRow}</div>);
    }
    
    return (
      <div>
        {boardSquares}
      </div>
    );
  }

}

// the Game - top-level component
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        lastClicked: null,
      }],
      stepNumber: 0,
      xIsNext:true,
      activeMenuButton: null,
      ascending: true,
    };
  }

  // Get the click, send it to the board 
  // and update history and flip the player 
  // and check if there is a winner
  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        lastClicked: i,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
      activeMenuButton: null,
    });
  }

  jumpTo(step) {
    const buttonId = 'button' + step;

    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
      activeMenuButton: buttonId,
    });
  }

  // 2. Bold the currently selected item in the move list
  getClassNames(buttonId) {
    let classNames = '';
    if (buttonId === this.state.activeMenuButton) {
      classNames = 'chosen'
    } 
    return classNames;
  }

  sortButton() {
    this.setState({
      ascending: !this.state.ascending,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const ascending = this.state.ascending;

    const moves = history.map((step, move) => {
      // 1. Display the location for each move in the format 
      // (col, row) in the move history list.
      const loc = step.lastClicked;
      const row = Math.floor(loc / 3 + 1);
      const col = Math.floor(loc % 3 + 1);

      const buttonId = 'button' + move;

      const desc = move ? 
        'Go to move #' + move + ' at row ' + row + ' col ' + col:
        'Go to game start';
      return (
          <li key={move}>
            <button id={buttonId} className={this.getClassNames(buttonId)} onClick={() =>
              this.jumpTo(move)
              }
            >
              {desc} 
            </button>
          </li>
        );
    })

    let status;
    // 6. When no one wins, display a message about the result being a draw.
    if (this.state.stepNumber === 9 && winner.winner === null) {
      status = 'It\'s a draw';
    }
    else if (winner) {
      status = 'Winner: ' + winner.winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
            winner={winner}
          />
        </div>
        <div className="game-info">
          <div>{ status }</div>
          <button onClick={() => this.sortButton()}>Toggle Sort Order</button>
          <ol>{ ascending ? moves : moves.reverse() }</ol>
        </div>
      </div>
    );
  }
}

// helper func to determine the winner 
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
      return {
        winner: squares[a], 
        winningSquares: lines[i],
      };
    }
  }
  return null;
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);


/* If you have extra time or want to practice your new React skills, here are some ideas for improvements that you could make to the tic-tac-toe game which are listed in order of increasing difficulty:

1. Display the location for each move in the format (col, row) in the move history list.
2. Bold the currently selected item in the move list.
3. Rewrite Board to use two loops to make the squares instead of hardcoding them.
4. Add a toggle button that lets you sort the moves in either ascending or descending order.
5. When someone wins, highlight the three squares that caused the win.
6. When no one wins, display a message about the result being a draw. */
