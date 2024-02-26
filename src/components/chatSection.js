import React, { useState } from "react";
import { FaPaperPlane } from 'react-icons/fa';

export function ChatTopics() {
    const [userInput, setUserInput] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    const postData = async (question) => {
        try {
            const response = await fetch('http://0.0.0.0:8080/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({ question: question }),
            });

            if (!response.ok) {
                throw new Error('Error al obtener respuesta del servidor');
            }

            return await response.json();
        } catch (error) {
            console.error(error);
            return { type: 'error', data: 'Lo siento, hubo un error al obtener la respuesta.' };
        }
    };

    const handleSendClick = async () => {
        if (userInput.trim() !== '') {
            setChatMessages([...chatMessages, { type: 'user', text: userInput }]);
            setIsLoading(true);
            const response = await postData(userInput);
            setIsLoading(false);

            let formattedResponse = response.response || "Lo siento, no pude obtener una respuesta.";

            // Convertir los saltos de línea en <br> para HTML
            formattedResponse = formattedResponse.replace(/\n/g, '<br>');

            setChatMessages([...chatMessages, { type: 'user', text: userInput }, { type: 'bot', text: formattedResponse, source: response.source }]);
            setUserInput('');
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Mensajes del chat */}
            <div className="flex-grow overflow-y-auto p-4 bg-gray-100">
                {chatMessages.map((message, index) => (
                    <div key={index} className={`flex items-start mb-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-2 rounded ${message.type === 'user' ? 'bg-gray-300' : 'bg-gray-800 text-white'}`} dangerouslySetInnerHTML={{ __html: message.text }}></div>
                        {message.source && <a href={message.source} target="_blank" rel="noopener noreferrer" className="ml-2 underline text-blue-600">Fuente</a>}
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-center items-center mt-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
                        <span className="ml-2">Generando respuesta...</span>
                    </div>
                )}
            </div>

            {/* Espacio de entrada al pie de página */}
            <div className="border-t p-4 bg-white bottom-0 w-full">
                <div className="flex items-center justify-between mx-auto">
                    <input 
                        type="text" 
                        value={userInput} 
                        onChange={e => setUserInput(e.target.value)} 
                        className="flex-grow border rounded p-2 mr-4" 
                        placeholder="Hazme cualquier pregunta..." 
                        onKeyDown={e => {
                            if (e.key === 'Enter') {
                                handleSendClick();
                            }
                        }}
                    />
                    <button 
                        onClick={handleSendClick} 
                        className="bg-gray-800 text-white p-2 rounded hover:bg-gray-500 transition duration-200"
                    >
                        <FaPaperPlane />
                    </button>
                </div>
            </div>
        </div>
    );
}
