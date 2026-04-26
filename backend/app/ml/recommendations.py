import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

def _format_shap_for_prompt(shap_explanation: list) -> str:
    lines = []
    for s in shap_explanation:
        feature = s["feature"].replace("_", " ")
        direction = "increases" if s["shapValue"] > 0 else "decreases"
        lines.append(f"- {feature} (value: {s['value']}) → {direction} churn risk")
    return "\n".join(lines)

def generate_recommendations(
    customer_id: str,
    churn_probability: float,
    risk_level: str,
    shap_explanation: list
) -> list:
    shap_text = _format_shap_for_prompt(shap_explanation)
    pct = round(churn_probability * 100, 1)

    prompt = f"""You are a telecom customer retention analyst.

Customer #{customer_id} has a {pct}% churn probability and is classified as {risk_level} risk.

Top factors driving this prediction:
{shap_text}

Give exactly 3 short, specific, actionable retention recommendations for a customer service manager.
Format your response as a JSON array of strings, like:
["recommendation 1", "recommendation 2", "recommendation 3"]

Only return the JSON array, nothing else."""

    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        max_tokens=300,
        messages=[{"role": "user", "content": prompt}]
    )

    text = response.choices[0].message.content.strip()
    return json.loads(text)