import {useEffect, useRef, useState} from 'react';
import MessageInput from './MessageInput.jsx';
import Message from './Message.jsx';
import {getConversation, updateConversationTitle} from "../src/api/chat.js";

export default function ChatWindow({convId, onTitleUpdate}) {
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const retryCountRef = useRef(0);
    const reconnectTimerRef = useRef(null);
    const inputRef = useRef();
    const messagesEndRef = useRef(null);
    const titleUpdatedRef = useRef(false);

    // Auto-scroll zu neuesten Messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({behavior: 'smooth'});
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const loadHistory = async () => {
        setIsLoading(true);
        try {
            const data = await getConversation(convId);
            console.log("Loaded conversation:", data); // Debug

            if (data?.messages && Array.isArray(data.messages)) {
                // Sortiere Messages nach created_at oder id
                const sortedMessages = [...data.messages].sort((a, b) => {
                    // Versuche nach created_at zu sortieren
                    if (a.created_at && b.created_at) {
                        return new Date(a.created_at) - new Date(b.created_at);
                    }
                    // Fallback: nach ID sortieren
                    return a.id - b.id;
                });

                setMessages(sortedMessages);
                console.log("Set messages:", sortedMessages); // Debug

                // Prüfe, ob Titel schon gesetzt wurde
                if (sortedMessages.length > 0) {
                    titleUpdatedRef.current = true;
                }
            } else {
                console.warn("No messages in conversation data:", data);
                setMessages([]);
            }
        } catch (error) {
            console.error("Error loading conversation history:", error);
            setMessages([]);
        } finally {
            setIsLoading(false);
        }
    };

    const connectWS = () => {
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const host = window.location.host;
        const base = import.meta.env.VITE_WS_BASE_URL || `${protocol}://${host}`;
        const socket = new WebSocket(`${base}/api/v1/ws/${convId}`);

        setIsConnected(false);

        socket.onopen = () => {
            console.log("WebSocket connected for conversation:", convId);
            setIsConnected(true);

            // Lade History NACH WebSocket-Verbindung
            loadHistory();

            // Reset Backoff
            retryCountRef.current = 0;
        };

        socket.onmessage = (event) => {
            console.log("Received message:", event.data); // Debug

            const data = event.data;

            // Prüfe auf Title-Update (optional)
            if (data.startsWith("__TITLE_UPDATE__:")) {
                const newTitle = data.replace("__TITLE_UPDATE__:", "");
                if (onTitleUpdate) {
                    onTitleUpdate(convId, newTitle);
                }
            } else {
                // Normale Assistant-Nachricht
                setMessages(prev => [...prev, {
                    role: 'assistant',
                    content: data,
                    created_at: new Date().toISOString()
                }]);
            }
        };

        socket.onclose = () => {
            console.log("WebSocket closed for conversation:", convId);
            setIsConnected(false);
            setWs(null);

            if (reconnectTimerRef.current) {
                clearTimeout(reconnectTimerRef.current);
                reconnectTimerRef.current = null;
            }

            const attempt = (retryCountRef.current || 0) + 1;
            retryCountRef.current = attempt;
            const delay = Math.min(30000, 500 * 2 ** (attempt - 1));

            reconnectTimerRef.current = setTimeout(() => {
                if (!ws || ws.readyState === WebSocket.CLOSED) {
                    connectWS();
                }
            }, delay);
        };

        socket.onerror = (error) => {
            console.error('WebSocket-Fehler:', error);
        };

        setWs(socket);
        return socket;
    };

    // Verbindungsaufbau und Cleanup bei Konversationswechsel/Unmount
    useEffect(() => {
        console.log("ChatWindow mounted/updated for convId:", convId);

        // Reset für neue Conversation
        titleUpdatedRef.current = false;
        setMessages([]);
        setIsLoading(true);

        // Cleanup evtl. laufender Reconnect-Timer
        if (reconnectTimerRef.current) {
            clearTimeout(reconnectTimerRef.current);
            reconnectTimerRef.current = null;
        }

        // Vorherige Verbindung schließen
        if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
            try {
                ws.close();
            } catch (e) {
                console.error("Error closing WebSocket:", e);
            }
        }

        setWs(null);
        setIsConnected(false);
        retryCountRef.current = 0;

        // Neue Verbindung aufbauen
        connectWS();

        return () => {
            console.log("ChatWindow unmounting for convId:", convId);
            if (reconnectTimerRef.current) {
                clearTimeout(reconnectTimerRef.current);
                reconnectTimerRef.current = null;
            }
            if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
                try {
                    ws.close();
                } catch (e) {
                    console.error("Error closing WebSocket on unmount:", e);
                }
            }
        };
        // eslint-disable-next-line
    }, [convId]);

    const sendMessage = async (text) => {
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            console.warn('WebSocket ist nicht verbunden oder wird geschlossen.');
            return;
        }

        // Füge User-Message sofort hinzu (optimistic update)
        const userMessage = {
            role: 'user',
            content: text,
            created_at: new Date().toISOString()
        };
        setMessages(prev => [...prev, userMessage]);

        // Sende über WebSocket
        ws.send(text);

        // Titel automatisch aus erster Nachricht generieren
        if (!titleUpdatedRef.current && messages.length === 0) {
            titleUpdatedRef.current = true;
            try {
                let title = text.trim().slice(0, 50);
                if (text.length > 50) {
                    title += "...";
                }

                await updateConversationTitle(convId, title);

                if (onTitleUpdate) {
                    onTitleUpdate(convId, title);
                }
            } catch (error) {
                console.error('Fehler beim Aktualisieren des Titels:', error);
            }
        }
    };

    return (
        <div className="flex-1 flex flex-col bg-white">
            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4">
                {isLoading ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <p className="text-gray-500">Lade Nachrichten...</p>
                        </div>
                    </div>
                ) : messages.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                            <p className="text-2xl font-semibold text-gray-900 mb-2">Willkommen bei LocalGPT</p>
                            <p className="text-gray-500">Starten Sie ein neues Gespräch</p>
                        </div>
                    </div>
                ) : (
                    <>
                        {messages.map((m, i) => (
                            <Message key={`${m.id || i}-${m.created_at || i}`} role={m.role} content={m.content}/>
                        ))}
                        <div ref={messagesEndRef}/>
                    </>
                )}
            </div>

            {/* Input Area */}
            <MessageInput onSend={sendMessage} inputRef={inputRef} isConnected={isConnected}/>
        </div>
    );
}