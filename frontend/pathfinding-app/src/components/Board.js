import React, { useEffect, useState } from 'react';
import { Paper, CircularProgress } from '@mui/material';
import axios from 'axios';
import '../styles/Board.css';

const START = [0, 0];
const END = [9, 9];
const OBSTACLE_PERCENT = 0.2;  // 20% of the cells will be obstacles

function createBoard() {
  const board = Array.from({length: 10}, () => Array(10).fill('empty'));
  for (let i = 0; i < 10; i++) {
    for (let j = 0; j < 10; j++) {
      if (Math.random() < OBSTACLE_PERCENT && !(i === START[0] && j === START[1]) && !(i === END[0] && j === END[1])) {
        board[i][j] = 'obstacle';
      }
    }
  }
  board[START[0]][START[1]] = 'start';
  board[END[0]][END[1]] = 'end';
  return board;
}

export default function Board() {
  const [board, setBoard] = useState(createBoard());
  const [exploredCells, setExploredCells] = useState([]);
  const [path, setPath] = useState([]);
  const [isExplorationDone, setIsExplorationDone] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.post('http://localhost:5000/api/pathfinding', {
        board,
        start: START,
        end: END
      });
      setPath(res.data.path);
      setExploredCells(res.data.explored);
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timerId = setInterval(() => {
      if (exploredCells.length) {
        const nextCell = exploredCells.shift();
        board[nextCell[0]][nextCell[1]] = 'explored';
        setBoard([...board]);
      } else {
        setIsExplorationDone(true);
        clearInterval(timerId);
      }
    }, 200);
    return () => clearInterval(timerId);
  }, [exploredCells]);

  useEffect(() => {
    if (isExplorationDone) {
      const timerId = setInterval(() => {
        if (path.length) {
          const nextCell = path.shift();
          board[nextCell[0]][nextCell[1]] = 'path';
          setBoard([...board]);
        } else {
          clearInterval(timerId);
        }
      }, 200);
      return () => clearInterval(timerId);
    }
  }, [isExplorationDone, path]);

  return (
    <div className="board">
      {board.map((row, i) => row.map((cell, j) => (
          <Paper
              key={`${i}-${j}`} 
              elevation={cell === 'obstacle' ? 6 : ((i + j) % 2 === 0) ? 1 : 3}
              className={`cell ${cell}`}
          />
      )))}
    </div>
  );
}
