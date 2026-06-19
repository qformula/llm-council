import { useState, useEffect } from 'react';
import './ModelPanel.css';

export default function ModelPanel({ 
  isOpen, 
  onClose, 
  councilModels, 
  setCouncilModels, 
  chairmanModel, 
  setChairmanModel,
  models
}) {
  const [search, setSearch] = useState('');
  const loading = models.length === 0;
  const [filters, setFilters] = useState({
    freeOnly: false,
    text: false,
    image: false,
    file: false,
    video: false,
    audio: false,
    selectedOnly: false,
  });



  const toggleCouncilModel = (modelId) => {
    if (councilModels.includes(modelId)) {
      setCouncilModels(councilModels.filter(id => id !== modelId));
    } else {
      setCouncilModels([...councilModels, modelId]);
    }
  };

  const filteredModels = models.filter(m => {
    if (filters.selectedOnly) {
      if (!councilModels.includes(m.id) && chairmanModel !== m.id) return false;
    }

    const matchesSearch = m.id.toLowerCase().includes(search.toLowerCase()) || 
                          m.name.toLowerCase().includes(search.toLowerCase());
    if (!matchesSearch) return false;

    const isFree = m.pricing && Number(m.pricing.prompt) === 0 && Number(m.pricing.completion) === 0;
    if (filters.freeOnly && !isFree) return false;

    const modalityStr = (m.architecture?.modality || 'text').split('->')[0].toLowerCase();
    if (filters.text && !modalityStr.includes('text')) return false;
    if (filters.image && !modalityStr.includes('image')) return false;
    if (filters.file && !modalityStr.includes('file')) return false;
    if (filters.video && !modalityStr.includes('video')) return false;
    if (filters.audio && !modalityStr.includes('audio')) return false;

    return true;
  });

  return (
    <div className={`model-panel ${isOpen ? 'open' : ''}`}>
      <div className="model-panel-header">
        <h2>Configure Models</h2>
        <button className="close-btn" onClick={onClose}>&times;</button>
      </div>
      
      <div className="model-panel-content">
        <div className="model-filters">
          <input 
            type="text" 
            placeholder="Search models..." 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="model-search"
          />
          <div className="filter-checkboxes">
            <label className="filter-label">
              <input type="checkbox" checked={filters.freeOnly} onChange={e => setFilters({...filters, freeOnly: e.target.checked})} />
              Free Only
            </label>
            <label className="filter-label">
              <input type="checkbox" checked={filters.selectedOnly} onChange={e => setFilters({...filters, selectedOnly: e.target.checked})} />
              Selected Only
            </label>
            <span style={{color: '#ddd'}}>|</span>
            <label className="filter-label">
              <input type="checkbox" checked={filters.text} onChange={e => setFilters({...filters, text: e.target.checked})} />
              Text
            </label>
            <label className="filter-label">
              <input type="checkbox" checked={filters.image} onChange={e => setFilters({...filters, image: e.target.checked})} />
              Image
            </label>
            <label className="filter-label">
              <input type="checkbox" checked={filters.file} onChange={e => setFilters({...filters, file: e.target.checked})} />
              File
            </label>
            <label className="filter-label">
              <input type="checkbox" checked={filters.video} onChange={e => setFilters({...filters, video: e.target.checked})} />
              Video
            </label>
            <label className="filter-label">
              <input type="checkbox" checked={filters.audio} onChange={e => setFilters({...filters, audio: e.target.checked})} />
              Audio
            </label>
          </div>
          {!loading && (
            <div className="model-count">
              Showing {filteredModels.length} of {models.length} models
            </div>
          )}
        </div>

        {loading ? (
          <div className="loading-models">Loading OpenRouter models...</div>
        ) : (
          <div className="model-list">
            {filteredModels.map(model => {
              const isFree = model.pricing && Number(model.pricing.prompt) === 0 && Number(model.pricing.completion) === 0;
              const modality = model.architecture?.modality || 'text';

              const modalityLabel = modality.split('->')[0] || modality;
              const isImage = modalityLabel.toLowerCase().includes('image');

              return (
                <div key={model.id} className="model-item">
                  <div className="model-info">
                    <div className="model-name-row">
                      <span className="model-name">{model.name}</span>
                      {isFree && <span className="badge free">Free</span>}
                      <span className={`badge modality ${isImage ? 'image' : ''}`}>{modalityLabel}</span>
                    </div>
                    <div className="model-id">{model.id}</div>
                  </div>
                  
                  <div className="model-actions">
                    <label className="checkbox-label">
                      <input 
                        type="checkbox" 
                        checked={councilModels.includes(model.id)}
                        onChange={() => toggleCouncilModel(model.id)}
                      />
                      Council
                    </label>
                    <label className="radio-label">
                      <input 
                        type="radio" 
                        name="chairman"
                        checked={chairmanModel === model.id}
                        onChange={() => setChairmanModel(model.id)}
                      />
                      Chairman
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
