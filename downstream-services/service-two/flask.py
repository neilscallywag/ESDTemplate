from flask import Flask, jsonify, request

app = Flask(__name__)

@app.route('/ping2', methods=['GET'])
def ping():
    return jsonify({"message": "Pong! from service two"}), 200

@app.route('/echo2', methods=['POST'])
def echo():
    data = request.json
    return jsonify({"received at service two": data}), 200

if __name__ == '__main__':
    app.run(debug=True, port=8082)
