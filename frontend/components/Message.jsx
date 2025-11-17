export default function Message({role, content}) {
    const isUser = role === 'user';

    return (
        <div className={`py-4 ${isUser ? 'bg-white' : 'bg-gpt-light-gray'}`}>
            <div className="max-w-4xl mx-auto px-4 flex gap-4">
                {/* Avatar */}
                <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        isUser
                            ? 'bg-gray-700 text-white'
                            : 'bg-gpt-user text-white'
                    }`}>
                    {isUser ? 'Du' : 'AI'}
                </div>

                {/* Content */}
                <div className="flex-1 prose prose-sm max-w-none">
                    <p className={`text-base leading-7 ${isUser ? 'text-gray-900' : 'text-gray-800'}`}>
                        {content}
                    </p>
                </div>
            </div>
        </div>
    );
}
