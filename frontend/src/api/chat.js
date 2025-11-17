export async function createConversation(title = "Neues Gespräch") {
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
    if (!convId) {
        throw new Error('`convId` muss definiert sein.');
    }

    const url = `/api/v1/conversations/${convId}`;

    const response = await fetch(url, {
        method: 'GET',
        credentials: 'include',
        headers: {
            'Accept': 'application/json',
        },
    });

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(
            `Fehler beim Laden der Konversation ${convId}: ${response.status} ${response.statusText} – ${errorText}`
        );
    }

    return await response.json();
}
