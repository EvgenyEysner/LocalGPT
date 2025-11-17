import {useEffect, useRef, useState} from 'react';
import MessageInput from './MessageInput.jsx';
import Message from './Message.jsx';
import {getConversation} from "../src/api/chat.js";

export default function ChatWindow({convId}) {
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);
    const [isConnected, setIsConnected] = useState(false);
    const retryCountRef = useRef(0);
    const reconnectTimerRef = useRef(null);
    const inputRef = useRef();

    const loadHistory = async () => {
        const data = await getConversation(convId);
        setMessages(Array.isArray(data?.messages) ? data.messages : []);
    };

    const connectWS = () => {
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
        const host = 'backend:5000'; // z.B. localhost:5173
        const base = (import.meta?.env && import.meta.env.VITE_WS_BASE_URL) ? import.meta.env.VITE_WS_BASE_URL : `${protocol}://${host}`;
        const socket = new WebSocket(`${base}/api/v1/ws/${convId}`);
        setIsConnected(false);
        socket.onopen = () => {
            setIsConnected(true);
            // Verlauf laden, sobald verbunden
            loadHistory().catch(() => {
            });
            // Reset Backoff
            retryCountRef.current = 0;
        };
        socket.onmessage = (event) => {
            setMessages(prev => [...prev, {role: 'assistant', content: event.data}]);
        };
        socket.onclose = () => {
            // Zurücksetzen und Reconnect planen
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
        socket.onerror = () => {
            console.error('WebSocket-Fehler');
        };
        setWs(socket);
        return socket;
    };

    // Verbindungsaufbau und Cleanup bei Konversationswechsel/Unmount
    useEffect(() => {
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
            }
        }
        setWs(null);
        setIsConnected(false);
        retryCountRef.current = 0;
        // Neue Verbindung aufbauen
        connectWS();

        return () => {
            if (reconnectTimerRef.current) {
                clearTimeout(reconnectTimerRef.current);
                reconnectTimerRef.current = null;
            }
            if (ws && (ws.readyState === WebSocket.OPEN || ws.readyState === WebSocket.CONNECTING)) {
                try {
                    ws.close();
                } catch (e) {
                }
            }
        };
        // eslint-disable-next-line
    }, [convId]);

    const sendMessage = (text) => {
        if (!ws || ws.readyState !== WebSocket.OPEN) {
            console.warn('WebSocket ist nicht verbunden oder wird geschlossen.');
            return;
        }
        ws.send(text);
        setMessages(prev => [...prev, {role: 'user', content: text}]);
    };

    return (
        <div className="flex-1 flex flex-col p-4 overflow-hidden">
            <div className="flex-1 overflow-y-auto mb-4">
                {messages.map((m, i) => (
                    <Message key={i} role={m.role} content={m.content}/>
                ))}
            </div>
            <MessageInput onSend={sendMessage} inputRef={inputRef} isConnected={isConnected}/>
        </div>
    );
}
