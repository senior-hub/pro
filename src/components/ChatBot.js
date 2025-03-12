import { useState } from "react";
import axios from "axios";

function ChatBot() {
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([]); // Chat history

    const sendMessage = async () => {
        if (!message.trim()) return;

        setChat(prev => [...prev, { role: "user", message }]);
        setMessage("");

        try {
            const res = await axios.post(
                "http://localhost:8080/chatbot.php",
                { message },
                { withCredentials: true }
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
            const res = await axios.get("http://localhost:8080/get_chat_history.php", {
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
