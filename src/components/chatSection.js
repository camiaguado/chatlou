import React, { useState } from "react";
import { FaMagic, FaPaperPlane } from 'react-icons/fa'; // Importar el ícono FaPaperPlane



export function ChatTopics() {
    const [userInput, setUserInput] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [isLoading, setIsLoading] = useState(false); // Estado para el indicador de carga


    const fetchData = async (url) => {
        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                },
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

    const topicDataSources = {
        'Historia de After': (input) => fetchData(`${process.env.REACT_APP_URL}/getHistory?query=${encodeURIComponent(input)}`),
        'Empleados y ubicación': async (input) => {
            const normalizedInput = normalizeText(input);
            if (normalizedInput.startsWith('quien es')) {
                const employeeName = normalizedInput.replace(/quien es /i, '').replace('?', ''); // Usamos una expresión regular con el flag 'i' para que sea insensible a mayúsculas/minúsculas
                const response = await fetchData(`${process.env.REACT_APP_URL}/getRole?name=${encodeURIComponent(employeeName)}`);
                return response.data || response;
            } else if (normalizedInput.startsWith('quienes trabajan en')) {
                const cityName = normalizedInput.replace(/quienes trabajan en /i, '').replace('?', '');
                const respuesta = await fetchData(`${process.env.REACT_APP_URL}/getTeam?city=${encodeURIComponent(cityName)}`);
                return respuesta.team;
            }
        },
        'Nuestro Brief': (input) => fetchData(`${process.env.REACT_APP_URL}/getBrief?query=${encodeURIComponent(input)}`)
    };

    function normalizeText(text) {
        return text
            .normalize("NFD") // Descompone caracteres acentuados en su forma canónica
            .replace(/[\u0300-\u036f]/g, "") // Elimina los acentos
            .toLowerCase(); // Convierte todo a minúsculas
    }

    const handleSendClick = async () => {
        if (userInput.trim() !== '') {
            setChatMessages([...chatMessages, { type: 'user', text: userInput }]);
        
            const dataSource = topicDataSources[selectedTopic];
            if (dataSource) {
                setIsLoading(true); // Mostrar el indicador de carga
                const response = await dataSource(userInput);
                setIsLoading(false); // Ocultar el indicador de carga después de recibir la respuesta

                let formattedResponse;
                
                // Verifica si la respuesta tiene una propiedad 'data'
                if (response && response.data) {
                    formattedResponse = response.data;
                } else if (response) {
                    formattedResponse = response;
                } else {
                    formattedResponse = "Lo siento, no pude obtener una respuesta.";
                }
        
                // Si la respuesta es un array, conviértelo en una lista
                if (Array.isArray(formattedResponse)) {
                    formattedResponse = formattedResponse.map(item => `<li>${item}</li>`).join('');
                    formattedResponse = `<ul>${formattedResponse}</ul>`;
                }
        
                // Convertir los saltos de línea en <br> para HTML
                formattedResponse = formattedResponse.replace(/\n/g, '<br>');
        
                setChatMessages([...chatMessages, { type: 'user', text: userInput }, { type: 'bot', text: formattedResponse }]);
            }
        
            setUserInput('');
        }
    };
    
    const handleTopicClick = (topic) => {
        let message;
        setSelectedTopic(topic.heading);
        switch(topic.id){
            case 'historia':
                message = 'Hola, hazme preguntas sobre la historia de after.'
                break;
            case 'organigrama':
                message = 'Haz click sobre las preguntas ya definidas arriba y editala.'
                break;
            case 'brief':
                message = '¿Qué te gustaría saber sobre la estructura de nuestro Brief?'
                break;
            default:
                message = '¡Hola! elige un tema para consultar'
        }
        setChatMessages([{ type: 'bot', text: `${message}` }]);
    };

    const topics = [
        {
            id: 'historia',
            heading: 'Historia de After',
            questions: []
        },
        {   
            id: 'organigrama',
            heading: 'Empleados y ubicación',
            questions: [
                'Quién es [nombre de empleado]',
                'Quiénes trabajan en [Ciudad]',
            ]
        },
        {
            id: 'brief',
            heading: 'Nuestro Brief',
            questions: []
        }
    ];

    return (
        <div className="flex flex-col h-full">
            {/* Sección de temas */}
            <div className="p-4 bg-white shadow-md mb-4">
                <h1 className="mb-2 text-lg font-semibold">
                ¡Hola! Elige un tema sobre el cual quieras preguntar:
                </h1>
                <div className="mt-4">
                    {topics.map((topic, index) => (
                        <div key={index}>
                            <button
                                className={`block text-lg focus:outline-none mb-2 ${selectedTopic === topic.heading ? 'font-bold text-gray-800' : 'hover:underline'}`}
                                onClick={() => handleTopicClick(topic)}
                            >
                                {topic.heading}
                            </button>
                            {selectedTopic === topic.heading && topic.questions.map((question, qIndex) => (
                                <div key={qIndex} className="ml-4 mb-2">
                                    <button
                                        className="text-sm focus:outline-none hover:underline"
                                        onClick={() => setUserInput(question)}
                                    >
                                        {question}
                                    </button>
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
            
             {/* Mensajes del chat */}
             <div className="flex-grow overflow-y-auto p-4 bg-gray-100">
                {chatMessages.map((message, index) => (
                    <div key={index} className={`flex items-start mb-2 ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {message.type === 'bot' && <FaMagic className="h-5 w-5 text-gray-800 mr-2" />}
                        <div 
    className={`p-2 rounded ${message.type === 'user' ? 'bg-gray-300' : 'bg-gray-800 text-white'}`} 
    dangerouslySetInnerHTML={{ __html: message.text }}
></div>
                    </div>
                ))}
                {isLoading && ( // Mostrar el indicador de carga si isLoading es true
                    <div className="flex justify-center items-center mt-4">
                        <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-900"></div>
                        <span className="ml-2">Generando respuesta...</span>
                    </div>
                )}
            </div>

           {/* Espacio de entrada al pie de página */}
           <div className="border-t p-4 bg-white bottom-0 w-full">
                <div className="flex items-center justify-between mx-auto"> {/* Agregado para centrar el área de entrada */}
                    <input 
                        type="text" 
                        value={userInput} 
                        onChange={e => setUserInput(e.target.value)} 
                        className="flex-grow border rounded p-2 mr-4" 
                        placeholder="Escribe tu pregunta..." 
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
                        <FaPaperPlane /> {/* Ícono de enviar */}
                    </button>
                </div>
            </div>
        </div>
    );
}