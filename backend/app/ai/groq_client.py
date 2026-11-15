import os
from typing import Optional, List
from app.config import settings

class GroqClient:
    def __init__(self):
        self.api_key = settings.GROQ_API_KEY or os.getenv("GROQ_API_KEY", "")
        self.client = None
        self.last_error = None
        self.active_model = None
        if self.api_key:
            try:
                from groq import Groq
                self.client = Groq(api_key=self.api_key, timeout=5.0, max_retries=1)
            except Exception as e:
                self.last_error = f"Failed to initialize Groq client: {e}"
                print(self.last_error)
                self.client = None

    def is_configured(self) -> bool:
        return bool(self.client and self.api_key)

    def get_supported_models(self) -> List[str]:
        """
        Dynamically query available models from Groq or return prioritized supported text models.
        """
        if not self.is_configured():
            return []

        # Default prioritized candidates
        default_candidates = [
            settings.GROQ_MODEL,
            "qwen/qwen3.8-27b",
            "llama-3.3-70b-versatile",
            "llama-3.1-8b-instant",
            "allam-2-7b",
            "mixtral-8x7b-32768",
            "gemma2-9b-it"
        ]

        try:
            available = [m.id for m in self.client.models.list().data]
            # Prioritize candidates that exist in the active account
            preferred = [m for m in default_candidates if m in available]
            # Add any other non-whisper, non-guard models
            other_text = [
                m for m in available
                if not any(skip in m for skip in ["whisper", "prompt-guard", "safeguard"])
                and m not in preferred
            ]
            final_models = preferred + other_text
            return final_models if final_models else default_candidates
        except Exception as e:
            # If models.list fails (e.g. permission or network), fallback to default candidates
            return [m for m in default_candidates if m]

    def generate_response(self, system_prompt: str, user_prompt: str) -> Optional[str]:
        if not self.is_configured():
            return None

        models_to_try = self.get_supported_models()
        # Remove duplicates while preserving order
        seen = set()
        unique_models = [m for m in models_to_try if m and not (m in seen or seen.add(m))]

        for model_name in unique_models:
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
                    content = response.choices[0].message.content.strip()
                    # Skip empty string responses (e.g. safeguard or unsupported preview models)
                    if content:
                        self.active_model = model_name
                        self.last_error = None
                        return content
            except Exception as e:
                err_str = str(e)
                self.last_error = f"Groq API error on model {model_name}: {err_str}"
                # If authentication failed (invalid or revoked key), halt immediately
                if "401" in err_str or "unauthorized" in err_str.lower() or "invalid_api_key" in err_str.lower():
                    print("Groq authentication failed (401). Falling back to grounded deterministic engine.")
                    break
                # If rate-limited (429), try next model or fallback
                continue

        return None

groq_client = GroqClient()
