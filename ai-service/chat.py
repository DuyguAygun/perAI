from flask import Flask, request, jsonify
from dotenv import load_dotenv
import os
import requests

app = Flask(__name__)

load_dotenv()  # .env dosyasını yükler

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
OPENAI_URL = "https://api.openai.com/v1/chat/completions"

def chat_with_gpt(user_input):
    headers = {
        "Authorization": f"Bearer {OPENAI_API_KEY}",
        "Content-Type": "application/json"
    }
    
    payload = {
        "model": "gpt-4o-mini",  # GPT-4o Mini Modeli
        "messages": [
            {"role": "system", "content": "Sen bir İngilizce öğretmenisin. Gönderilen cümlelerin gramer hatalarını düzelt."},
            {"role": "user", "content": user_input}
        ],
        "temperature": 0.7,
        "max_tokens": 200
    }

    response = requests.post(OPENAI_URL, json=payload, headers=headers)
    response_json = response.json()
    
    print("OpenAI Yaniti:", response_json)  # Terminalde yanıtı kontrol et

    if "choices" in response_json and len(response_json["choices"]) > 0:
        return response_json["choices"][0]["message"]["content"]
    else:
        return None

@app.route("/chat", methods=["POST"])
def chat():
    data = request.json
    user_message = data.get("message", "")

    if not user_message:
        return jsonify({"error": "Mesaj boş olamaz"}), 400

    corrected_message = chat_with_gpt(user_message)

    if corrected_message is None:
        return jsonify({"error": "OpenAI API'den geçerli bir yanıt alınamadı"}), 500

    return jsonify({"corrected": corrected_message})

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=False)