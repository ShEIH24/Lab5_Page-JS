// 1. таймер обратного отсчёта
(function() {
    const timerDisplay = document.getElementById('timerDisplay');
    const startButton = document.getElementById('startTimer');
    const pauseButton = document.getElementById('pauseTimer');
    const resetButton = document.getElementById('resetTimer');

    let timeLeft = 300; // 5 минут в секундах
    let timerId = null;
    let isRunning = false;

    function updateDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    function startTimer() {
        if (!isRunning && timeLeft > 0) {
            isRunning = true;
            timerId = setInterval(function() {
                timeLeft--;
                updateDisplay();

                if (timeLeft === 0) {
                    clearInterval(timerId);
                    isRunning = false;
                    alert('Время вышло!');
                }
            }, 1000);
        }
    }

    function pauseTimer() {
        if (isRunning) {
            clearInterval(timerId);
            isRunning = false;
        }
    }

    function resetTimer() {
        clearInterval(timerId);
        isRunning = false;
        timeLeft = 300;
        updateDisplay();
    }

    startButton.addEventListener('click', startTimer);
    pauseButton.addEventListener('click', pauseTimer);
    resetButton.addEventListener('click', resetTimer);
})();

// 2. аккордеон
(function() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');

    accordionHeaders.forEach(function(header) {
        header.addEventListener('click', function() {
            const content = this.nextElementSibling;
            const isActive = this.classList.contains('active');

            // закрыть все остальные секции
            accordionHeaders.forEach(function(h) {
                h.classList.remove('active');
                h.nextElementSibling.style.maxHeight = null;
            });

            // открыть/закрыть текущую секцию
            if (!isActive) {
                this.classList.add('active');
                content.style.maxHeight = content.scrollHeight + 'px';
            }
        });
    });
})();

// 3. форма с валидацией
(function() {
    const form = document.getElementById('validationForm');
    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const successMessage = document.getElementById('successMessage');

    function showError(input, message) {
        const formGroup = input.parentElement;
        const errorMessage = formGroup.querySelector('.error-message');

        input.classList.add('error');
        input.classList.remove('success');
        errorMessage.textContent = message;
    }

    function showSuccess(input) {
        const formGroup = input.parentElement;
        const errorMessage = formGroup.querySelector('.error-message');

        input.classList.add('success');
        input.classList.remove('error');
        errorMessage.textContent = '';
    }

    function validateUsername(value) {
        if (value.trim() === '') {
            return 'Имя пользователя обязательно';
        } else if (value.length < 3) {
            return 'Имя должно содержать минимум 3 символа';
        }
        return null;
    }

    function validateEmail(value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value.trim() === '') {
            return 'Email обязателен';
        } else if (!emailRegex.test(value)) {
            return 'Введите корректный email';
        }
        return null;
    }

    function validatePassword(value) {
        if (value.trim() === '') {
            return 'Пароль обязателен';
        } else if (value.length < 6) {
            return 'Пароль должен содержать минимум 6 символов';
        }
        return null;
    }

    // валидация в реальном времени
    username.addEventListener('blur', function() {
        const error = validateUsername(this.value);
        if (error) {
            showError(this, error);
        } else {
            showSuccess(this);
        }
    });

    email.addEventListener('blur', function() {
        const error = validateEmail(this.value);
        if (error) {
            showError(this, error);
        } else {
            showSuccess(this);
        }
    });

    password.addEventListener('blur', function() {
        const error = validatePassword(this.value);
        if (error) {
            showError(this, error);
        } else {
            showSuccess(this);
        }
    });

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const usernameError = validateUsername(username.value);
        const emailError = validateEmail(email.value);
        const passwordError = validatePassword(password.value);

        if (usernameError) showError(username, usernameError);
        else showSuccess(username);

        if (emailError) showError(email, emailError);
        else showSuccess(email);

        if (passwordError) showError(password, passwordError);
        else showSuccess(password);

        if (!usernameError && !emailError && !passwordError) {
            successMessage.textContent = 'Форма успешно отправлена!';
            setTimeout(function() {
                form.reset();
                successMessage.textContent = '';
                // сброс классов
                username.classList.remove('success');
                email.classList.remove('success');
                password.classList.remove('success');
            }, 3000);
        } else {
            successMessage.textContent = '';
        }
    });
})();

// 4. to-do список
(function() {
    const todoInput = document.getElementById('todoInput');
    const addButton = document.getElementById('addTodo');
    const todoList = document.getElementById('todoList');

    let todos = [];

    function renderTodos() {
        todoList.innerHTML = '';

        todos.forEach(function(todo, index) {
            const li = document.createElement('li');
            li.className = 'todo-item' + (todo.completed ? ' completed' : '');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'todo-checkbox';
            checkbox.checked = todo.completed;
            checkbox.addEventListener('change', function() {
                toggleTodo(index);
            });

            const text = document.createElement('span');
            text.className = 'todo-text';
            text.textContent = todo.text;

            const deleteButton = document.createElement('button');
            deleteButton.className = 'todo-delete';
            deleteButton.textContent = 'Удалить';
            deleteButton.addEventListener('click', function() {
                deleteTodo(index);
            });

            li.appendChild(checkbox);
            li.appendChild(text);
            li.appendChild(deleteButton);
            todoList.appendChild(li);
        });
    }

    function addTodo() {
        const text = todoInput.value.trim();
        if (text !== '') {
            todos.push({ text: text, completed: false });
            todoInput.value = '';
            renderTodos();
        }
    }

    function toggleTodo(index) {
        todos[index].completed = !todos[index].completed;
        renderTodos();
    }

    function deleteTodo(index) {
        todos.splice(index, 1);
        renderTodos();
    }

    addButton.addEventListener('click', addTodo);

    todoInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTodo();
        }
    });
})();

// 5. прогресс-бар
(function() {
    const progressFill = document.getElementById('progressFill');
    const progressValue = document.getElementById('progressValue');
    const increaseButton = document.getElementById('increaseProgress');
    const decreaseButton = document.getElementById('decreaseProgress');

    let progress = 0;

    function updateProgress() {
        progressFill.style.width = progress + '%';
        progressValue.textContent = progress + '%';
    }

    function increaseProgress() {
        if (progress < 100) {
            progress = Math.min(progress + 10, 100);
            updateProgress();
        }
    }

    function decreaseProgress() {
        if (progress > 0) {
            progress = Math.max(progress - 10, 0);
            updateProgress();
        }
    }

    increaseButton.addEventListener('click', increaseProgress);
    decreaseButton.addEventListener('click', decreaseProgress);
})();

// 6. переключатель размера шрифта
(function() {
    const sampleText = document.getElementById('sampleText');
    const decreaseButton = document.getElementById('decreaseFont');
    const resetButton = document.getElementById('resetFont');
    const increaseButton = document.getElementById('increaseFont');

    let fontSize = 16; // начальный размер в px
    const minSize = 12;
    const maxSize = 24;

    function updateFontSize() {
        sampleText.style.fontSize = fontSize + 'px';
    }

    function increaseFontSize() {
        if (fontSize < maxSize) {
            fontSize += 2;
            updateFontSize();
        }
    }

    function decreaseFontSize() {
        if (fontSize > minSize) {
            fontSize -= 2;
            updateFontSize();
        }
    }

    function resetFontSize() {
        fontSize = 16;
        updateFontSize();
    }

    increaseButton.addEventListener('click', increaseFontSize);
    decreaseButton.addEventListener('click', decreaseFontSize);
    resetButton.addEventListener('click', resetFontSize);
})();

// 7. анимация при наведении
(function() {
    const hoverCards = document.querySelectorAll('.hover-card');

    // дополнительная интерактивность при клике
    hoverCards.forEach(function(card) {
        card.addEventListener('click', function() {
            const animationType = this.getAttribute('data-animation');
            alert('Вы кликнули на карточку с анимацией: ' + animationType);
        });
    });
})();