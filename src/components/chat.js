import React, { useEffect, useRef, useState } from "react";
import { exampleMessages } from "./data";
import { FaTwitter, FaLinkedin, FaInstagram, FaGlobe, FaEnvelope, FaBook, FaHistory, FaSitemap, FaQuestion, FaRegCommentDots } from 'react-icons/fa';
import logo from './after-logo.png'
import { ChatTopics } from '../components/chatSection';

export default function App() {
  const [messages, setMessages] = useState([]);
  const [pdfUrl, setPdfUrl] = useState(null);
  const containerRef = useRef(null);

  const socialLinks = [
    { name: 'Twitter', icon: <FaTwitter />, url: 'https://twitter.com/SomosAfter' },
    { name: 'LinkedIn', icon: <FaLinkedin />, url: 'https://linkedin.com/company/somosafter' },
    { name: 'Instagram', icon: <FaInstagram />, url: 'https://instagram.com/somosafter' },
    { name: 'Web', icon: <FaGlobe />, url: 'https://after.green' },
    { name: 'Newsletter', icon: <FaEnvelope />, url: 'https://after.green/es/category/magazine/' },
  ];

  // Iconos para las opciones
  const optionIcons = {
    historia: <FaHistory />,
    organigrama: <FaSitemap />,
    brief: <FaBook />,
    canales: <FaQuestion />,
    chat: <FaRegCommentDots />,

    // Agrega otros íconos según las opciones que tengas
  };


  const fetchResponseFromServer = async (topic) => {
    const url = process.env.REACT_APP_URL+`/pregunta?topic=${encodeURIComponent(topic)}`;
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
  
      const data = await response.json();
      if (data.respuesta.type === 'iframe') {
        setPdfUrl(data.respuesta.data);
        return { type: 'iframe', data: data.respuesta.data };
      } else if (data.respuesta.type === 'text') {
        setPdfUrl(null);  // Asegurarse de que el componente PDF se oculte
        return { type: 'text', data: data.respuesta.data };
      }
    } catch (error) {
      console.error(error);
      return { type: 'error', data: 'Lo siento, hubo un error al obtener la respuesta.' };
    }
  };

  const handleButtonPress = async (buttonText) => {
    if (buttonText === 'canales') {
      setMessages([{ text: 'Canales de After', type: 'social_links' }]);
      setPdfUrl(null);
    } else if(buttonText === 'chat'){
      setMessages([]); // Limpiar mensajes anteriores
      setPdfUrl(null); // Asegurarse de que el componente PDF se oculte
    }
    else{
      const response = await fetchResponseFromServer(buttonText);
      if (response.type === 'iframe') {
        setPdfUrl(response.data);
        setMessages([]);
      } else if (response.type === 'text') {
        setMessages([{ text: response.data, type: 'text' }]);
        setPdfUrl(null);
      } else if (response.type === 'error') {
        setMessages([{ text: response.data, type: 'text' }]);
        setPdfUrl(null);
      }
    }
  };
  

  useEffect(() => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-screen flex">
      {/* Sidebar */}
      <div className="w-1/4 bg-black p-4 flex flex-col">
        <img src={logo} alt="After Logo" className="mb-4 w-32 mx-auto" />
        <h2 className="text-white text-xl mb-4 text-center">Oráculo de empresa</h2>
        <div className="flex-1 overflow-y-auto">
          {exampleMessages.map((message, index) => (
            <button
              key={index}
              className="flex items-center gap-3 block w-full text-left text-white hover:bg-gray-800 focus:outline-none mb-3 p-2 rounded"
              onClick={() => handleButtonPress(message.topic)}
            >
              {optionIcons[message.topic]}
              {message.heading}
            </button>
          ))}
        </div>
      </div>

      {/* Content Area */}
      <div className="w-3/4 p-8 flex items-center justify-center bg-gray-100">
        <div ref={containerRef} className="overflow-y-auto w-full h-full">
          {pdfUrl && (
            <div className="w-full h-full">
              <iframe src={pdfUrl} width="100%" height="100%" title="Document Viewer" frameBorder="0"></iframe>
            </div>
          )}
          {messages.map((message, index) => (
            <div key={index} className="flex items-start mb-2">
              {message.type === 'social_links' ? (
                <div className="w-full flex flex-col items-start">
                  {socialLinks.map((link, idx) => (
                    <a key={idx} href={link.url} target="_blank" rel="noopener noreferrer" className="flex items-center mb-2 hover:underline">
                      {link.icon}
                      <span className="ml-2">{link.name}</span>
                    </a>
                  ))}
                </div>
              ) : (
                <div className="p-4 rounded bg-white shadow text-gray-800">
                  <div style={{ whiteSpace: 'pre-line' }}>
                    {message.text}
                  </div>
                </div>
              )}
            </div>
          ))}
          {messages.length === 0 && !pdfUrl && (
          <ChatTopics onSelectTopic={() => {}} onQuestionSelect={() => {}} />
        )}
        </div>
      </div>
    </div>
  );
}