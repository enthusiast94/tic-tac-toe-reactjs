class Square extends React.Component {
    render() {
        if (this.props.isWinnerSquare) {
            return (
                <button className="square winner-square" onClick={() => this.props.onClick()}>
                    {this.props.value}
                </button>
            );
        } else {
            return (
                <button className="square" onClick={() => this.props.onClick()}>
                    {this.props.value}
                </button>
            );
        }
    }
}

class Board extends React.Component {
    renderSquare(i) {
        let isWinnerSquare = this.props.winnerLine ? (this.props.winnerLine.indexOf(i) != -1) : false;
        return <Square key={i} isWinnerSquare={isWinnerSquare}
                       value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
    }

    render() {
        let squareId = 0;
        let rows = [];

        for (let i=0; i<3; i++) {
            let squares = [];
            for (let j=0; j<3; j++) {
                squares.push(this.renderSquare(squareId));
                squareId++;
            }

            rows.push(<div key={i} className="board-row">{squares}</div>);
        }

        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor() {
        super();
        this.state = {
            history: [{
                squares: new Array(9).fill(null)
            }],
            xIsNext: true,
            stepNumber: 0,
            areMovesAscending: true
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber+1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();

        // somebody won or a square already has a value
        if (this.calculateWinner(squares).value || squares[i]) {
            return;
        }

        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares: squares
            }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    getStatus(winner) {
        if (winner) {
            return sprintf("Winner: %s", winner);
        } else {
            return sprintf("Next player: %s", this.state.xIsNext ? "X" : "O");
        }
    }

    getMovesList() {
        const moves = this.state.history.map((step, move) => {
            const moveName = move == 0 ? "Game start" : sprintf("Move #%s", move);

            if (move == this.state.stepNumber) {
                return(
                    <li className="selected-move" key={move}>
                        <a href="#" onClick={() => this.jumpToMove(move)}>{moveName}</a>
                    </li>
                );
            } else {
                return(
                    <li key={move}>
                        <a href="#" onClick={() => this.jumpToMove(move)}>{moveName}</a>
                    </li>
                );
            }
        });

        if (!this.state.areMovesAscending) {
            moves.reverse();
        }

        return moves;
    }

    jumpToMove(move) {
        this.setState({
            stepNumber: move,
            xIsNext: move % 2 ? false: true
        });
    }

    calculateWinner(squares) {
        const output = {
            value: null,
            line: null
        };
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
                output.value = squares[a];
                output.line = lines[i];
                return output;
            }
        }
        return output;
    }

    toggleMovesOrdering() {
        this.setState({
            areMovesAscending: !this.state.areMovesAscending
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = this.calculateWinner(current.squares);
        const status = this.getStatus(winner.value);
        const moves = this.getMovesList();

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} winnerLine={winner.line} onClick={(i) => this.handleClick(i)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <br/>
                    <button onClick={() => this.toggleMovesOrdering()}>
                        Moves order: {this.state.areMovesAscending ? "Ascending" : "Descending"}
                    </button>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('container')
);
