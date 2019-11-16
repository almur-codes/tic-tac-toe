import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props){
    const className = (props.isWinner) ? "square winner" : "square";
    
    return (
        <button 
            className={className} 
            onClick={ props.onClick }
        >
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    constructor(props){
        super(props);

        this.state = {
            squares: Array(9).fill(null),
            player: 'X',
            history: [{
                player: 'O',
                nextPlayer: 'X',
                board: Array(9).fill(null)
            }],
            positionInTimeline: 0,
            winningSet: null
        };
    }

    renderSquare(i, winningSet) {
        const isWinner = (Array.isArray(winningSet)) ? winningSet.includes(i) : false;

        return <Square 
            value = {this.state.squares[i]}
            onClick = {() => this.handleClick(i)}
            isWinner = {isWinner} />;
    }

    handleClick(i){
        const newSqaures = this.state.squares.slice();
        if( newSqaures[i] != null || this.calculateWinner() != null ){
            return;
        }
        newSqaures[i] = this.state.player;

        const nextPlayer = (this.state.player === 'X') ? 'O' : 'X';
        
        const currentMove = {
            player: this.state.player,
            nextPlayer: nextPlayer,
            board: newSqaures
        }

        const history = ( this.state.positionInTimeline > 0 ) ? this.state.history.slice(0, this.state.positionInTimeline + 1) : this.state.history.slice() ;

        history.push(currentMove);

        this.setState({
            squares: newSqaures,
            player: nextPlayer,
            history: history,
            positionInTimeline: this.state.positionInTimeline + 1
        })
    }

    resetBoard(){
        this.setState({
            player: 'X',
            squares: Array(9).fill(null),
            history: [{
                player: 'O',
                nextPlayer: 'X',
                board: Array(9).fill(null)
            }],
            positionInTimeline: 0,
            winningSet: null
        });
    }

    undo(){
        let position = ((this.state.positionInTimeline - 1) > -1) ? this.state.positionInTimeline - 1 : 0 ;

        this.setState({
            squares: this.state.history[ position ].board,
            player: this.state.history[ position ].nextPlayer,
            positionInTimeline: position
        })
    }
    
    redo(){
        let position = ((this.state.positionInTimeline + 1) < this.state.history.length) ? this.state.positionInTimeline + 1 : this.state.history.length - 1 ;

        this.setState({
            squares: this.state.history[ position ].board,
            player: this.state.history[ position ].nextPlayer,
            positionInTimeline: position
        })
    }

    calculateWinner(){
        const winningLines = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ]

        for (let index = 0; index < winningLines.length; index++) {
            const [a, b, c] = winningLines[index];
            if( this.state.squares[a] && this.state.squares[a] === this.state.squares[b] && this.state.squares[a] === this.state.squares[c] ){
                return [this.state.squares[a], a, b, c];
            }
        }

        return null;
    }

    render() {
        const winner = this.calculateWinner();
        
        let status = 'Next player: ' + this.state.player;

        if(winner){
            status = 'Player ' + winner[0] + ' has won the game';
        }

        return (
            <div className="board">
                <div className="status">{status}</div>
                <div className="board-row">
                    {this.renderSquare(0, winner)}
                    {this.renderSquare(1, winner)}
                    {this.renderSquare(2, winner)}
                </div>
                <div className="board-row">
                    {this.renderSquare(3, winner)}
                    {this.renderSquare(4, winner)}
                    {this.renderSquare(5, winner)}
                </div>
                <div className="board-row">
                    {this.renderSquare(6, winner)}
                    {this.renderSquare(7, winner)}
                    {this.renderSquare(8, winner)}
                </div>
                <button className="reset-button" onClick={() => this.undo()}>Undo</button>

                <button className="reset-button" onClick={() => this.resetBoard()}>Reset Board</button>

                <button className="reset-button" onClick={() => this.redo()}>Redo</button>
            </div>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className="game">
                <div className="game-board">
                    <Board />
                </div>
                <div className="game-info">
                    <div>{/* status */}</div>
                    <ol>{/* TODO */}</ol>
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
