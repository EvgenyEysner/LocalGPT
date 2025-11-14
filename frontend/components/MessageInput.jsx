import {useState} from 'react';

export default function MessageInput({onSend, inputRef}) {
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
                placeholder="Schreibe deine Nachricht…"
            />
            <button
                type="submit"
                className="p-3 bg-indigo-600 text-white rounded-r hover:bg-indigo-700"
            >
                Senden
            </button>
        </form>
    );
}