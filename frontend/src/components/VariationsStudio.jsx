import { useState } from 'react';
import { api } from '../api';
import './VariationsStudio.css';

export default function VariationsStudio({ councilModels, chairmanModel, allModels }) {
  const [inputContent, setInputContent] = useState('');
  const [variations, setVariations] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const activeModels = [...new Set([...councilModels, chairmanModel])].filter(Boolean);

  const getModelName = (id) => {
    if (!id) return 'Unknown Model';
    const model = allModels.find(m => m.id === id);
    return model ? model.name : id.split('/').pop();
  };

  const handleGenerate = async () => {
    if (!inputContent.trim()) return;
    if (activeModels.length === 0) return;

    setIsLoading(true);
    try {
      const response = await api.getVariations(inputContent, activeModels);
      setVariations(response.variations);
    } catch (error) {
      console.error('Failed to generate variations:', error);
      alert('Error generating variations. Ensure the backend is running.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="variations-studio">
      <div className="studio-header">
        <h2>Variations Studio</h2>
        <p>Send a prompt to all active council members simultaneously to compare their outputs.</p>
      </div>

      <div className="studio-input-section">
        <textarea
          className="studio-textarea"
          value={inputContent}
          onChange={(e) => setInputContent(e.target.value)}
          placeholder="Paste a paragraph, phrase, or prompt here to see how different models handle it..."
        />
        <button 
          className="generate-variations-btn" 
          onClick={handleGenerate}
          disabled={isLoading || !inputContent.trim() || activeModels.length === 0}
        >
          {isLoading ? 'Generating Variations...' : `Generate with ${activeModels.length} Models`}
        </button>
      </div>

      {variations.length > 0 && (
        <div className="variations-grid">
          {variations.map((v, index) => (
            <div key={index} className="variation-card">
              <div className="variation-card-header">
                {getModelName(v.model)}
                {v.model === chairmanModel && <span className="chairman-badge">👑 Chairman</span>}
              </div>
              <div className="variation-card-body">
                {v.content}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
