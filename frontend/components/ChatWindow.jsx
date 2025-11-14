import {useEffect, useRef, useState} from 'react';
import MessageInput from './MessageInput.jsx';
import Message from './Message.jsx';
import {useConversation} from "../src/api/chat.js";

export default function ChatWindow({convId}) {
    const [messages, setMessages] = useState([]);
    const [ws, setWs] = useState(null);
    const inputRef = useRef();

    const loadHistory = async () => {
        const data = await useConversation(convId);
        setMessages(data.messages);
    };

    const connectWS = () => {
        const socket = new WebSocket(`ws://localhost/api/ws/${convId}`);
        socket.onmessage = (event) => {
            setMessages(prev => [...prev, {role: 'assistant', content: event.data}]);
        };
        setWs(socket);
    };

    useEffect(() => {
        if (!ws) connectWS();
        else loadHistory();
        // eslint-disable-next-line
    }, [ws]);

    const sendMessage = (text) => {
        if (!ws) return;
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
            <MessageInput onSend={sendMessage} inputRef={inputRef}/>
        </div>
    );
}
