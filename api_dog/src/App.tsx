import React, { useState } from 'react';
import './App.css';

interface BreedImagesResponse {
  message: string[];
  status: string;
}

function App() {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'search' | 'results'>('search');

  const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const breed = searchTerm.trim().toLowerCase();
    if (!breed) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`https://dog.ceo/api/breed/${breed}/images`);
      const data: BreedImagesResponse = await response.json();

      if (data.status === 'error') {
        throw new Error(`Raça "${breed}" não encontrada.`);
      }

      setImages(data.message.slice(0, 30));
      setView('results');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao buscar.');
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    setView('search');
    setSearchTerm('');
    setImages([]);
    setError(null);
  };

  return (
    <div className="app-container">
      {view === 'search' ? (
        <section className="search-view">
          <div className="search-content">
            <h1 className="dogg-title">
              <span style={{color: '#4285F4'}}>D</span>
              <span style={{color: '#EA4335'}}>o</span>
              <span style={{color: '#FBBC05'}}>g</span>
              <span style={{color: '#34A853'}}>g</span>
            </h1>
           
            <form onSubmit={handleSearch} className="search-form">
              <div className="search-bar-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Pesquise uma raça"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  autoFocus
                />
              </div>
             
              <div className="search-buttons">
                <button type="submit" className="dogg-button" disabled={loading}>
                  {loading ? 'Pesquisando...' : 'Pesquisa Dogg'}
                </button>
              </div>
             
              {error && <p className="error-text">{error}</p>}
            </form>
          </div>
        </section>
      ) : (
        <section className="results-view">
          <header className="results-header">
            <div className="header-content">
               <button onClick={handleBack} className="back-button">
                ← Voltar
              </button>
              <h2>Exibindo fotos de: <span>{searchTerm}</span></h2>
            </div>
          </header>

          <main className="image-grid">
            {images.map((img, index) => (
              <div key={index} className="image-card">
                <img src={img} alt="Dog" loading="lazy" />
              </div>
            ))}
          </main>
        </section>
      )}
    </div>
  );
}

export default App;
