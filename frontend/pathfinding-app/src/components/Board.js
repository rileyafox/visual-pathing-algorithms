import React, { useState, useEffect } from 'react';
import { Paper } from '@mui/material';
import '../styles/Board.css';

// Declare the Board component
const Board = () => {
    const size = 8;  // Size of the board (size x size)

    // State for start and end points
    const [start, setStart] = useState({x: 0, y: 0});
    const [end, setEnd] = useState({x: size - 1, y: size - 1});

    // State for the board with initial state including start, end and obstacle placement
    const [board, setBoard] = useState(() => {
        // Create a size x size 2D array filled with null
        const initialState = Array(size).fill(null).map(() => Array(size).fill(null));
        // Iterate over all cells of the 2D array
        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                // Skip the start and end cells
                if ((i === start.y && j === start.x) || (i === end.y && j === end.x)) continue;
                // Avoid placing obstacles directly around the start or end points
                if ((Math.abs(i - start.y) <= 1 && Math.abs(j - start.x) <= 1) ||
                    (Math.abs(i - end.y) <= 1 && Math.abs(j - end.x) <= 1)) continue;
                // Randomly place obstacles, for example, 30% of the time
                if (Math.random() < 0.3) {
                    // Avoid creating a completely blocked row or column
                    if ((i > 0 && initialState[i - 1][j]) || 
                        (j > 0 && initialState[i][j - 1]) ||
                        (i < size - 1 && initialState[i + 1][j]) || 
                        (j < size - 1 && initialState[i][j + 1])) continue;
                    initialState[i][j] = 'obstacle';  // Place an obstacle
                }
            }
        }
        // Mark the start and end cells
        initialState[start.y][start.x] = 'start';
        initialState[end.y][end.x] = 'end';
        // Return the initial state of the board
        return initialState;
    });

    // State for storing the path
    const [path, setPath] = useState([]);

    // Effect hook to fetch the path when the board, start or end change
    useEffect(() => {
        // Define the function that will fetch the path
        const fetchPath = async () => {
            // Send a POST request to the server with the board, start, and end as the body
            const response = await fetch('http://localhost:5000/api/pathfinding', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    board: board,
                    start: [start.y, start.x],
                    end: [end.y, end.x]
                })
            });
            // Parse the response as JSON
            const data = await response.json();
            // Set the path state with the data from the response
            setPath(data.path);
        };

        // Call the fetchPath function
        fetchPath();
    }, [board, start, end]);  // Rerun the effect when board, start, or end change

    // Render the board
    return (
        <div className="board">
            {/* Map over each row and then over each cell */}
            {board.map((row, i) => row.map((cell, j) => {
                // Check if current cell is part of the path
                const isPath = path.some(([x, y]) => x === i && y === j);

                return (
                    // Render a Paper component for each cell
                    <Paper
                        key={`${i}-${j}`} 
                        // Set elevation based on the cell type
                        elevation={cell === 'obstacle' ? 6 : ((i + j) % 2 === 0) ? 1 : 3}
                        // Set className based on whether the cell is part of the path
                        className={`cell ${isPath ? 'path' : ''}`}
                        // Set style properties
                        sx={{ 
                            width: 45, height: 45, 
                            // Set bgcolor based on the cell type
                            bgcolor: cell === 'start' ? '#38a169' : 
                                cell === 'end' ? '#e53e3e' : 
                                cell === 'obstacle' ? '#718096' : 
                                isPath ? '#9F7AEA' :  // If the cell is part of the path
                                // If not, alternate colors for the rest of the cells
                                ((i + j) % 2 === 0) ? '#fff' : '#eee' 
                        }}
                    />
                );
            }))}
        </div>
    );
};

// Export the Board component as default
export default Board;
