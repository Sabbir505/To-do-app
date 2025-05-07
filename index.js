document.addEventListener('DOMContentLoaded', () => {
    const loginContainer = document.getElementById('login-container');
    const appContainer = document.querySelector('.app-container');
    // Corrected element selection
    const emailInput = document.getElementById('email');
    const sendCodeBtn = document.getElementById('sendCodeBtn');
    const verificationCodeInput = document.getElementById('verificationCode');
    const verifyBtn = document.getElementById('verifyBtn');
    const realtimeClock = document.getElementById('realtime-clock');
    const usernameInput = document.getElementById('username');
    const welcomeMessage = document.getElementById('welcome-message');

    // Mock verification code
    let mockVerificationCode = null;

    // Function to update the clock
    const updateClock = () => {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        realtimeClock.textContent = `${hours}:${minutes}:${seconds}`;
    };

    // Update the clock every second
    setInterval(updateClock, 1000);
    updateClock(); // Initial call

    // Mock send email function
    const sendVerificationCode = () => {
        const email = emailInput.value.trim();
        if (!email) {
            alert('Please enter your email.');
            return;
        }
        // Generate a 6 - digit verification code
        mockVerificationCode = Math.floor(100000 + Math.random() * 900000);
        console.log(`Mock verification code sent to ${email}: ${mockVerificationCode}`);
        verificationCodeInput.style.display = 'block';
        verifyBtn.style.display = 'block';
        sendCodeBtn.style.display = 'none';
    };

    const verifyCode = () => {
        const enteredCode = verificationCodeInput.value.trim();
        const username = usernameInput.value.trim();
        if (!username) {
            alert('Please enter your username.');
            return;
        }
        if (enteredCode === String(mockVerificationCode)) {
            welcomeMessage.textContent = `Welcome ${username}!!`;
            loginContainer.style.display = 'none';
            appContainer.style.display = 'block';
        } else {
            alert('Invalid verification code. Please try again.');
        }
    };

    sendCodeBtn.addEventListener('click', sendVerificationCode);
    verifyBtn.addEventListener('click', verifyCode);

    // Existing todo app code starts here
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addBtn');
    const editInput = document.getElementById('editInput');
    const saveEditBtn = document.getElementById('saveEditBtn');
    const activeTaskList = document.getElementById('activeTaskList');
    const completedTaskList = document.getElementById('completedTaskList');
    const tabs = document.querySelectorAll('.tab');
    const appHeader = document.querySelector('.app-header');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 0) {
            appHeader.classList.add('scrolled');
        } else {
            appHeader.classList.remove('scrolled');
        }
    });

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let editingIndex = null;

    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    const renderTasks = () => {
        const activeTasks = tasks.filter(task =>!task.completed);
        const completedTasks = tasks.filter(task => task.completed);

        activeTaskList.innerHTML = '';
        completedTaskList.innerHTML = '';

        activeTasks.forEach((task) => {
            const actualIndex = tasks.findIndex(t => t === task);
            createTaskElement(task, actualIndex, activeTaskList);
        });

        completedTasks.forEach((task) => {
            const actualIndex = tasks.findIndex(t => t === task);
            createTaskElement(task, actualIndex, completedTaskList);
        });
    };

    const createTaskElement = (task, index, list) => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        taskItem.innerHTML = `
            <div class="task-status ${task.completed? 'completed' : ''}"></div>
            <span class="task-description">${task.text}</span>
            <span class="task-deadline">Deadline: ${task.deadline || 'No deadline'}</span>
            <button class="edit-btn"><i class="fas fa-pen-to-square"></i></button>
            <button class="delete-btn"><i class="fas fa-trash-can"></i></button>
        `;

        const statusBtn = taskItem.querySelector('.task-status');
        statusBtn.addEventListener('click', () => {
            tasks[index].completed =!tasks[index].completed;
            saveTasks();
            renderTasks();
        });

        const editBtn = taskItem.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => {
            editingIndex = index;
            editInput.value = task.text;
            document.getElementById('editDeadline').value = task.deadline || '';
            taskInput.style.display = 'none';
            addTaskBtn.style.display = 'none';
            editInput.style.display = 'block';
            document.getElementById('editDeadline').style.display = 'block';
            saveEditBtn.style.display = 'block';
            editInput.focus();
        });

        const deleteBtn = taskItem.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        });

        list.appendChild(taskItem);
    };

    // Function to add a new task
    function addTask() {
        const taskInput = document.getElementById('taskInput');
        const taskDeadline = document.getElementById('taskDeadline');
        const taskText = taskInput.value.trim();
        const deadline = taskDeadline.value;
    
        if (taskText === '') {
            alert('Please enter a task!');
            return;
        }
    
        // Save the current scroll position
        const scrollTop = window.scrollY;
    
        tasks.push({
            text: taskText,
            deadline: deadline,
            completed: false
        });
    
        saveTasks();
        renderTasks();
        taskInput.value = '';
        taskDeadline.value = '';
    
        // Restore the scroll position
        window.scrollTo(0, scrollTop);
    }

    const saveEdit = () => {
        const newText = editInput.value.trim();
        const newDeadline = document.getElementById('editDeadline').value;
        if (newText && editingIndex!== null) {
            tasks[editingIndex].text = newText;
            tasks[editingIndex].deadline = newDeadline;
            saveTasks();
            editingIndex = null;
            editInput.value = '';
            document.getElementById('editDeadline').value = '';
            taskInput.style.display = 'block';
            addTaskBtn.style.display = 'block';
            editInput.style.display = 'none';
            document.getElementById('editDeadline').style.display = 'none';
            saveEditBtn.style.display = 'none';
            renderTasks();
        }
    };

    const switchTab = (tab) => {
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        const tabData = tab.dataset.tab;
        if (tabData === 'active') {
            activeTaskList.style.display = 'block';
            completedTaskList.style.display = 'none';
        } else {
            activeTaskList.style.display = 'none';
            completedTaskList.style.display = 'block';
        }
    };

    addTaskBtn.addEventListener('click', addTask);

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    saveEditBtn.addEventListener('click', saveEdit);

    editInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveEdit();
        }
    });

    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            switchTab(tab);
        });
    });

    renderTasks();
});