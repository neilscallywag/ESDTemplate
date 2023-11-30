from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, create_access_token, jwt_required
import mysql.connector
import redis

app = Flask(__name__)
app.config['JWT_SECRET_KEY'] = 'your_secret_key'  # Change this to a strong secret key
jwt = JWTManager(app)

class MySQLRepository:
    def __init__(self, host, user, password, database):
        self.conn = mysql.connector.connect(
            host=host,
            user=user,
            password=password,
            database=database
        )

    def execute_query(self, query, args=None):
        cursor = self.conn.cursor()
        cursor.execute(query, args)
        result = cursor.fetchall()
        cursor.close()
        return result

class RedisRepository:
    def __init__(self, host, port):
        self.conn = redis.StrictRedis(host=host, port=port, decode_responses=True)

    def set_value(self, key, value):
        self.conn.set(key, value)

    def get_value(self, key):
        return self.conn.get(key)

class Authenticator:
    def __init__(self, mysql_repo):
        self.mysql_repo = mysql_repo

    def authenticate(self, username, password):
        # You can add your authentication logic here (e.g., verify username and password in MySQL)
        # For simplicity, we'll assume a hardcoded user for this example
        if username == 'your_username' and password == 'your_password':
            return True
        else:
            return False

@app.route('/google/callback', methods=['POST'])
def handle_google_callback():
    if not request.is_json:
        return jsonify({"msg": "Missing JSON in request"}), 400

    username = request.json.get('username')
    password = request.json.get('password')

    authenticator = Authenticator(mysql_repo)
    if authenticator.authenticate(username, password):
        access_token = create_access_token(identity=username)
        return jsonify(access_token=access_token), 200
    else:
        return jsonify({"msg": "Invalid credentials"}), 401

# @app.route('/protected', methods=['GET'])
# @jwt_required()
# def protected_resource():
#     # This endpoint is protected with JWT authentication
#     current_user = get_jwt_identity()
#     return jsonify(logged_in_as=current_user), 200

if __name__ == '__main__':
    mysql_repo = MySQLRepository(host='mysql_host', user='mysql_user', password='mysql_password', database='mysql_db')
    redis_repo = RedisRepository(host='redis_host', port=6379)

    app.run(debug=True)
