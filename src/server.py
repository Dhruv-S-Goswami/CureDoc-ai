from flask import Flask, request, jsonify
import joblib
import pandas as pd
import numpy as np
import os
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

# Get the correct file path
model_path = os.path.join(os.path.dirname(__file__), "../assets/model", "ensemble_model.pkl")
vectorizer_path = os.path.join(os.path.dirname(__file__), "../assets/model", "tfidf_vectorizer.pkl")
encoder_path = os.path.join(os.path.dirname(__file__), "../assets/model", "label_encoder.pkl")

print("Model path:", model_path)
# Load the trained model
model = joblib.load(model_path)
vectorizer = joblib.load(vectorizer_path)  # Load the TF-IDF vectorizer
label_encoder = joblib.load(encoder_path)  # Load label encoder


# Load the CSV once at server start
try:
    doctor_df = pd.read_csv("assets/Dataset/Ahmedabad_All_Specialist_Doctors.csv")
    print("✅ Loaded doctor records:", len(doctor_df))
except Exception as e:
    doctor_df = pd.DataFrame(columns=["Disease", "Specialist Doctor/Hospital"])
    print("❌ Error loading doctor CSV:", e)

@app.route("/recommend-doctors", methods=["POST"])
def recommend_doctors():
    try:
        data = request.get_json()
        disease = data.get("disease", "").strip().lower()

        if not disease:
            return jsonify({"error": "No disease provided"}), 400

        if doctor_df.empty:
            return jsonify({"error": "Doctor database not loaded"}), 500

        # Filter rows matching the disease
        filtered = doctor_df[doctor_df["Disease"].str.lower() == disease]

        if filtered.empty:
            return jsonify({"doctors": []})  # Graceful return

        doctor_list = []
        for _, row in filtered.iterrows():
            parts = row["Specialist Doctor/Hospital"].split(",")
            if len(parts) >= 3:
                name = parts[0].strip()
                specialty = parts[1].strip()
                location = ", ".join(part.strip() for part in parts[2:])
            else:
                name = parts[0].strip()
                specialty = parts[1].strip() if len(parts) > 1 else "Unknown"
                location = "Ahmedabad"

            doctor_list.append({
                "name": name,
                "specialty": specialty,
                "location": location
            })

        return jsonify({"doctors": doctor_list})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json
        symptoms = data.get("symptoms", [])

        if not symptoms:
            return jsonify({"error": "No symptoms provided"}), 400

        # Convert input symptoms to a TF-IDF vector
        input_vector = vectorizer.transform([" ".join(symptoms)])
        
        # Make prediction (returns an encoded label index)
        prediction_index = model.predict(input_vector)[0]

        # Decode label to get actual disease name
        predicted_disease = label_encoder.inverse_transform([prediction_index])[0]

        return jsonify({"disease": predicted_disease})
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True)

