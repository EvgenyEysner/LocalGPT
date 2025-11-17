export async function createConversation(title = "Neues Gespräch") {
    const resp = await fetch('/api/v1/conversation', {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({title})
    });
    if (!resp.ok) throw new Error("Cannot create conversation");
    return await resp.json();
}

export async function getConversations() {
    const resp = await fetch('/api/v1/conversations');
    if (!resp.ok) throw new Error("Cannot fetch conversations");
    return await resp.json();
}

export async function getConversation(convId) {
    const resp = await fetch(`/api/v1/conversations/${convId}`);
    if (!resp.ok) throw new Error("Cannot fetch conversation");
    return await resp.json();
}
