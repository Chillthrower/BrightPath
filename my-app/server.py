from flask import Flask, request, jsonify
from langchain_community.llms import Ollama
from flask_cors import CORS
import google.generativeai as genai
import re
from PIL import Image
import base64
from io import BytesIO


app = Flask(__name__)
CORS(app)

genai.configure(api_key="")
model = genai.GenerativeModel("gemini-1.5-flash")

@app.route("/StoryTeller", methods=["POST"])
def storyTeller():
    input_data = request.get_json()
    input_text = input_data.get("text", "")
    
    response = model.generate_content(f"Tell a children's story based on the given context in paragraphs: {input_text}")
    
    return jsonify({"response": response.text})

@app.route("/QuizBot", methods=["POST"])
def quizBot():
    input_data = request.get_json()
    input_text = input_data.get("text", "")

    text = """
    Generate 10 multiple-choice questions based on the provided story. For each question, include:
    1. The question text.
    2. Four options (labeled a, b, c, d).
    3. skip 2 lines before starting the next question.

    Use this exact format for the response:
    Question 1: [Your question here]
    a) [Option 1]
    b) [Option 2]
    c) [Option 3]
    d) [Option 4]
    Correct Answer: [Letter of the correct answer]

    Repeat for all 10 questions.
    """

    # Request the model to generate questions in the defined format
    response = model.generate_content(f"in the following format: {text} \n Frame 10 questions and give 4 options with one correct answer on the following story: {input_text}")
    print(response.text)

    # Now, parse the model's response into a structured format
    quiz_data = parse_quiz_response(response.text)
    print(quiz_data)
    
    return jsonify({"response": quiz_data})

# Helper function to parse the response into structured questions, options, and correct answers
def parse_quiz_response(response):
    # Split the response by questions using regular expressions to capture question text
    questions = re.split(r"(?=Question \d+:)", response.strip())

    parsed_questions = []

    for question in questions:
        lines = question.strip().split("\n")
        
        if len(lines) >= 6:
            # Extract the question, options, and the correct answer
            question_text = lines[0].replace("Question \d+: ", "").strip()
            
            # Retain the labels a), b), c), d) for options
            options = [line.strip() for line in lines[1:5]]
            
            # Extract the correct answer, removing the label like 'Correct Answer: b'
            correct_answer = lines[5].replace("Correct Answer: ", "").strip()

            parsed_questions.append({
                "question": question_text,
                "options": options,
                "correctAnswer": correct_answer
            })

    return parsed_questions

@app.route("/LearnBot", methods=["POST"])
def learnBot():
    input_data = request.get_json()
    input_text = input_data.get("text", "")
    image_base64 = input_data.get("image", "")

    image = None
    if image_base64:
        try:
            if image_base64.startswith("data:image"):
                image_base64 = image_base64.split(",")[1]

            image_data = base64.b64decode(image_base64)
            image = Image.open(BytesIO(image_data))
        except Exception as e:
            print("Error decoding or verifying image:", e)
            return jsonify({"error": "Invalid image data"}), 400

    try:
        if image and input_text:
            prompt = f"Explain this image and the following text in a simple way for children: {input_text}"
            response = model.generate_content([prompt, image])
        elif image:
            prompt = "Explain this image in a simple way for children."
            response = model.generate_content([prompt, image])
        elif input_text:
            prompt = f"Explain this text in a simple way for children: {input_text}"
            response = model.generate_content(prompt)
        else:
            return jsonify({"error": "No valid input provided"}), 400

        return jsonify({"response": response.text})
    except Exception as e:
        print("Error generating response:", e)
        return jsonify({"error": "Failed to generate response"}), 500

if __name__ == "__main__":
    app.run(debug=True)
