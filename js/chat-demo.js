// Chat Demo Widget Implementation
class ChatDemo {
    constructor() {
        this.isOpen = false;
        this.isTyping = false;
        this.messageHistory = [];
        this.sessionKey = 'chatably_demo_session';
        
        // Predefined responses
        this.responses = {
            hola: [
                "¡Hola! 👋 Bienvenido a Dental Sonrisas. Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?",
                "¡Hola! 😊 Gracias por contactarnos. ¿Tienes alguna pregunta sobre nuestros servicios?"
            ],
            precios: [
                "Nuestros precios principales son:\n\n💰 Limpieza dental: $500\n🦷 Empaste: $800-$1,200\n✨ Blanqueamiento: $1,500\n👑 Corona: $3,500\n🦷 Implante: $8,500\n\n¿Te interesa algún tratamiento en particular?"
            ],
            horarios: [
                "Nuestros horarios de atención son:\n\n📅 Lunes a Viernes: 9:00 AM - 6:00 PM\n📅 Sábados: 9:00 AM - 2:00 PM\n📅 Domingos: Cerrado\n\n¿Te gustaría agendar una cita?"
            ],
            agendar: [
                "¡Claro! Me encantaría ayudarte a agendar tu cita. 📅\n\n¿Para qué día te gustaría agendar?\n\n✅ Mañana\n✅ Esta semana\n✅ Próxima semana\n\nTambién dime si tienes preferencia de horario."
            ],
            gracias: [
                "¡De nada! 😊 ¿Hay algo más en lo que pueda ayudarte?",
                "¡Un placer ayudarte! Si tienes más preguntas, estaré aquí."
            ],
            emergencia: [
                "⚠️ Para emergencias dentales fuera de horarios, puedes llamar al (555) 123-4567.\n\nSi es muy urgente, te recomiendo ir al hospital más cercano."
            ],
            ubicacion: [
                "📍 Nos encontramos en:\n\nAv. Revolución 1234, Col. Centro\nCiudad de México, CDMX\n\nEstamos cerca del metro Revolución, línea 2."
            ],
            default: [
                "Gracias por tu mensaje. Un especialista se pondrá en contacto contigo pronto para darte información más detallada. 😊",
                "Entiendo tu consulta. ¿Te gustaría que un especialista te llame para darte más información?",
                "Disculpa, no tengo información específica sobre eso, pero puedo conectarte con uno de nuestros especialistas. ¿Te parece bien?"
            ]
        };

        this.init();
    }

    init() {
        this.setupEventListeners();
        this.loadChatHistory();
        this.showInitialNotification();
    }

    setupEventListeners() {
        const chatToggle = document.getElementById('chat-toggle');
        const chatMinimize = document.getElementById('chat-minimize');
        const chatInput = document.getElementById('chat-input');
        const chatSend = document.getElementById('chat-send');
        const chatReset = document.getElementById('chat-reset');
        const quickReplies = document.querySelectorAll('.quick-reply');

        // Toggle chat window
        chatToggle.addEventListener('click', () => this.toggleChat());
        chatMinimize.addEventListener('click', () => this.closeChat());

        // Input handling
        chatInput.addEventListener('input', (e) => this.handleInputChange(e));
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                this.sendMessage();
            }
        });

        // Send button
        chatSend.addEventListener('click', () => this.sendMessage());

        // Quick replies
        quickReplies.forEach(button => {
            button.addEventListener('click', (e) => {
                const message = e.target.dataset.message;
                this.sendQuickReply(message);
            });
        });

        // Reset chat
        chatReset.addEventListener('click', () => this.resetChat());

        // Prevent chat from closing when clicking inside
        document.getElementById('chat-window').addEventListener('click', (e) => {
            e.stopPropagation();
        });
    }

    toggleChat() {
        if (this.isOpen) {
            this.closeChat();
        } else {
            this.openChat();
        }
    }

    openChat() {
        const chatWindow = document.getElementById('chat-window');
        const chatIcon = document.querySelector('.chat-icon');
        const chatClose = document.querySelector('.chat-close');
        const notification = document.getElementById('chat-notification');

        chatWindow.classList.add('open');
        chatIcon.style.display = 'none';
        chatClose.style.display = 'flex';
        notification.style.display = 'none';
        
        this.isOpen = true;
        this.scrollToBottom();
        
        // Focus input
        document.getElementById('chat-input').focus();
    }

    closeChat() {
        const chatWindow = document.getElementById('chat-window');
        const chatIcon = document.querySelector('.chat-icon');
        const chatClose = document.querySelector('.chat-close');

        chatWindow.classList.remove('open');
        chatIcon.style.display = 'flex';
        chatClose.style.display = 'none';
        
        this.isOpen = false;
    }

    handleInputChange(e) {
        const sendButton = document.getElementById('chat-send');
        const hasContent = e.target.value.trim().length > 0;
        sendButton.disabled = !hasContent;
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (message) {
            this.addMessage(message, 'user');
            input.value = '';
            document.getElementById('chat-send').disabled = true;
            
            // Show typing and respond
            setTimeout(() => this.showTyping(), 500);
            setTimeout(() => this.generateResponse(message), 1500);
        }
    }

    sendQuickReply(message) {
        this.addMessage(this.getQuickReplyText(message), 'user');
        
        // Show typing and respond
        setTimeout(() => this.showTyping(), 500);
        setTimeout(() => this.generateResponse(message), 1500);
    }

    getQuickReplyText(key) {
        const quickReplyTexts = {
            hola: "Hola",
            precios: "¿Cuáles son sus precios?",
            horarios: "¿Cuáles son sus horarios?",
            agendar: "Quiero agendar una cita"
        };
        return quickReplyTexts[key] || key;
    }

    addMessage(content, sender) {
        const messagesContainer = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message', sender);
        
        const now = new Date();
        const timeString = now.toLocaleTimeString('es-MX', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });

        messageElement.innerHTML = `
            <div class="message-content">${content}</div>
            <div class="message-time">${timeString}</div>
        `;

        messagesContainer.appendChild(messageElement);
        
        // Save to history
        this.messageHistory.push({
            content,
            sender,
            timestamp: now.toISOString()
        });
        
        this.saveChatHistory();
        this.scrollToBottom();
    }

    showTyping() {
        const typingElement = document.getElementById('chat-typing');
        typingElement.style.display = 'flex';
        this.isTyping = true;
        this.scrollToBottom();
    }

    hideTyping() {
        const typingElement = document.getElementById('chat-typing');
        typingElement.style.display = 'none';
        this.isTyping = false;
    }

    generateResponse(userMessage) {
        this.hideTyping();
        
        const message = userMessage.toLowerCase();
        let response;

        // Check for specific keywords
        if (message.includes('hola') || message.includes('hi') || message.includes('buenos')) {
            response = this.getRandomResponse('hola');
        } else if (message.includes('precio') || message.includes('costo') || message.includes('cuanto')) {
            response = this.getRandomResponse('precios');
        } else if (message.includes('horario') || message.includes('hora') || message.includes('cuando')) {
            response = this.getRandomResponse('horarios');
        } else if (message.includes('agendar') || message.includes('cita') || message.includes('reservar')) {
            response = this.getRandomResponse('agendar');
        } else if (message.includes('gracias') || message.includes('thank')) {
            response = this.getRandomResponse('gracias');
        } else if (message.includes('emergencia') || message.includes('urgente') || message.includes('dolor')) {
            response = this.getRandomResponse('emergencia');
        } else if (message.includes('donde') || message.includes('ubicacion') || message.includes('direccion')) {
            response = this.getRandomResponse('ubicacion');
        } else {
            response = this.getRandomResponse('default');
        }

        this.addMessage(response, 'bot');
    }

    getRandomResponse(category) {
        const responses = this.responses[category] || this.responses.default;
        return responses[Math.floor(Math.random() * responses.length)];
    }

    scrollToBottom() {
        const messagesContainer = document.getElementById('chat-messages');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    resetChat() {
        if (confirm('¿Estás seguro de que quieres reiniciar la demo?')) {
            // Clear messages
            const messagesContainer = document.getElementById('chat-messages');
            messagesContainer.innerHTML = `
                <div class="chat-message bot">
                    <div class="message-content">
                        ¡Hola! 👋 Bienvenido a la demo de Chatably. Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?
                    </div>
                    <div class="message-time">Ahora</div>
                </div>
            `;
            
            // Clear history
            this.messageHistory = [];
            sessionStorage.removeItem(this.sessionKey);
            
            // Clear input
            const input = document.getElementById('chat-input');
            input.value = '';
            document.getElementById('chat-send').disabled = true;
            
            // Show notification again
            setTimeout(() => this.showInitialNotification(), 2000);
        }
    }

    showInitialNotification() {
        if (!this.isOpen && this.messageHistory.length === 0) {
            const notification = document.getElementById('chat-notification');
            notification.style.display = 'flex';
            
            // Auto-hide after 10 seconds
            setTimeout(() => {
                if (!this.isOpen) {
                    notification.style.display = 'none';
                }
            }, 10000);
        }
    }

    saveChatHistory() {
        try {
            sessionStorage.setItem(this.sessionKey, JSON.stringify(this.messageHistory));
        } catch (e) {
            console.log('Could not save chat history:', e);
        }
    }

    loadChatHistory() {
        try {
            const saved = sessionStorage.getItem(this.sessionKey);
            if (saved) {
                this.messageHistory = JSON.parse(saved);
                this.restoreChatHistory();
            }
        } catch (e) {
            console.log('Could not load chat history:', e);
        }
    }

    restoreChatHistory() {
        if (this.messageHistory.length > 1) { // More than just the initial message
            const messagesContainer = document.getElementById('chat-messages');
            messagesContainer.innerHTML = '';
            
            // Add initial message
            const initialMessage = document.createElement('div');
            initialMessage.classList.add('chat-message', 'bot');
            initialMessage.innerHTML = `
                <div class="message-content">
                    ¡Hola! 👋 Bienvenido a la demo de Chatably. Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?
                </div>
                <div class="message-time">Ahora</div>
            `;
            messagesContainer.appendChild(initialMessage);
            
            // Restore saved messages
            this.messageHistory.forEach(msg => {
                if (msg.content !== "¡Hola! 👋 Bienvenido a la demo de Chatably. Soy tu asistente virtual. ¿En qué puedo ayudarte hoy?") {
                    const messageElement = document.createElement('div');
                    messageElement.classList.add('chat-message', msg.sender);
                    
                    const timestamp = new Date(msg.timestamp);
                    const timeString = timestamp.toLocaleTimeString('es-MX', { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                    });
                    
                    messageElement.innerHTML = `
                        <div class="message-content">${msg.content}</div>
                        <div class="message-time">${timeString}</div>
                    `;
                    
                    messagesContainer.appendChild(messageElement);
                }
            });
            
            this.scrollToBottom();
        }
    }
}

// Initialize chat demo when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatDemo();
});

// Analytics tracking for demo interactions
function trackChatInteraction(action, data = {}) {
    // You can integrate with Google Analytics, Mixpanel, or other analytics
    if (typeof gtag !== 'undefined') {
        gtag('event', 'chat_demo_interaction', {
            'action': action,
            'chat_data': JSON.stringify(data)
        });
    }
    
    console.log('Chat Demo Interaction:', action, data);
}

// Export for potential use in other scripts
window.ChatDemo = ChatDemo;