const userSignup = async () => {
    const emailElem = document.getElementById('signupEmail');
    const passwordElem = document.getElementById('signupPassword');
    const email = emailElem.value;
    const password = passwordElem.value;
    const response = await axios.post('http://localhost:3000/user/signup', {
        email,
        password
    });
    if (response.data.type == 'success') {
        alert(response.data.msg)
        toggleSignupForm()
    }
    passwordElem.value = "";
    emailElem.value = "";
}

const userSignin = async () => {
    const emailElem = document.getElementById('signinEmail');
    const passwordElem = document.getElementById('signinPassword');
    const email = emailElem.value;
    const password = passwordElem.value;
    const response = await axios.post('http://localhost:3000/user/signin', {
        email,
        password
    });
    if (response.data.type == 'success') {
        const token = response.data.token;
        localStorage.setItem('token', token);
        alert(response.data.msg)
        toggleSigninForm()
        loadChecks()
        loadTodos()
    }
    passwordElem.value = "";
    emailElem.value = "";
}

const toggleSignupForm = () => {
    const form = document.getElementById('signupForm');
    form.classList.toggle('hidden');
};

const toggleSigninForm = () => {
    const form = document.getElementById('signinForm');
    form.classList.toggle('hidden');
};

const toggleSignupButton = () => {
    const btn = document.getElementById('signup');
    btn.classList.toggle('hidden');
}

const toggleSigninButton = () => {
    const btn = document.getElementById('signin');
    btn.classList.toggle('hidden');
}

const toggleLogoutButton = () => {
    const btn = document.getElementById('logout');
    btn.classList.toggle('hidden');
};

const logout = () => {
    localStorage.removeItem('token');
    loadChecks();
    clearTodos();
}

const addTodo = async () => {
    const titleElem = document.getElementById('todoTitle');
    const descriptionElem = document.getElementById('todoDescription');
    const title = titleElem.value;
    const description = descriptionElem.value;
    if (title.trim() == "" || description.trim() == "") {
        titleElem.value = "";
        descriptionElem.value = "";
        return;
    }
    const isUserPresent = !!localStorage.getItem('token');
    if (isUserPresent) {
        try {
            const response = await axios.post('http://localhost:3000/todo/addTodo',
                {
                    title,
                    description
                },
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem('token')}`
                    }
                }
            )
            if (response.data.type == 'success') {
                loadTodos();
                alert(response.data.msg)
            }
        } catch (e) {
            console.error(`Error occurred : ${e.message}`)
        }
    }
    else {
        alert('Sign in to add TODO');
    }
    titleElem.value = "";
    descriptionElem.value = "";
}

const loadChecks = async () => {
    const isUserPresent = !!localStorage.getItem('token');
    let userEmail;

    if (isUserPresent) {
        try {
            const response = await axios.get('http://localhost:3000/user/me', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`
                }
            });
            userEmail = response.data.msg;
            loadTodos();
        } catch (e) {
            console.error('Error fetching data:', e.message);
        } finally {
            const infoElem = document.getElementById('information');
            infoElem.innerHTML = `Logged in as - ${userEmail || 'Could not fetch data'}`;
        }
    } else {
        document.getElementById('information').innerHTML = '';
    }
    toggleLogoutButton()
    toggleSignupButton()
    toggleSigninButton()
}

const loadTodos = async () => {
    try {
        const response = await axios.get('http://localhost:3000/todo/getTodos', {
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        })
        if (response.data.type == 'success') {
            clearTodos();
            if (response.data.todos.length == 0) {
                showTodoMessage();
            }
            else {
                populateTodos(response.data.todos);
            }
        }
    } catch (e) {
        console.error('Error fetching data:', e.message);
    }
}

const clearTodos = () =>{
    document.getElementById('todos-container').innerHTML = "";
}

const populateTodos = (todos) => {
    const container = document.getElementById('todos-container');
    todos.forEach((todo, index) => {
        const card = createTodoCard(todo, index);
        container.appendChild(card);
    })
}

const createTodoCard = (todo, index) => {
    const id = `deleteTodo-${index}`;
    const card = document.createElement('div');
    card.classList.add('todo-card');
    card.setAttribute('id', id);

    const title = document.createElement('div');
    title.classList.add('todo-title');
    title.innerHTML = `<h1>${todo.title}</h1>`

    const deleteIcon = document.createElement('img');
    deleteIcon.addEventListener('click', deleteTodo);
    deleteIcon.src = 'assets/cross.png';
    deleteIcon.alt = 'Delete';

    title.appendChild(deleteIcon);


    const description = document.createElement('div');
    description.classList.add('todo-description');
    description.innerHTML = `<p>${todo.description}</p>`

    card.appendChild(title);
    card.appendChild(description);
    return card;
}

const showTodoMessage = () => {
    const h1 = document.querySelector('.todoMessage');
    h1.classList.toggle('hidden');
}
const deleteTodo = async (e) => {
    const title = e.target.parentNode;
    const todoTitle = title.innerText;
    try {
        const response = await axios.delete('http://localhost:3000/todo/deleteTodo', {
            data: { title: todoTitle },
            headers: {
                Authorization: `Bearer ${localStorage.getItem('token')}`
            }
        });
        if (response.data.type == 'success') {
            alert(response.data.msg);
            loadTodos();
        }
    } catch (e) {
        console.error('Error deleting todo:', e.message);
    }
}
loadChecks()