import {useEffect, useState} from 'react';
import {createConversation} from './api/chat.js';
import ChatWindow from "../components/ChatWindow.jsx";

export default function App() {
    const [conversationId, setConversationId] = useState(null);

    const startNewChat = async () => {
        const res = await createConversation();
        setConversationId(res.id);
    };

    useEffect(() => {
        if (!conversationId) startNewChat();
    }, [conversationId]);

    return (
        <div className="h-full flex flex-col bg-gray-100">
            <header className="p-4 bg-white shadow">
                <h1 className="text-xl font-bold">Chat‑App</h1>
                <button
                    onClick={startNewChat}
                    className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                >
                    Neues Gespräch
                </button>
            </header>

            {conversationId ? <ChatWindow convId={conversationId}/> : null}
        </div>
    );
}
