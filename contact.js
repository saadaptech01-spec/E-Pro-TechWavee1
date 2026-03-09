document.addEventListener('DOMContentLoaded', function() {
    if (typeof AOS !== 'undefined') {
        AOS.init({ 
            duration: 800, 
            offset: 100,
            once: true,
            easing: 'ease-out-cubic'
        });
    }
    
    setupContactForm();
    setupRealtimeValidation();
    setupCharacterCounter();
    setupScrollToTop();
    updateFormProgress();
});

var validationRules = {
    firstName: {
        pattern: /^[a-zA-Z\s'-]{2,50}$/,
        message: 'First name must be 2-50 characters',
        required: true
    },
    lastName: {
        pattern: /^[a-zA-Z\s'-]{2,50}$/,
        message: 'Last name must be 2-50 characters',
        required: true
    },
    contactEmail: {
        pattern: /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        message: 'Please enter a valid email address',
        required: true
    },
    contactPhone: {
        pattern: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,5}[-\s\.]?[0-9]{1,6}$/,
        message: 'Please enter a valid phone number',
        required: false
    },
    contactMessage: {
        minLength: 10,
        maxLength: 1000,
        message: 'Message must be between 10 and 1000 characters',
        required: true
    }
};

function setupRealtimeValidation() {
    var form = document.getElementById('contactForm');
    if (!form) return;
    
    form.querySelectorAll('input, select, textarea').forEach(function(field) {
        field.addEventListener('input', function() {
            validateField(this, true);
            updateFormProgress();
            updateSubmitButton();
        });
        
        field.addEventListener('blur', function() {
            if (this.value.trim() !== '' || this.hasAttribute('required')) {
                validateField(this, true);
            }
        });
    });

    setupEmailValidation();
    setupNameValidation();
    setupMessageValidation();
    setupCheckboxValidation();
    setupSelectValidation();
}

function validateField(field, showError) {
    var fieldId = field.id;
    var value = field.value.trim();
    var rule = validationRules[fieldId];
    
    if (field.type === 'checkbox') {
        return validateCheckbox(field, showError);
    }
    
    if (field.tagName === 'SELECT') {
        return validateSelect(field, showError);
    }
    
    if (!rule) {
        return true;
    }
    
    if (!rule.required && value === '') {
        field.classList.remove('is-invalid', 'is-valid');
        return true;
    }
    
    var isValid = true;
    var errorMessage = '';
    
    if (rule.required && value === '') {
        isValid = false;
        errorMessage = 'This field is required';
    } else if (rule.pattern && value !== '' && !rule.pattern.test(value)) {
        isValid = false;
        errorMessage = rule.message;
    } else if (rule.minLength && value.length < rule.minLength) {
        isValid = false;
        errorMessage = 'Minimum ' + rule.minLength + ' characters required';
    } else if (rule.maxLength && value.length > rule.maxLength) {
        isValid = false;
        errorMessage = 'Maximum ' + rule.maxLength + ' characters allowed';
    }
    
    if (isValid && value !== '') {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    } else if (!isValid && showError) {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
    } else {
        field.classList.remove('is-valid', 'is-invalid');
    }
    
    return isValid;
}

function validateCheckbox(field, showError) {
    if (!field.hasAttribute('required')) return true;
    
    var isValid = field.checked;
    
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    } else if (showError) {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
    }
    
    return isValid;
}

function validateSelect(field, showError) {
    if (!field.hasAttribute('required')) return true;
    
    var isValid = field.value !== '';
    
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    } else if (showError) {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
    }
    
    return isValid;
}

function setupEmailValidation() {
    var emailField = document.getElementById('contactEmail');
    if (!emailField) return;
    
    emailField.addEventListener('input', function() {
        var email = this.value.trim();
        
        if (email === '') {
            this.classList.remove('is-valid', 'is-invalid');
            return;
        }
        
        var emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (emailPattern.test(email)) {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
        } else {
            this.classList.add('is-invalid');
            this.classList.remove('is-valid');
        }
    });
}

function setupNameValidation() {
    ['firstName', 'lastName'].forEach(function(fieldId) {
        var field = document.getElementById(fieldId);
        if (!field) return;
        
        field.addEventListener('input', function() {
            var name = this.value.trim();
            
            if (name === '') {
                this.classList.remove('is-valid', 'is-invalid');
                return;
            }
            
            if (/\d/.test(name)) {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }
            
            if (name.length < 2) {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }
            
            if (name.length > 50) {
                this.classList.add('is-invalid');
                this.classList.remove('is-valid');
                return;
            }
            
            this.value = name.split(' ').map(function(word) {
                return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
            }).join(' ');
            
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
        });
    });
}

function setupMessageValidation() {
    var messageField = document.getElementById('contactMessage');
    if (!messageField) return;
    
    messageField.addEventListener('input', function() {
        var message = this.value;
        var length = message.length;
        
        if (length === 0) {
            this.classList.remove('is-valid', 'is-invalid');
        } else if (length < 10) {
            this.classList.add('is-invalid');
            this.classList.remove('is-valid');
        } else if (length > 1000) {
            this.classList.add('is-invalid');
            this.classList.remove('is-valid');
        } else {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
        }
    });
}

function setupCheckboxValidation() {
    var agreeTerms = document.getElementById('agreeTermsContact');
    if (!agreeTerms) return;
    
    agreeTerms.addEventListener('change', function() {
        if (this.checked) {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
        } else {
            this.classList.remove('is-valid');
            this.classList.add('is-invalid');
        }
        updateFormProgress();
        updateSubmitButton();
    });
}

function setupSelectValidation() {
    var subject = document.getElementById('subject');
    if (!subject) return;
    
    subject.addEventListener('change', function() {
        if (this.value !== '') {
            this.classList.remove('is-invalid');
            this.classList.add('is-valid');
        } else {
            this.classList.remove('is-valid');
            this.classList.add('is-invalid');
        }
        updateFormProgress();
        updateSubmitButton();
    });
}

function setupCharacterCounter() {
    var messageField = document.getElementById('contactMessage');
    var charCount = document.getElementById('charCount');
    
    if (!messageField || !charCount) return;
    
    messageField.addEventListener('input', function() {
        charCount.textContent = this.value.length;
    });
}

function updateFormProgress() {
    var form = document.getElementById('contactForm');
    var progressBar = document.getElementById('formProgress');
    var progressPercent = document.getElementById('progressPercent');
    
    if (!form || !progressBar || !progressPercent) return;
    
    var inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    var filledInputs = 0;
    
    inputs.forEach(function(input) {
        if (input.type === 'checkbox') {
            if (input.checked) filledInputs++;
        } else if (input.value.trim() !== '') {
            filledInputs++;
        }
    });
    
    var percentage = Math.round((filledInputs / inputs.length) * 100);
    progressBar.style.width = percentage + '%';
    progressPercent.textContent = percentage + '%';
}

function updateSubmitButton() {
    var form = document.getElementById('contactForm');
    var submitBtn = document.getElementById('submitBtn');
    if (!form || !submitBtn) return;
    
    var requiredFields = form.querySelectorAll('[required]');
    var allValid = true;
    
    requiredFields.forEach(function(field) {
        if (field.type === 'checkbox') {
            if (!field.checked) allValid = false;
        } else if (field.tagName === 'SELECT') {
            if (field.value === '') allValid = false;
        } else {
            if (field.value.trim() === '' || field.classList.contains('is-invalid')) {
                allValid = false;
            }
        }
    });
    
    if (allValid) {
        submitBtn.classList.add('pulse-success');
    } else {
        submitBtn.classList.remove('pulse-success');
    }
}

function setupContactForm() {
    var form = document.getElementById('contactForm');
    var submitBtn = document.getElementById('submitBtn');
    var formSuccess = document.getElementById('formSuccess');
    var formError = document.getElementById('formError');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var errors = [];
        var requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(function(field) {
            var isValid = validateField(field, true);
            if (!isValid) {
                errors.push(field.id);
            }
        });
        
        if (errors.length > 0) {
            if (typeof showToast === 'function') {
                showToast('Please fix the errors in the form', 'error');
            }
            return;
        }
        
        if (submitBtn) {
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
        }
        
        var formData = {
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('contactEmail').value,
            phone: document.getElementById('contactPhone').value,
            subject: document.getElementById('subject').value,
            message: document.getElementById('contactMessage').value,
            priority: document.querySelector('input[name="priority"]:checked').value,
            contactMethod: document.querySelector('input[name="contactMethod"]:checked').value,
            timestamp: new Date().toISOString()
        };
        
        var messages = JSON.parse(localStorage.getItem('contactMessages')) || [];
        messages.push(formData);
        localStorage.setItem('contactMessages', JSON.stringify(messages));
        
        setTimeout(function() {
            var referenceId = 'TW' + Date.now().toString().slice(-8);
            document.getElementById('referenceId').textContent = referenceId;
            
            formSuccess.style.display = 'block';
            formError.style.display = 'none';
            
            form.reset();
            form.classList.remove('was-validated');
            updateFormProgress();
            
            form.querySelectorAll('.is-valid, .is-invalid').forEach(function(el) {
                el.classList.remove('is-valid', 'is-invalid');
            });
            
            if (document.getElementById('charCount')) {
                document.getElementById('charCount').textContent = '0';
            }
            
            if (submitBtn) {
                submitBtn.classList.remove('loading');
                submitBtn.classList.remove('pulse-success');
                submitBtn.disabled = false;
            }
            
            if (typeof showToast === 'function') {
                showToast('Message sent! Reference: ' + referenceId, 'success');
            }
            
            setTimeout(function() {
                formSuccess.style.display = 'none';
            }, 5000);
            
        }, 2000);
    });
}

function setupScrollToTop() {
    var scrollBtn = document.getElementById('scrollTopBtn');
    if (!scrollBtn) return;
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            scrollBtn.classList.add('show');
        } else {
            scrollBtn.classList.remove('show');
        }
    });
}

function scrollToForm() {
    var formSection = document.getElementById('contactFormSection');
    if (formSection) {
        formSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        setTimeout(function() {
            var firstName = document.getElementById('firstName');
            if (firstName) firstName.focus();
        }, 800);
    }
}

function startLiveChat() {
    var widget = document.getElementById('liveChatWidget');
    var trigger = document.getElementById('chatTrigger');
    
    if (!widget) return;
    
    if (widget.style.display === 'flex') {
        closeLiveChat();
        return;
    }
    
    widget.style.display = 'flex';
    
    if (trigger) {
        trigger.style.display = 'none';
    }
    
    setTimeout(function() {
        var chatInput = document.getElementById('chatInput');
        if (chatInput) {
            chatInput.focus();
        }
    }, 300);
    
    if (typeof showToast === 'function') {
        showToast('<i class="fas fa-headset me-1"></i>Support team is ready to help!', 'info');
    }
}

function closeLiveChat() {
    var widget = document.getElementById('liveChatWidget');
    var trigger = document.getElementById('chatTrigger');
    
    if (!widget) return;
    
    widget.style.display = 'none';
    
    if (trigger) {
        trigger.style.display = 'flex';
    }
}

function sendChatMessage() {
    var input = document.getElementById('chatInput');
    var chatBody = document.getElementById('chatBody');
    
    if (!input || !chatBody) return;
    
    var message = input.value.trim();
    if (message.length === 0) return;
    
    var userMsg = document.createElement('div');
    userMsg.className = 'chat-message user';
    userMsg.innerHTML =
        '<div class="message-content">' + escapeHtml(message) + '</div>' +
        '<small class="message-time"><i class="fas fa-clock me-1"></i>Just now</small>';
    
    chatBody.appendChild(userMsg);
    input.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;
    
    setTimeout(function() {
        var typingDiv = document.createElement('div');
        typingDiv.className = 'chat-message bot';
        typingDiv.innerHTML = '<div class="typing-indicator">' +
            '<span class="typing-dot"></span>' +
            '<span class="typing-dot"></span>' +
            '<span class="typing-dot"></span>' +
        '</div>';
        chatBody.appendChild(typingDiv);
        chatBody.scrollTop = chatBody.scrollHeight;
        
        setTimeout(function() {
            typingDiv.remove();
            
            var responses = [
                'Thanks for your message! Our team will respond shortly.',
                'I\'m here to help! What can I assist you with?',
                'Your question is important to us. Let me check that for you.',
                'Great question! Here\'s what I can tell you...',
                'I understand. Let me find the best solution for you.'
            ];
            
            var response = responses[Math.floor(Math.random() * responses.length)];
            
            var botMsg = document.createElement('div');
            botMsg.className = 'chat-message bot';
            botMsg.innerHTML =
                '<div class="message-content">' +
                    '<i class="fas fa-comment me-1"></i> ' + response +
                '</div>' +
                '<small class="message-time"><i class="fas fa-clock me-1"></i>Just now</small>';
            
            chatBody.appendChild(botMsg);
            chatBody.scrollTop = chatBody.scrollHeight;
        }, 1500);
    }, 300);
}

function handleChatKeypress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendChatMessage();
    }
}

function escapeHtml(text) {
    var div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

window.startLiveChat = startLiveChat;
window.closeLiveChat = closeLiveChat;
window.sendChatMessage = sendChatMessage;
window.handleChatKeypress = handleChatKeypress;
window.scrollToForm = scrollToForm;