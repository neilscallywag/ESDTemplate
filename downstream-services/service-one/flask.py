from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/ping', methods=['GET'])
def ping():
    return jsonify({"message": "Pong! from service one"}), 200

@app.route('/echo', methods=['POST'])
def echo():
    data = request.json
    return jsonify({"received at service one": data}), 200

if __name__ == '__main__':
    app.run(debug=True, port=8081)
