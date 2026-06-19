import { useState, useEffect } from 'react';
import './Sidebar.css';

export default function Sidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onToggleSettings,
  councilModels = [],
  chairmanModel,
  allModels = [],
}) {
  const getModelName = (id) => {
    if (!id) return 'None';
    const model = allModels.find(m => m.id === id);
    return model ? model.name : id.split('/').pop();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>LLM Council</h1>
        <button className="new-conversation-btn" onClick={onNewConversation}>
          + New Conversation
        </button>
      </div>

      <div className="conversation-list">
        {conversations.length === 0 ? (
          <div className="no-conversations">No conversations yet</div>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`conversation-item ${
                conv.id === currentConversationId ? 'active' : ''
              }`}
              onClick={() => onSelectConversation(conv.id)}
            >
              <div className="conversation-title">
                {conv.title || 'New Conversation'}
              </div>
              <div className="conversation-meta">
                {conv.message_count} messages
              </div>
            </div>
          ))
        )}
      </div>

      <div className="sidebar-footer">
        <div className="selected-models-section">
          <h3>Active Council</h3>
          
          <div className="selected-model-group">
            <div className="selected-model-role">Chairman</div>
            <div className="selected-model-name chairman">👑 {getModelName(chairmanModel)}</div>
          </div>
          
          <div className="selected-model-group">
            <div className="selected-model-role">Members ({councilModels.length})</div>
            <div className="selected-model-list">
              {councilModels.map(id => (
                <div key={id} className="selected-model-name member">• {getModelName(id)}</div>
              ))}
            </div>
          </div>
        </div>

        <button className="settings-btn" onClick={onToggleSettings}>
          ⚙️ Configure Models
        </button>
      </div>
    </div>
  );
}
