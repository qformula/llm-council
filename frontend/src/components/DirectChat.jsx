import { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import './DirectChat.css';

export default function DirectChat({
  conversation,
  onSendMessage,
  isLoading,
  chairmanModel,
  allModels
}) {
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const getModelName = (id) => {
    if (!id) return 'Unknown Model';
    const model = allModels.find(m => m.id === id);
    return model ? model.name : id.split('/').pop();
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input, 'direct');
      setInput('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  if (!conversation) {
    return (
      <div className="direct-chat-interface">
        <div className="empty-state">
          <h2>Welcome to LLM Council</h2>
          <p>Create a new conversation to start chatting 1-on-1</p>
        </div>
      </div>
    );
  }

  return (
    <div className="direct-chat-interface">
      <div className="direct-chat-header">
        <div className="chairman-info">
          <span className="chairman-label">Chatting with:</span>
          <span className="chairman-name">👑 {getModelName(chairmanModel)}</span>
        </div>
      </div>

      <div className="direct-messages-container">
        {conversation.messages.length === 0 ? (
          <div className="empty-state">
            <h2>Start a 1:1 Chat</h2>
            <p>Your messages will be sent directly to the Chairman model.</p>
          </div>
        ) : (
          conversation.messages.map((msg, index) => (
            <div key={index} className="direct-message-group">
              {msg.role === 'user' ? (
                <div className="direct-user-message">
                  <div className="direct-message-label">You</div>
                  <div className="direct-message-content">
                    <div className="markdown-content">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="direct-assistant-message">
                  <div className="direct-message-label">👑 {getModelName(chairmanModel)}</div>
                  
                  {msg.loading?.stage3 && (
                    <div className="stage-loading">
                      <div className="spinner"></div>
                      <span>Thinking...</span>
                    </div>
                  )}
                  
                  {msg.stage3 && (
                    <div className="direct-message-content assistant-content">
                      <div className="markdown-content">
                        <ReactMarkdown>{msg.stage3.response}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                  
                  {/* Fallback for messages generated in Council Mode but viewed in Direct Mode */}
                  {msg.content && !msg.stage3 && !msg.loading?.stage3 && !msg.error && (
                    <div className="direct-message-content assistant-content">
                      <div className="markdown-content">
                        <ReactMarkdown>{msg.content}</ReactMarkdown>
                      </div>
                    </div>
                  )}

                  {msg.error && (
                    <div className="direct-message-content assistant-content error-content">
                      <div className="markdown-content" style={{ color: '#ef4444' }}>
                        **Error:** {msg.error}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))
        )}

        {isLoading && !conversation.messages[conversation.messages.length - 1]?.isStreaming && (
          <div className="loading-indicator">
            <div className="spinner"></div>
            <span>Waiting for response...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      <div className="direct-input-area">
        <form className="direct-input-form" onSubmit={handleSubmit}>
          <textarea
            className="direct-message-input"
            placeholder="Message the Chairman directly... (Shift+Enter for new line)"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={isLoading}
            rows={3}
          />
          <button
            type="submit"
            className="direct-send-button"
            disabled={!input.trim() || isLoading}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
