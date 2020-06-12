from flask import Flask, jsonify, render_template
from flask_pymongo import PyMongo
import pymongo
from bson import json_util
import json
# Create an instance of Flask
app = Flask(__name__)
conn="mongodb+srv://connect_user:Project_2@cluster1-oinat.mongodb.net/weather_data?retryWrites=true&w=majority"
# Use PyMongo to establish Mongo connection
mongo = PyMongo(app, uri=conn)
@app.route("/")
def home():
    return render_template("index.html")


@app.route("/api/v1.0/weather_data")
def all_data():
    #entries=[]
    us_data = mongo.db.us.find()
    #entries={"first":us_data}
    # for d in us_data:
    #     entries.append(json.loads(json_util.dumps(d)))
    #    # entries.append(json.dumps(d, default=json_util.default))
    #     entries.append(d)
    #print(len(entries))
    return jsonify(json.loads(json_util.dumps(us_data)))

@app.route("/api/v1.0/weather_data/<city_name>")
def city_data(city_name):
    us_data=mongo.db.us.find()
    canonicalized = city_name.replace(" ","").lower()
    print(canonicalized)
    matched_data=[]
    for d in us_data:
        search_term=d["name"].replace(" ","").lower()
        if search_term==canonicalized:
            matched_data.append(d)
    return jsonify(json.loads(json_util.dumps(matched_data)))
    # return "hi, you got it !!!"

if __name__ == "__main__":
    app.run(debug = True)