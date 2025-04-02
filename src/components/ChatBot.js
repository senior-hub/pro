<<<<<<< HEAD
import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
function ChatBot() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]); // Chat history

  

    const sendMessage = async () => {
        if (!message.trim()) return;
    
        setChat(prev => [...prev, { role: "user", message }]);
        setMessage("");
    
        try {
            const res = await axios.post(
                "http://localhost:8000/chatbot.php",
                { message },
                { withCredentials: true } // ✅ Ensure cookies are sent
            );
    
            const botMessage = res.data.message || "No response from bot.";
            setChat(prev => [...prev, { role: "bot", message: botMessage }]);
        } catch (error) {
            console.error("Error:", error);
            setChat(prev => [...prev, { role: "bot", message: "Error communicating with chatbot." }]);
        }
    };
    

    const fetchChatHistory = async () => {
        try {
            const res = await axios.get("http://localhost:8000/get_chat_history.php", {
                withCredentials: true
            });

            if (res.data.error) {
                alert(res.data.error);
                return;
            }

            const history = res.data.messages.map(msg => ({
                role: msg.role,
                message: msg.message
            }));

            setChat(history);  // Replace current chat with history
        } catch (error) {
            console.error("Error fetching chat history:", error);
            alert("Failed to load chat history.");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.chatbox}>
                <header style={styles.header}>
                    <h2 style={styles.title}>Fitness Chatbot</h2>
                    <button onClick={fetchChatHistory} style={styles.historyButton}>
                        📜 Retrieve All Messages
                    </button>
                </header>
                <div style={styles.chatArea}>
                    {chat.map((msg, index) => (
                        <div
                            key={index}
                            style={msg.role === "user" ? styles.userMessage : styles.botMessage}
                        >
                            {msg.role === "user" ? "👤" : "🤖"} {msg.message}
                        </div>
                    ))}
                </div>
                <div style={styles.inputArea}>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask something..."
                        style={styles.input}
                    />
                    <button onClick={sendMessage} style={styles.sendButton}>
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#f0f2f5",
        margin: 0,
        fontFamily: "Arial, sans-serif",
    },
    chatbox: {
        width: "400px",
        height: "600px",
        backgroundColor: "white",
        borderRadius: "15px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
    },
    header: {
        backgroundColor: "#007bff",
        color: "white",
        padding: "15px",
        textAlign: "center",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    title: {
        margin: 0,
        fontSize: "18px",
    },
    historyButton: {
        padding: "5px 10px",
        fontSize: "12px",
        cursor: "pointer",
        borderRadius: "5px",
        border: "1px solid white",
        backgroundColor: "#0056b3",
        color: "white"
    },
    chatArea: {
        flex: 1,
        padding: "15px",
        overflowY: "auto",
        backgroundColor: "#f9f9f9",
        display: "flex",
        flexDirection: "column",
        gap: "8px"
    },
    userMessage: {
        alignSelf: "flex-end",
        backgroundColor: "#dcf8c6",
        padding: "10px",
        borderRadius: "10px",
        maxWidth: "80%",
    },
    botMessage: {
        alignSelf: "flex-start",
        backgroundColor: "#e1f5fe",
        padding: "10px",
        borderRadius: "10px",
        maxWidth: "80%",
    },
    inputArea: {
        display: "flex",
        padding: "10px",
        backgroundColor: "#f0f2f5",
        borderTop: "1px solid #ddd",
    },
    input: {
        flex: 1,
        padding: "10px",
        borderRadius: "20px",
        border: "1px solid #ddd",
        outline: "none",
        fontSize: "14px",
    },
    sendButton: {
        marginLeft: "10px",
        padding: "10px 20px",
        borderRadius: "20px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        cursor: "pointer",
        fontSize: "14px",
    },
};

export default ChatBot;
=======
import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Sidebar from "./Sidebar";
import '@fortawesome/fontawesome-free/css/all.min.css';
import "../style/ChatBot.css";

const ChatBot = () => {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [showHistoryHeader, setShowHistoryHeader] = useState(false);
  
  const chatEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Scroll to bottom when messages change
  useEffect(() => {
    if (chatEndRef.current) {
      chatEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chat]);

  // Monitor scroll position for showing scroll button
  useEffect(() => {
    const checkScroll = () => {
      if (chatContainerRef.current) {
        const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current;
        const isScrolled = scrollHeight - scrollTop > clientHeight + 100;
        setShowScrollButton(isScrolled);
      }
    };

    const container = chatContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkScroll);
      return () => container.removeEventListener('scroll', checkScroll);
    }
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const formatTimestamp = (dateString) => {
    if (!dateString) return "";
    
    const date = new Date(dateString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = { role: "user", message: message.trim(), created_at: new Date().toISOString() };
    setChat(prev => [...prev, userMessage]);
    setMessage("");
    setIsLoading(true);

    try {
      // Show typing indicator and scroll to it
      setTimeout(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);

      const res = await axios.post(
        "http://localhost:8000/chatbot.php",
        { message: userMessage.message },
        { withCredentials: true }
      );

      const botMessage = res.data.message || "I'm having trouble processing that request.";
      const timestamp = new Date().toISOString();
      setChat(prev => [...prev, { 
        role: "bot", 
        message: botMessage,
        created_at: timestamp
      }]);
    } catch (error) {
      console.error("Error:", error);
      setChat(prev => [
        ...prev, 
        { 
          role: "bot", 
          message: "Sorry, I'm having trouble connecting to my knowledge base right now. Please try again later.",
          created_at: new Date().toISOString()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchChatHistory = async () => {
    setLoadingHistory(true);
    try {
      const res = await axios.get("http://localhost:8000/get_chat_history.php", {
        withCredentials: true
      });

      if (res.data.error) {
        console.error(res.data.error);
        return;
      }

      const history = res.data.messages || [];
      
      if (history.length > 0) {
        setChat(history);
        setShowHistoryHeader(true);
        
        // Hide the history header after a delay
        setTimeout(() => {
          setShowHistoryHeader(false);
        }, 3000);
      } else {
        // Show a bot message indicating no history
        setChat([{
          role: "bot", 
          message: "You don't have any chat history yet. Start a conversation!",
          created_at: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
      // Show error message in chat
      setChat([{
        role: "bot", 
        message: "Sorry, I couldn't retrieve your chat history. Please try again later.",
        created_at: new Date().toISOString()
      }]);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const getRandomTips = () => {
    const tips = [
      "Try asking about workout routines for specific muscle groups.",
      "Ask me about nutrition advice for your fitness goals.",
      "I can help you understand different exercise techniques.",
      "Ask about recovery strategies between workouts.",
      "I can suggest exercises for beginners or advanced athletes.",
      "Ask for meal plan ideas based on your dietary preferences.",
      "I can provide information about proper form for exercises.",
      "Ask how to track your fitness progress effectively."
    ];
    return tips[Math.floor(Math.random() * tips.length)];
  };

  return (
    <div className="page-container">
      <Sidebar />
      
      <div className="with-sidebar">
        <div className="chatbot-wrapper">
          <div className="chatbot-container">
            <div className="chatbot-header">
              <h2 className="chatbot-title">
                <i className="fas fa-robot"></i> GlowFit AI Fitness Assistant
              </h2>
              <div className="chatbot-actions">
                <button 
                  className="chatbot-button"
                  onClick={fetchChatHistory}
                  disabled={loadingHistory}
                >
                  {loadingHistory ? (
                    <>
                      <div className="button-spinner"></div> Loading...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-history"></i> Load History
                    </>
                  )}
                </button>
              </div>
            </div>
            
            <div className="chatbot-messages" ref={chatContainerRef}>
              {showHistoryHeader && (
                <div className="history-header">
                  <i className="fas fa-clock"></i> Showing your conversation history
                </div>
              )}
              
              {chat.length === 0 ? (
                <div className="chatbot-welcome">
                  <div className="welcome-icon">
                    <i className="fas fa-dumbbell"></i>
                  </div>
                  <h3>Welcome to GlowFit AI Assistant!</h3>
                  <p>Ask me anything about fitness, workouts, or nutrition.</p>
                  <div className="chatbot-tip">
                    <i className="fas fa-lightbulb"></i> 
                    <span>Tip: {getRandomTips()}</span>
                  </div>
                </div>
              ) : (
                chat.map((msg, index) => (
                  <div
                    key={index}
                    className={`message ${msg.role === "user" ? "user-message" : "bot-message"}`}
                  >
                    <div className="message-avatar">
                      {msg.role === "user" ? (
                        <i className="fas fa-user"></i>
                      ) : (
                        <i className="fas fa-robot"></i>
                      )}
                    </div>
                    <div>
                      <div className="message-content">
                        {msg.message}
                      </div>
                      {msg.created_at && (
                        <div className="message-timestamp">
                          {formatTimestamp(msg.created_at)}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
              
              {isLoading && (
                <div className="message bot-message">
                  <div className="message-avatar">
                    <i className="fas fa-robot"></i>
                  </div>
                  <div className="message-content typing-indicator">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef}></div>
              
              {showScrollButton && (
                <button className="scroll-to-bottom" onClick={scrollToBottom}>
                  <i className="fas fa-arrow-down"></i>
                </button>
              )}
            </div>
            
            <div className="chatbot-input-area">
              <textarea
                className="chatbot-input"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Ask me about fitness or nutrition..."
                disabled={isLoading}
              />
              <button 
                className="chatbot-send-button" 
                onClick={sendMessage}
                disabled={isLoading || !message.trim()}
                aria-label="Send message"
              >
                {isLoading ? (
                  <div className="button-spinner"></div>
                ) : (
                  <i className="fas fa-paper-plane"></i>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
>>>>>>> copy-enhanced-ui-chatbot-changes
