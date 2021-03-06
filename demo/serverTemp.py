from flask import Flask

app = Flask(__name__)  # fine for single module


@app.route("/")
def root():
    return app.send_static_file("index.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0")
