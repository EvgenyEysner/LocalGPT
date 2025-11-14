import os

import httpx

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://ollama:11434")  # Docker‑Service Name


async def query_ollama(model: str, prompt: str) -> str:
    """
    Sendet Prompt an Ollama und gibt den generierten Text zurück.
    """
    async with httpx.AsyncClient() as client:
        payload = {
            "model": model,
            "prompt": prompt,
            "stream": False,
            "options": {"temperature": 0.7}
        }
        resp = await client.post(f"{OLLAMA_URL}/api/chat", json=payload)
        resp.raise_for_status()
        data = resp.json()
        # Antwort kann als "message" oder "content" liegen
        return data.get("message", data.get("content", ""))
