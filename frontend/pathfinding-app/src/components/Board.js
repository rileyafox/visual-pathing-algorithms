import React, { useState } from 'react';
import '../styles/Board.css';

const Board = () => {
    const size = 8;
    const [start, setStart] = useState({x: 0, y: 0});
    const [end, setEnd] = useState({x: size - 1, y: size - 1});

    const [board, setBoard] = useState(() => {
        const initialState = Array(size).fill(null).map(() => Array(size).fill(null));
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                if ((i === start.y && j === start.x) || (i === end.y && j === end.x)) continue;
                if (Math.random() < 0.3) {
                    initialState[i][j] = true;
                }
            }
        }
        return initialState;
    });

    return (
        <div className="board">
            {board.map((row, i) => row.map((cell, j) => (
                <div 
                    key={`${i}-${j}`} 
                    className={`cell ${cell ? 'cell-obstacle' : ((i + j) % 2 === 0) ? 'cell-white' : 'cell-gray'}
                        ${i === start.y && j === start.x ? 'cell-start' : ''}
                        ${i === end.y && j === end.x ? 'cell-end' : ''}`}
                />
            )))}
        </div>
    );
};

export default Board;
