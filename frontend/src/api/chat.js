export async function createConversation(title = null) {
    const resp = await fetch('/api/v1/conversations', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({title})
    });
    if (!resp.ok) throw new Error("Cannot create conversation");
    return await resp.json();
}

export async function getConversation(convId) {
    const resp = await fetch(`/api/v1/conversations/${convId}`);
    if (!resp.ok) throw new Error("Cannot fetch conversation");
    return await resp.json();
}


export async function useConversation(convId) {
    // 1. Validierung der Eingabe (optional, aber gut für frühzeitige Fehlerfindung)
    if (!convId) {
        throw new Error('`convId` muss definiert sein.');
    }

    // 2. Aufruf des Endpoints –
    //    (Du kannst den Pfad an deine Back‑end‑Route anpassen.)
    //
    //    Beispiel‑Route:
    //      GET /api/chat/:convId   →  { messages: [...] }
    //
    //    Falls dein Backend ein Query‑Param‑Schema verwendet, ersetze die URL
    //    entsprechend:  `/api/chat?convId=${convId}`
    const url = `/api/chat/${convId}`;

    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include', // falls dein Server Auth‑Cookies benutzt
        headers: {
            'Accept': 'application/json',
        },
    });

    // 3. Fehler‑Handling
    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Fehler beim Laden der Konversation ${convId}: ${response.status} ${response.statusText} – ${errorText}`
        );
    }

    // 4. JSON‑Payload entpacken
    const data = await response.json();

    /* Erwartetes Schema (basierend auf der Nutzung in ChatWindow)
     *
     * data = {
     *   messages: [
     *     { role: 'assistant', content: '…' },
     *     { role: 'user',      content: '…' },
     *     …
     *   ]
     * }
     */
    return data;
}
