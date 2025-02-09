from flask import Flask, jsonify, request
from flask_cors import CORS
import hashlib
import datetime
import json

app = Flask(__name__)
CORS(app)  # Enable CORS for frontend communication

class Blockchain:
    def __init__(self):
        self.chain = []
        self.voters = {}  # Store last vote timestamp per voter
        self.create_block(voter_id="genesis", candidate="None", previous_hash="0")  # Genesis block

    def create_block(self, voter_id, candidate, previous_hash):
        timestamp = datetime.datetime.utcnow()

        # Check if voter has already voted in the last 10 days
        if voter_id in self.voters:
            last_vote_time = self.voters[voter_id]
            diff = (timestamp - last_vote_time).days
            if diff < 10:
                return {"error": f"Voter must wait {10 - diff} more days before voting again."}

        # Create block
        block = {
            'index': len(self.chain) + 1,
            'timestamp': str(timestamp),
            'voter_id': voter_id,
            'candidate': candidate,
            'previous_hash': previous_hash,
        }
        block['hash'] = self.hash(block)  # Generate block hash
        self.chain.append(block)

        # Update voter timestamp
        self.voters[voter_id] = timestamp
        return block

    def get_previous_block(self):
        return self.chain[-1]

    def hash(self, block):
        encoded_block = json.dumps(block, sort_keys=True).encode()
        return hashlib.sha256(encoded_block).hexdigest()

# Initialize blockchain
blockchain = Blockchain()

@app.route('/vote', methods=['POST'])
def vote():
    try:
        data = request.get_json()
        voter_id = data.get('voterId') or data.get('voter_id')  # Handle both cases
        candidate = data.get('candidate')

        if not voter_id or not candidate:
            return jsonify({'error': 'Missing voterId or candidate'}), 400

        previous_hash = blockchain.get_previous_block()['hash']
        result = blockchain.create_block(voter_id, candidate, previous_hash)

        if "error" in result:
            return jsonify(result), 400  # Prevent double voting within 10 days

        return jsonify({'success': True, 'message': 'Vote recorded successfully!', 'block': result}), 200

    except Exception as e:
        return jsonify({'error': f'An error occurred: {str(e)}'}), 500

if __name__ == '__main__':
    app.run(debug=True)
