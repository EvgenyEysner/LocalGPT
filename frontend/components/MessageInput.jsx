import {useState} from 'react';

export default function MessageInput({onSend, inputRef, isConnected = false}) {
    const [value, setValue] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!value.trim()) return;
        onSend(value.trim());
        setValue("");
    };

    return (
        <form onSubmit={handleSubmit} className="flex">
            <input
                ref={inputRef}
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="flex-1 p-3 border rounded-l focus:outline-none"
                placeholder={isConnected ? "Schreibe deine Nachricht…" : "Verbinde…"}
                disabled={!isConnected}
            />
            <button
                type="submit"
                className="p-3 bg-indigo-600 text-white rounded-r hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={!isConnected}
            >
                Senden
            </button>
        </form>
    );
}