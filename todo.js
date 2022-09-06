import { html, useState } from './r2.js';

const [ todos, setTodos, subTodos ] = useState([
  { task: 'install r2.js', done: false },
  { task: 'star r2.js', done: false },
  { task: 'tell friends to star r2.js', done: false }
]);

const [ allDone, setAllDone, subAllDone ] = useState(false);

// whenever todos updates, update the allDone store
// this is poor man's derived store
subTodos($todos => setAllDone($todos.every(t => t.done)));

// whenever everything is done, tell the user with an annnoying alert message
// we need a built in confetti
subAllDone($allDone => $allDone && alert('Congratulations for doing everything'));

const renderTodo = (todo, i) => html`
<div class="todo">
  <input type="checkbox" id="todo-${i}" ${todo.done && 'checked'}></input>
  <label for="todo-${i}">${todo.task}</label>
</div>
`;

const createTodo = (todo, i) => {
  const todoEl = renderTodo(todo, i);

  const checkbox = todoEl.querySelector('input[type=checkbox]');
  checkbox.addEventListener('change', () => {
    const newTodos = [...todos()];
    newTodos[i] = {...newTodos[i], done: checkbox.checked};
    setTodos(newTodos);
  });

  return todoEl;
};

// TODO this app won't change whenever allDone changes or todos changes
const app = html`
<div id="app">
  <h1>Todos</h1>
  <p class="congrats-msg" />
  <div class="todos" />
</div>
`;

subAllDone($allDone => {
  app.querySelector('.congrats-msg').textContent = $allDone
    ? 'Congratulations, you did everything!'
    : '';
});

subTodos($todos => {
  const container = app.querySelector('.todos');
  const previousChildren = [...container.children];
  $todos.map(createTodo).forEach(container.appendChild.bind(container));
  previousChildren.forEach(e => e.remove());
});

// mount app to the document body
document.body.appendChild(app);

