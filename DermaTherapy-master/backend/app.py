from flask import Flask, request, jsonify, send_file
from flask_cors import CORS  # type: ignore
import os
from dotenv import load_dotenv
from database.supabase_auth import verify_token
from database.db import UserDBHandler
import markdown
from google import genai
import secrets
from inference_sdk import InferenceHTTPClient
from werkzeug.utils import secure_filename

load_dotenv()

ORIGIN_URL = os.getenv('origins', 'http://localhost:5173')
app = Flask(__name__)
CORS(app, origins=[ORIGIN_URL])
app.secret_key = secrets.token_hex(24)

UPLOAD_FOLDER = os.path.join('static', 'uploads')  # static/uploads/
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER


# Initialize DB and Gemini
db = UserDBHandler()
api_key = os.getenv("GEMINI_API_KEY") or "ENTER-YOUR-KEY-HERE"
model = genai.Client(api_key=api_key)


@app.route('/api/register', methods=['POST'])
def register():
    auth_header = request.headers.get('Authorization')
    if not auth_header or not auth_header.startswith('Bearer '):
        return jsonify({'error': 'Missing Bearer token'}), 401

    token = auth_header.split(' ')[1]
    user_info = verify_token(token)

    if not user_info:
        return jsonify({'error': 'Invalid token'}), 401

    auth_id = user_info['sub']
    email = user_info['email']
    full_name = user_info.get('user_metadata', {}).get('fname' + 'lname', 'Anonymous')

    if db.user_exists(email):
        return jsonify({'message': 'User already registered'}), 409

    user_id = db.add_user(auth_id=auth_id, email=email, full_name=full_name)
    return jsonify({'message': 'User registered', 'user_id': user_id}), 201


@app.route('/submit_symptoms', methods=['POST'])
def submit_symptoms():
    form = request.form

    # Save uploaded image
    image = request.files.get('image')
    if image:
        filename = secure_filename(image.filename)
        image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        os.makedirs(app.config['UPLOAD_FOLDER'], exist_ok=True)
        image.save(image_path)
    else:
        image_path = None

    # Now you have `image_path` to use in your further processing
    print("Image saved at:", image_path)

    # Extract form data
    age = form.get("age")
    gender = form.get("gender")
    skin_type = form.get("skin_type")
    symptoms = form.get("primary_symptoms")
    duration = form.get("duration")
    severity = form.get("severity")
    body_area = form.get("body_area")
    routine = form.get("daily_routine")
    diet = form.get("diet")
    allergies = form.get("allergies")
    conditions = form.get("existing_conditions")
    medications = form.get("medications")
    family_history = form.get("family_history")
    other_symptoms = form.get("other_symptoms")
    consent = form.get("consent")

   
    if "pimples" in symptoms.lower() or "acne" in symptoms.lower() or "acne scars" in symptoms.lower() :
        predicted_condition = "acne"
    elif "itching" in symptoms.lower() or "red patches" in symptoms.lower():
        predicted_condition = "eczema"
    elif "dark spots" in symptoms.lower() or "pigmentation" in symptoms.lower():
        predicted_condition = "melasma"
    elif "ring" in symptoms.lower() or "circular red patches" in symptoms.lower() or "tinea" in symptoms.lower() or "fungal" in symptoms.lower() or "scaly patches" in symptoms.lower():
        predicted_condition = "tinea"
    else:
        predicted_condition = "psoriasis"

    prediction = analyze(image_path)
    print(prediction)

    prompt = f"""
    A user has submitted a skin condition report:
    - Age: {age}
    - Gender: {gender}
    - Skin Type: {skin_type}
    - Primary Symptoms: {symptoms}
    - Duration of Symptoms: {duration}
    - Severity: {severity}
    - Affected Body Areas: {body_area}
    - Skincare/Daily Routine: {routine}
    - Diet: {diet}
    - Allergies or Triggers: {allergies}
    - Existing Medical Conditions: {conditions}
    - Current Medications: {medications}
    - Family History of Skin Conditions: {family_history}
    - Other Symptoms: {other_symptoms}
    - Image Consent for Diagnosis: {consent}
    - Predicted Skin Condition: {predicted_condition}

    Based on this information, provide a remedy recommendation, including:
    1. Likely cause of the condition
    2. Home treatment or lifestyle advice
    3. Over-the-counter medication suggestions (if any)
    4. When to seek medical attention
    """

    try:
        response = model.models.generate_content(model="gemini-2.0-flash", contents=prompt)
        remedy_text = response.text
    except Exception as e:
        remedy_text = f"An error occurred while generating the recommendation: {str(e)}"

    return markdown.markdown(remedy_text)


@app.route('/download_remedy', methods=['POST'])
def download_remedy():
    data = request.get_json()
    remedy = data.get("remedy", "No remedy found.")

    file_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), "remedy.txt")

    os.makedirs(os.path.dirname(file_path), exist_ok=True)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(remedy)

    return send_file(file_path, as_attachment=True, download_name="remedy.txt")

def getResult(api_key, workspace_name, workflow_id, image_path):
    client = InferenceHTTPClient(
        api_url="https://serverless.roboflow.com",
        api_key=api_key
    )
    result = client.run_workflow(
        workspace_name=workspace_name,
        workflow_id=workflow_id,
        images={"image": image_path},
        use_cache=True
    )
    return result

def predictSub(meta_class, img_path):
    configs = {
        "Acne": {
            "api_key": "ACNE-KEY",
            "workspace_name": "eczema-veixh",
            "workflow_id": "custom-workflow-29",
            "api_url": "https://serverless.roboflow.com"
        },
        "Eczema": {
            "api_key": "ECZEMA-KEY",
            "workspace_name": "eczema-dataset",
            "workflow_id": "custom-workflow-33",
            "api_url": "https://detect.roboflow.com"
        },
        "Melasma": {
            "api_key": "MELASMA-KEY",
            "workspace_name": "eczema-veixh",
            "workflow_id": "custom-workflow-30",
            "api_url": "https://serverless.roboflow.com"
        },
        "Tinea": {
            "api_key": "TINEA-KEY",
            "workspace_name": "eczema-veixh",
            "workflow_id": "custom-workflow-31",
            "api_url": "https://serverless.roboflow.com"
        },
        "Psoriasis": {
            "api_key": "lGuDxZ2LeV6f8SZcwHS9",
            "workspace_name": "eczema-veixh",
            "workflow_id": "custom-workflow-32",
            "api_url": "https://serverless.roboflow.com"
        }
    }

    if meta_class not in configs:
        return None

    config = configs[meta_class]
    return getResult(
        api_key=config["api_key"],
        workspace_name=config["workspace_name"],
        workflow_id=config["workflow_id"],
        image_path=img_path
    )

def analyze(img_path):
    if not img_path:
        return jsonify({'error': 'Image path not provided'}), 400
    
    try:
        client = InferenceHTTPClient(
            api_url="https://serverless.roboflow.com",
            api_key="lGuDxZ2LeV6f8SZcwHS9"
        )

        result = client.run_workflow(
            workspace_name="eczema-veixh",
            workflow_id="custom-workflow-28",
            images={
                "image": {img_path}
            },
            use_cache=True # cache workflow definition for 15 minutes
        )
    except Exception as e:
        return jsonify({'error': str(e)}), 500

    return predictSub(result[0]["predictions"]['top'], img_path)



if __name__ == '__main__':
    app.run(debug=True, port=5000)
