from flask import Flask, request, jsonify
from pathfinding import bfs_pathfinding
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/pathfinding', methods=['POST'])
def api_pathfinding():
    try:
        data = request.get_json()
        board = data.get('board')
        start = tuple(data.get('start'))
        end = tuple(data.get('end'))

        if board is None:
            return jsonify({'error': 'Invalid board data.'}), 400

        result = bfs_pathfinding(board, start, end)
        path = result.get('path')
        explored_cells = result.get('explored_cells')
        
        if path is None:
            return jsonify({'error': 'No path found.'}), 400

        return jsonify({'path': path, 'explored': explored_cells}), 200
    except Exception as e:
        # Log the error
        print(f"Error: {str(e)}")
        return jsonify({'error': 'Internal server error.'}), 500

if __name__ == '__main__':
    app.run(debug=True)
