from flask import Flask, request, jsonify
from pathfinding import bfs_pathfinding
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/api/pathfinding', methods=['POST'])
def api_pathfinding():
    data = request.get_json()
    board = data.get('board')
    start = tuple(data.get('start'))
    end = tuple(data.get('end'))
    path = bfs_pathfinding(board, start, end)
    if path is None:
        return jsonify({'error': 'No path found.'}), 400
    return jsonify({'path': path}), 200

if __name__ == '__main__':
    app.run(debug=True)
