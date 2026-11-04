import os
from typing import Optional
from app.config import settings

class GroqClient:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY or os.getenv("GROQ_API_KEY", "")
        self.client = None
        if self.api_key:
            try:
                from groq import Groq
                self.client = Groq(api_key=self.api_key)
            except Exception as e:
                print(f"Failed to initialize Groq client: {e}")
                self.client = None

    def is_configured(self) -> bool:
        return bool(self.client and self.api_key)

    def generate_response(self, system_prompt: str, user_prompt: str) -> Optional[str]:
        if not self.is_configured():
            return None
        
        models_to_try = [settings.GROQ_MODEL, "openai/gpt-oss-20b", "openai/gpt-oss-120b"]
        for model_name in models_to_try:
            try:
                response = self.client.chat.completions.create(
                    model=model_name,
                    max_tokens=1024,
                    temperature=0.2,
                    messages=[
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ]
                )
                if response.choices and response.choices[0].message.content:
                    return response.choices[0].message.content
            except Exception as e:
                print(f"Groq API error on model {model_name}: {e}")
                continue
        return None

groq_client = GroqClient()
