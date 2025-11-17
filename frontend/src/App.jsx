import {useEffect, useState} from 'react';
import {createConversation, getConversations} from './api/chat.js';
import ChatWindow from "../components/ChatWindow.jsx";

export default function App() {
    const [conversationId, setConversationId] = useState(null);
    const [conversations, setConversations] = useState([]);
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const loadConversations = async () => {
        try {
            const data = await getConversations();
            setConversations(Array.isArray(data) ? data : []);
            console.log(conversations);
        } catch (error) {
            console.error('Fehler beim Laden der Konversationen:', error);
        }
    };

    const startNewChat = async () => {
        const res = await createConversation();
        setConversationId(res.id);
        await loadConversations();
    };

    useEffect(() => {
        loadConversations();
        if (!conversationId) startNewChat();
    }, []);

    return (
        <div className="h-screen flex bg-white">
            {/* Sidebar */}
            <aside
                className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-gpt-dark text-white transition-all duration-300 overflow-hidden flex flex-col`}>
                <div className="p-4 border-b border-gray-700">
                    <button
                        onClick={startNewChat}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition"
                    >
                        <span>➕</span>
                        <span>Neues Gespräch</span>
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto p-3 space-y-2">
                    {conversations.length > 0 ? (
                        conversations.map((conv) => (
                            <button
                                key={conv.id}
                                onClick={() => setConversationId(conv.id)}
                                className={`w-full text-left px-3 py-2 rounded-lg transition truncate ${
                                    conversationId === conv.id
                                        ? 'bg-gray-700'
                                        : 'hover:bg-gray-700'
                                }`}
                                title={conv.title}
                            >
                                {conv.title || 'Neuer Chat'}
                            </button>
                        ))
                    ) : (
                        <p className="text-xs text-gray-500 px-3 py-2">Keine Konversationen</p>
                    )}
                </nav>
            </aside>

            {/* Main Chat Area */}
            <main className="flex-1 flex flex-col">
                {/* Top Bar */}
                <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition"
                        >
                            ☰
                        </button>
                        <h1 className="text-xl font-semibold text-gray-900">LocalGPT Chat</h1>
                    </div>
                </header>

                {/* Chat Window */}
                <div className="flex-1 overflow-hidden">
                    {conversationId ? <ChatWindow convId={conversationId}/> : (
                        <div className="flex items-center justify-center h-full text-gray-500">
                            Lädt...
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
