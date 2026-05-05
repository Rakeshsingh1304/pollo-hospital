/**
 * Pollo Hospital Main Script
 * Integrated Interactivity: Sticky Navbar, Scroll Reveal, Testimonial Carousel, AI Chatbot, Appointment Booking.
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Sticky Navbar Logic ---
    const navbar = document.getElementById('navbar');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // --- 2. Scroll Reveal Animations ---
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in-up').forEach(el => revealObserver.observe(el));

    // --- 3. Mobile Menu Toggle ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const navLinks = document.getElementById('nav-links');

    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileMenuBtn.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.replace('fa-bars', 'fa-times');
            } else {
                icon.classList.replace('fa-times', 'fa-bars');
            }
        });
    }

    // --- 4. Testimonial Carousel ---
    const track = document.getElementById('testi-track');
    const items = document.querySelectorAll('.testimonial-item');
    const nextBtn = document.getElementById('testi-next');
    const prevBtn = document.getElementById('testi-prev');
    let currentIndex = 0;

    function updateCarousel() {
        const width = items[0].getBoundingClientRect().width;
        track.style.transform = `translateX(-${currentIndex * width}px)`;
    }

    if (nextBtn && prevBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % items.length;
            updateCarousel();
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + items.length) % items.length;
            updateCarousel();
        });
    }

    // --- 5. Appointment Booking Modal ---
    const bookModal = document.getElementById('booking-modal');
    const closeBooking = document.getElementById('close-booking');
    const bookingTriggers = document.querySelectorAll('a[href="#book-appointment"]');

    bookingTriggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            bookModal.classList.add('show');
        });
    });

    if (closeBooking) {
        closeBooking.addEventListener('click', () => {
            bookModal.classList.remove('show');
        });
    }

    window.addEventListener('click', (e) => {
        if (e.target === bookModal) bookModal.classList.remove('show');
    });

    const bookingForm = document.getElementById('booking-form-modal');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();
            bookingForm.style.display = 'none';
            document.getElementById('booking-success').style.display = 'block';
            setTimeout(() => {
                bookModal.classList.remove('show');
                // Reset form
                setTimeout(() => {
                    bookingForm.reset();
                    bookingForm.style.display = 'block';
                    document.getElementById('booking-success').style.display = 'none';
                }, 500);
            }, 3000);
        });
    }

    // --- 6. AI CHATBOT (MediAssist AI) LOGIC ---
    const chatToggle = document.getElementById('chat-toggle-btn');
    const chatWindow = document.getElementById('chat-window');
    const closeChat = document.getElementById('close-chat');
    const chatBody = document.getElementById('chat-body');
    const typingIndicator = document.getElementById('typing-indicator');
    const chatInputArea = document.getElementById('chat-input-area');
    const chatInput = document.getElementById('chat-input');
    const chatSend = document.getElementById('chat-send');

    let chatState = 'greeting';
    let appointmentData = {};

    function addMessage(text, sender = 'bot') {
        const msgDiv = document.createElement('div');
        msgDiv.className = `message ${sender}`;
        msgDiv.textContent = text;
        chatBody.appendChild(msgDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function addOptions(options) {
        const optionsDiv = document.createElement('div');
        optionsDiv.className = 'chat-options';
        options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'chat-option-btn';
            btn.textContent = opt;
            btn.addEventListener('click', () => handleUserInput(opt));
            optionsDiv.appendChild(btn);
        });
        chatBody.appendChild(optionsDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
    }

    function showTyping(show = true) {
        if (show) {
            typingIndicator.classList.add('show');
            chatBody.appendChild(typingIndicator);
            chatBody.scrollTop = chatBody.scrollHeight;
        } else {
            typingIndicator.classList.remove('show');
        }
    }

    function handleUserInput(input) {
        addMessage(input, 'user');
        chatInputArea.classList.remove('show'); // Hide input initially after use

        showTyping(true);
        setTimeout(() => {
            showTyping(false);
            processBotLogic(input);
        }, 1000);
    }

    function processBotLogic(input) {
        if (chatState === 'greeting' || chatState === 'main_menu') {
            if (input === 'Book Appointment') {
                chatState = 'ask_name';
                addMessage("Great! Let's get you booked. What is your full name?");
                chatInputArea.classList.add('show');
                chatInput.placeholder = "Enter your name...";
            } else if (input === 'Doctor Availability') {
                addMessage("Our specialists are available Mon-Sat, 9AM to 7PM. Would you like to book now?");
                addOptions(['Book Appointment', 'Main Menu']);
                chatState = 'main_menu';
            } else if (input === 'Clinic Location') {
                addMessage("We are located at 123 Health Ave, Bristol. We have 5 branches across the city.");
                addOptions(['Main Menu']);
                chatState = 'main_menu';
            } else if (input === 'Main Menu') {
                showMainMenu();
            } else {
                showMainMenu("I'm sorry, I didn't catch that. How can I help?");
            }
        } else if (chatState === 'ask_name') {
            appointmentData.name = input;
            chatState = 'ask_phone';
            addMessage(`Thanks ${input}. What is your phone number?`);
            chatInputArea.classList.add('show');
            chatInput.placeholder = "Enter phone number...";
        } else if (chatState === 'ask_phone') {
            appointmentData.phone = input;
            chatState = 'ask_date';
            addMessage("Got it. What is your preferred date for the appointment?");
            chatInputArea.classList.add('show');
            chatInput.placeholder = "e.g., March 20...";
        } else if (chatState === 'ask_date') {
            appointmentData.date = input;
            chatState = 'ask_doctor';
            addMessage("Which doctor or department would you like to visit?");
            addOptions(['Dr. Smith (Cardiology)', 'Dr. Jenkins (Dentistry)', 'General Medicine']);
        } else if (chatState === 'ask_doctor') {
            appointmentData.doctor = input;
            addMessage(`Excellent. Your appointment request has been submitted. Our team will contact you shortly at ${appointmentData.phone}.`);
            addMessage("Anything else I can help with?");
            showMainMenu();
            chatState = 'main_menu';
        }
    }

    function showMainMenu(customText) {
        addMessage(customText || "How else can I help you today?");
        addOptions(['Book Appointment', 'Doctor Availability', 'Clinic Location', 'Service Information', 'Emergency Contact']);
        chatState = 'main_menu';
    }

    if (chatToggle) {
        chatToggle.addEventListener('click', () => {
            chatWindow.classList.toggle('show');
            if (chatWindow.classList.contains('show') && chatBody.children.length === 0) {
                showTyping(true);
                setTimeout(() => {
                    showTyping(false);
                    addMessage("Hello 👋 I am MediAssist AI. How can I help you today?");
                    addOptions(['Book Appointment', 'Doctor Availability', 'Clinic Location', 'Service Information', 'Emergency Contact']);
                }, 1000);
            }
        });
    }

    if (closeChat) {
        closeChat.addEventListener('click', () => chatWindow.classList.remove('show'));
    }

    if (chatSend) {
        chatSend.addEventListener('click', () => {
            const val = chatInput.value.trim();
            if (val) {
                handleUserInput(val);
                chatInput.value = '';
            }
        });
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                chatSend.click();
            }
        });
    }

});
