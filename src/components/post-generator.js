import React, { useState } from 'react';

function BlogPostGenerator() {
  const [title, setTitle] = useState('');
  const [highlight, setHighlight] = useState('');  // Estado individual para el input de highlight
  const [highlights, setHighlights] = useState([]); // Lista de highlights
  const [output, setOutput] = useState('');

  const handleGenerate = () => {
    const generatedOutput = "Aquí es donde tu post generado aparecería";
    setOutput(generatedOutput);
  };

  const addHighlight = () => {
    if (highlight) {
      setHighlights(prevHighlights => [...prevHighlights, highlight]);
      setHighlight(''); // limpiar el input después de agregar
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">

    {/* Hero Section */}
    <div className="bg-indigo-900 text-white py-20">
      <h2 className="text-5xl font-sans font-bold text-center mb-4">Generador artículos de blog</h2>
      <p className="text-xl text-center">Crea tu artículo de blog para SEO con Inteligencia Artificial</p>
    </div>

    <div className="flex flex-1 mt-10">
        {/* Formulario en el lado izquierdo */}
        <div className="flex-1 p-10 bg-white">
          <div className="mb-5">
            <label className="block text-sm font-medium mb-2" htmlFor="title">Título:</label>
            <input 
              type="text"
              id="title"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300"
              placeholder="Inserta el título aquí"
              value={title}
              onChange={e => setTitle(e.target.value)}
            />
          </div>

          <div className="mb-5">
            <label className="block text-sm font-medium mb-2" htmlFor="highlight">Temas Principales:</label>
            <div className="flex items-center">
              <input 
                type="text"
                id="highlight"
                className="flex-grow px-4 py-2 border rounded-md focus:outline-none focus:ring focus:ring-indigo-200 focus:border-indigo-300"
                placeholder="Inserta un tema principal"
                value={highlight}
                onChange={e => setHighlight(e.target.value)}
              />
              <button 
                onClick={addHighlight}
                className="ml-2 px-4 py-2 rounded-lg bg-indigo-900 text-white focus:outline-none hover:bg-indigo-700 active:bg-indigo-800"
              >
                +
              </button>
            </div>
            <ul className="mt-3">
              {highlights.map((highlight, index) => (
                <li key={index} className="bg-gray-100 rounded px-3 py-2 my-1">{highlight}</li>
              ))}
            </ul>
          </div>

          <button 
            onClick={handleGenerate}
            className="px-5 py-2 rounded-lg bg-indigo-900 text-white focus:outline-none hover:bg-indigo-700 active:bg-indigo-800"
          >
            Generar
          </button>
        </div>

        {/* Salida en el lado derecho */}
        <div className="flex-1 p-10 bg-gray-200">
          <div className="h-full border rounded-lg bg-white p-5 overflow-y-auto">
            {output ? (
              <p>{output}</p>
            ) : (
              <p className="text-gray-400 italic">El output generado aparecerá aquí...</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default BlogPostGenerator;
