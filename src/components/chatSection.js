import React, { useState } from "react";

export function ChatTopics() {
    const [userInput, setUserInput] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [selectedTopic, setSelectedTopic] = useState(null);

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
        'Historia': (input) => fetchData(`${process.env.REACT_APP_URL}/getHistory?query=${encodeURIComponent(input)}`),
        'Organigrama': async (input) => {
            if (input.startsWith('¿Cuál es el rol de')) {
                const employeeName = input.replace('¿Cuál es el rol de ', '').replace('?', '');
                return fetchData(`${process.env.REACT_APP_URL}/getRole?name=${encodeURIComponent(employeeName)}`);
            } else if (input.startsWith('Dime quiénes conforman el equipo de')) {
                const cityName = input.replace('Dime quiénes conforman el equipo de ', '').replace('?', '');
                const respuesta = await fetchData(`${process.env.REACT_APP_URL}/getTeam?city=${encodeURIComponent(cityName)}`);
                return respuesta.team;
            }
        },
        'Nuestro Brief': (input) => fetchData(`${process.env.REACT_APP_URL}/getBrief?query=${encodeURIComponent(input)}`)
    };

    const handleSendClick = async () => {
        if (userInput.trim() !== '') {
            setChatMessages([...chatMessages, { type: 'user', text: userInput }]);

            const dataSource = topicDataSources[selectedTopic];
            if (dataSource) {
                const response = await dataSource(userInput);

                setChatMessages([...chatMessages, { type: 'user', text: userInput }, { type: 'bot', text: response.data || response }]);
            }

            setUserInput('');
        }
    };

    const handleTopicClick = (topic) => {
        setSelectedTopic(topic);
        setChatMessages([]);
    };

    const topics = [
        {
            heading: 'Historia',
            questions: []
        },
        {
            heading: 'Organigrama',
            questions: [
                '¿Cuál es el rol de [nombre de empleado]?',
                'Dime quiénes conforman el equipo de [Ciudad]'
            ]
        },
        {
            heading: 'Nuestro Brief',
            questions: []
        }
    ];

    return (
        <div className="mx-auto max-w-2xl px-4">
            <div className="rounded-lg border bg-background p-8">
                <h1 className="mb-2 text-lg font-semibold">
                    ¡Hola! Puedes preguntarme sobre:
                </h1>
                <div className="mt-4 flex flex-col items-start space-y-2">
                    {topics.map((topic, index) => (
                        <div key={index}>
                            <button
                                className="text-base focus:outline-none hover:underline"
                                onClick={() => handleTopicClick(topic.heading)}
                            >
                                {topic.heading}
                            </button>
                            {selectedTopic === topic.heading && topic.questions.map((question, qIndex) => (
                                <div key={qIndex} className="ml-4">
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
            
            {/* Renderizar mensajes del chat */}
            <div className="mt-4 rounded-lg border p-4">
                {chatMessages.map((message, index) => (
                    <div key={index} className={`p-2 my-2 rounded-md ${message.type === 'user' ? 'bg-gray-300' : 'bg-green-500 text-white'}`}>
                        {message.text}
                    </div>
                ))}
            </div>

            {/* Espacio de entrada al pie de página */}
            <div className="mt-4 flex justify-between items-center">
                <input 
                    type="text" 
                    value={userInput} 
                    onChange={e => setUserInput(e.target.value)} 
                    className="border rounded w-3/4 p-2" 
                    placeholder="Escribe tu pregunta..." 
                    onKeyDown={e => {
                        if (e.key === 'Enter') {
                            handleSendClick();
                        }
                    }}
                />
                <button 
                    onClick={handleSendClick} 
                    className="ml-4 bg-blue-500 text-white p-2 rounded"
                >
                    Enviar
                </button>
            </div>
        </div>
    );
}
