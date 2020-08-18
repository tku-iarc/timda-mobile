from flask import Flask, request, abort, render_template, jsonify
from flask_socketio import SocketIO, emit

app = Flask(__name__)
app.config['SECRET_KEY'] = 'secret!'
socketio = SocketIO(app)


@app.route("/status", methods=['GET'])
def upload():
    if not request.json:
        abort(400)

    d = request.json.get("data", 0)
    print("receive data:{}".format(d))
    # do something

    socketio.emit('status_response', {'data': d})
    return jsonify(
        {"response": "ok"}
    )


@app.route("/")
def home():
    return render_template('index.html', async_mode=socketio.async_mode)


if __name__ == "__main__":
    socketio.run(app, debug=True)
