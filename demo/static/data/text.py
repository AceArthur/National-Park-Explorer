import json

with open("attracton.json", "rb") as fr:
    data = json.load(fr)


process = []
for item in data["features"]:
    process.append({"name": item})