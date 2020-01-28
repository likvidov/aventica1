import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      return (
        <Square
          value={this.props.squares[i]}
          onClick={() => this.props.onClick(i)}
        />
      );
    }

    createField = () =>{
        return (<div>
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
        </div>);
    }
  
    render() {
      return (
        this.createField()
      );
    }
  }
  

  class Login extends React.Component{
      constructor(props){
        super(props);
        this.state = {login: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleClick = this.handleClick.bind(this);
      }

      handleClick(){
          if(this.state.login.length >= 1){
              this.handleSubmit();
              ReactDOM.render(<Game updateDate={this.state.login}/>, document.getElementById("root"));
          }
          else{
              alert('Логин должен быть больше трех символов');
          }
      }

      handleChange(event) {
        this.setState({login: event.target.value});
      }

      handleSubmit() {
        alert('Вы вошли как: ' + this.state.login);
      }

      render() {
        return (
            <div>
                <form>
                    <label>
                        Логин:
                        <input value={this.state.value} onChange={this.handleChange} type="text"/>
                    </label>
                    <input type="submit" onClick={this.handleClick} value="Войти" />
                </form>
            </div>
        );
      }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [
          {
            squares: Array(9).fill(null),
          }
        ],
        stepNumber: 0,
        login: this.props.updateDate,
        stateX: 0,
        stateO: 0,
        xIsNext: true,
        reset: false
      };
      
      this.resetGame = this.resetGame.bind(this);
      this.componentDidUpdate = this.componentDidUpdate.bind(this);
    }
  
    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      if (calculateWinner(squares) || squares[i]) {
        return;
      }
      squares[i] = this.state.xIsNext ? "X" : "O";
      this.setState({
        history: history.concat([
          {
            squares: squares
          }
        ]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext
      });
    }

    ai(arr, step){
        let i = this.getRandomInt(9);
        if(arr.squares[i] !== null && step !== 9){
            return this.ai(arr);
        }
        else{return this.handleClick(i);}
    }
    
    getRandomInt(max) {
        return Math.floor(Math.random() * Math.floor(max));
    }

    jumpTo(step) {
        if(step === 0)
        this.setState({
          history: [
            {
                squares: Array(9).fill(null),
            }
          ],
          stepNumber: 0,
          xIsNext: (step % 2) === 0,
          reset: false
        });
    }
    

    componentDidUpdate(event) {
        if(this.state.reset){
            this.jumpTo(0);
        }
    }

    resetGame(statX,statO){
        this.setState({
            reset:true,
            stateX: statX,
            stateO: statO,
        });
    }
    
  
    render() {
        let step = this.state.stepNumber;
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
    
        let status;
        let stO = this.state.stateO;
        let stX = this.state.stateX;

        if (winner) {
            if(winner === "O"){
                stO++;
            } else if(winner === "X"){
                stX++;
            }
            status = "Winner: " + winner;
        } else if(!winner && step === 9){
            status = "Ничья"
        }
        else{
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    
        }

        if(!this.state.xIsNext){
            this.ai(current, step);
        }

        return (
            <div className="game">
            <div className="game-board">
                        <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                        />
            </div>
            <div className="game-info">
                <div>{status}</div>
                <div>Статистика {this.state.login}: {stX}</div>
                <div>Статистика O: {stO}</div>
                <button onClick={() => this.resetGame(stX,stO)}>Сброс</button>
            </div>
            </div>
        );
        }
    }
    
  ReactDOM.render(<Login />, document.getElementById("root"));
  
  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      } 
    }
    return null;
  }