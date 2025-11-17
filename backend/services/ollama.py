import os

import httpx

OLLAMA_URL = os.getenv("OLLAMA_URL", "http://ollama:11434")


async def query_ollama(model: str, prompt: str) -> str:
    """
    Sends prompt to Ollama and returns the generated text.
    """
    # Setze alle Timeout-Werte explizit
    timeout = httpx.Timeout(
        connect=10.0,  # Verbindungsaufbau: 10 Sekunden
        read=120.0,  # Lesen der Antwort: 120 Sekunden
        write=10.0,  # Schreiben des Requests: 10 Sekunden
        pool=10.0  # Connection Pool: 10 Sekunden
    )

    async with httpx.AsyncClient(timeout=timeout) as client:
        payload = {
            "model": model,
            "messages": [
                {"role": "user", "content": prompt}
            ],
            "stream": False,
            "options": {"temperature": 0.7}
        }

        try:
            resp = await client.post(f"{OLLAMA_URL}/api/chat", json=payload)
            resp.raise_for_status()
            data = resp.json()
            return data["message"]["content"]
        except httpx.TimeoutException as e:
            raise Exception(
                f"Ollama Timeout: Model lädt noch oder ist überlastet. Bitte warte und versuche es erneut. ({e})")
        except httpx.HTTPStatusError as e:
            raise Exception(f"Ollama HTTP Error: {e.response.status_code} - {e.response.text}")
        except Exception as e:
            raise Exception(f"Ollama Error: {str(e)}")
