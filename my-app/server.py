from flask import Flask, request, jsonify
from langchain_community.llms import Ollama
from flask_cors import CORS 

app = Flask(__name__)
CORS(app)  

@app.route("/StoryTeller", methods=["POST"])
def storyTeller():
    input_data = request.get_json()
    input_text = input_data.get("text", "")
    
    llm = Ollama(model="smollm:135m-instruct-v0.2-q8_0")
    response = llm.invoke(f"Your a story telling agent, Tell a story based on the given context without any dialogue : {input_text}")
    
    return jsonify({"response": response})

if __name__ == "__main__":
    app.run(debug=True)
