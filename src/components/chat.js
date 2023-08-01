import React, { useEffect, useRef, useState } from "react";
import {
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBCard,
  MDBCardBody,
  MDBBtn,
  MDBTypography,
} from "mdb-react-ui-kit";
import "./chat.css";
import logo from "./after-logo.png";
import blumb from "./blumb-logo.png";
import { data } from "./data";

export default function App() {
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState(data);
  const containerRef = useRef(null);

  const handleSendMessage = () => {
    const updatedMessages = [...messages, { text: newMessage, sent: true }];
    setMessages(updatedMessages);
    setNewMessage("");
  };

  useEffect(() => {
    scrollToBottom();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    if (containerRef.current) {
      const container = containerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  };
  return (
    <MDBContainer fluid className="py-4 gradient-custom h-100">
      <MDBRow className="justify-content-center">
        <MDBCol md="6" lg="10" xl="10">
          <div className="mb-6">
            <img src={logo} width={80} />
          </div>
          <MDBTypography listUnStyled className="text-white">
            <div ref={containerRef} className="h-max-300px overflow-y-scroll">
              {messages?.map((message, index) => (
                <div
                  key={index}
                  className={`d-flex mb-3 gap-2 message ${
                    message.sent === true ? "sent flex-reverse" : "received"
                  }`}
                >
                  <img
                    src={
                      message.sent
                        ? blumb
                        : "https://mdbcdn.b-cdn.net/img/Photos/Avatars/avatar-5.webp"
                    }
                    alt="avatar"
                    className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
                    width="60"
                  />
                  <MDBCard className="mask-custom w-100">
                    <MDBCardBody className="p-3 d-flex gap-1">
                      <p className="fw-bold mb-0">
                        {message.sent ? "Blumb -" : "You -"}
                      </p>
                      <p className="mb-0">{message.text}</p>
                    </MDBCardBody>
                  </MDBCard>
                </div>
              ))}
            </div>
            <li className="mt-3 border-top">
              <textarea
                className="form-control p-3 mt-3"
                placeholder="Type your message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
            </li>
            <MDBBtn
              onClick={handleSendMessage}
              color="light"
              size="md"
              rounded
              className="float-end mt-2"
            >
              Send
            </MDBBtn>
          </MDBTypography>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
}
