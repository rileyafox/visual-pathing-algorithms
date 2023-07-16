import React from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import '../styles/ControlPanel.css';

export default function ControlPanel({algorithm, setAlgorithm, startPathfinding}) {
  return (
    <Box className="control-panel" sx={{mt: 4}}>
      <Select
        value={algorithm}
        onChange={(e) => setAlgorithm(e.target.value)}
        className="algorithm-select"
      >
        <MenuItem value="bfs">BFS</MenuItem>
        <MenuItem value="astar">A*</MenuItem>
      </Select>
      <Button 
        variant="contained" 
        color="primary" 
        onClick={startPathfinding}
        className="start-button"
      >
        Start
      </Button>
    </Box>
  );
}
