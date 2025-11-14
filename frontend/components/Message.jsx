export default function Message({role, content}) {
    const isUser = role === 'user';
    return (
        <div className={`mb-2 ${isUser ? 'text-right' : 'text-left'}`}>
      <span className={`inline-block px-3 py-2 rounded ${isUser ? 'bg-indigo-200' : 'bg-green-200'}`}>
        {content}
      </span>
        </div>
    );
}
