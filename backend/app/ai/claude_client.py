import os
from typing import Optional
from app.config import settings

class ClaudeClient:
    def __init__(self):
        self.api_key = settings.ANTHROPIC_API_KEY or os.getenv("ANTHROPIC_API_KEY", "")
        self.client = None
        if self.api_key:
            try:
                import anthropic
                self.client = anthropic.Anthropic(api_key=self.api_key)
            except Exception as e:
                print(f"Failed to initialize Anthropic client: {e}")
                self.client = None

    def is_configured(self) -> bool:
        return bool(self.client and self.api_key)

    def generate_response(self, system_prompt: str, user_prompt: str) -> Optional[str]:
        if not self.is_configured():
            return None
        try:
            response = self.client.messages.create(
                model=settings.ANTHROPIC_MODEL,
                max_tokens=1024,
                system=system_prompt,
                messages=[{"role": "user", "content": user_prompt}]
            )
            return response.content[0].text
        except Exception as e:
            print(f"Claude API request error: {e}")
            return None

claude_client = ClaudeClient()
