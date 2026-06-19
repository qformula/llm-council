import { useState, useEffect } from 'react';
import './Sidebar.css';

export default function Sidebar({
  conversations,
  currentConversationId,
  onSelectConversation,
  onNewConversation,
  onRenameConversation,
  onToggleSettings,
  councilModels = [],
  chairmanModel,
  allModels = [],
  activeTab,
  setActiveTab,
  isLoading,
}) {
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState('');

  const getModelName = (id) => {
    if (!id) return 'None';
    const model = allModels.find(m => m.id === id);
    return model ? model.name : id.split('/').pop();
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h1>LLM Council</h1>
        
        <div className="sidebar-tabs">
          <button 
            className={`sidebar-tab ${activeTab === 'council' ? 'active' : ''}`}
            onClick={() => setActiveTab('council')}
          >
            ⚖️ Council
          </button>
          <button 
            className={`sidebar-tab ${activeTab === 'direct' ? 'active' : ''}`}
            onClick={() => setActiveTab('direct')}
          >
            💬 1:1 Chat
          </button>
          <button 
            className={`sidebar-tab ${activeTab === 'variations' ? 'active' : ''}`}
            onClick={() => setActiveTab('variations')}
          >
            ✨ Variations
          </button>
        </div>

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
              onClick={() => {
                if (editingId !== conv.id) {
                  onSelectConversation(conv.id);
                }
              }}
            >
              <div className="conversation-title-row">
                {editingId === conv.id ? (
                  <input
                    type="text"
                    className="rename-input"
                    value={editTitle}
                    autoFocus
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setEditTitle(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        onRenameConversation(conv.id, editTitle);
                        setEditingId(null);
                      } else if (e.key === 'Escape') {
                        setEditingId(null);
                      }
                    }}
                    onBlur={() => {
                      onRenameConversation(conv.id, editTitle);
                      setEditingId(null);
                    }}
                  />
                ) : (
                  <>
                    <span className="conversation-title">
                      {conv.title || 'New Conversation'}
                    </span>
                    <button 
                      className="edit-title-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        setEditingId(conv.id);
                        setEditTitle(conv.title || 'New Conversation');
                      }}
                      title="Rename conversation"
                    >
                      ✏️
                    </button>
                  </>
                )}
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
        
        <div className="app-status">
          <div className={`status-indicator ${isLoading ? 'processing' : 'ready'}`}></div>
          <span className="status-text">{isLoading ? 'Backend Processing...' : 'Backend Ready'}</span>
        </div>
      </div>
    </div>
  );
}
