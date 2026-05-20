const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function renderTasks() {
    taskList.innerHTML = '';
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.className = `task-item ${task.done ? 'done' : ''}`;
        li.innerHTML = `
            <span onclick="toggleTask(${index})">${task.text}</span>
            <button class="delete-btn" onclick="deleteTask(${index})">✕</button>
        `;
        taskList.appendChild(li);
    });
}

function addTask() {
    const text = input.value.trim();
    if (!text) return;
    tasks.push({ text, done: false });
    input.value = '';
    saveAndRender();
}

function toggleTask(index) {
    tasks[index].done = !tasks[index].done;
    saveAndRender();
}

function deleteTask(index) {
    tasks.splice(index, 1);
    saveAndRender();
}

function saveAndRender() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
    renderTasks();
}

addBtn.addEventListener('click', addTask);
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTask();
});

renderTasks();// --- КНОПКА ЦИТАТ ---
const quoteBtn = document.getElementById('new-quote-btn');
const quoteText = document.getElementById('quote-text');
const quoteAuthor = document.getElementById('quote-author');

// Запасные цитаты, если интернет/API не работают
const fallbackQuotes = [
    { content: "Код — это поэзия, которую понимает машина.", author: "Неизвестный разработчик" },
    { content: "Лучший способ предсказать будущее — создать его.", author: "Алан Кей" },
    { content: "Ошибки — это доказательство того, что ты пробуешь.", author: "Аноним" }
];

quoteBtn.addEventListener('click', async () => {
    quoteBtn.textContent = 'Загрузка...';
    quoteBtn.disabled = true;

    try {
        // Пробуем получить данные с API
        const response = await fetch('https://dummyjson.com/quotes/random');
        if (!response.ok) throw new Error('API не ответил');
        
        const data = await response.json();
        // dummyjson возвращает { quote: "...", author: "..." }
        quoteText.textContent = `"${data.quote}"`;
        quoteAuthor.textContent = `— ${data.author}`;
    } catch (error) {
        // Если API упал или нет интернета → берём запасную цитату
        const random = fallbackQuotes[Math.floor(Math.random() * fallbackQuotes.length)];
        quoteText.textContent = `"${random.content}"`;
        quoteAuthor.textContent = `— ${random.author}`;
        console.log('API не доступен, использована локальная цитата');
    } finally {
        quoteBtn.textContent = 'Новая цитата';
        quoteBtn.disabled = false;
    }
});