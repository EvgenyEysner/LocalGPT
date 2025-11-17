import {useState} from 'react';

export default function MessageInput({onSend, inputRef, isConnected = false}) {
    const [value, setValue] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!value.trim()) return;
        onSend(value.trim());
        setValue("");
        if (inputRef?.current) {
            inputRef.current.focus();
        }
    };

    return (
        <div className="bg-white border-t border-gray-200">
            <div className="max-w-4xl mx-auto p-4">
                <form onSubmit={handleSubmit} className="flex gap-3">
                    <input
                        ref={inputRef}
                        value={value}
                        onChange={(e) => setValue(e.target.value)}
                        className="flex-1 px-4 py-3 bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:border-gpt-user focus:ring-2 focus:ring-gpt-user focus:ring-opacity-20 transition"
                        placeholder={isConnected ? "Schreibe deine Nachricht…" : "Verbindet sich…"}
                        disabled={!isConnected}
                    />
                    <button
                        type="submit"
                        className="px-4 py-3 bg-gpt-user text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                        disabled={!isConnected || !value.trim()}
                    >
                        ↑
                    </button>
                </form>
                <p className="text-xs text-gray-500 text-center mt-2">
                    {isConnected ? 'Verbunden' : 'Verbindet sich…'}
                </p>
            </div>
        </div>
    );
}