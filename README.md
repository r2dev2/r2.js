# R2.js

A collection of utilities I use when making vanilla js applications.

## Installation

Copy [./r2.js](./r2.js) over to your project. It small. Do wtf u want with it.

## Usage

### HTML Templating

Ever wanted to simply write out html instead of a chain of `document.createElement()` and setting attributes manually? Use HTML Templating from r2.js.

```javascript
import { html } from 'r2.js';

const todos = [
  { task: 'install r2.js', done: false },
  { task: 'star r2.js', done: false },
  { task: 'tell friends to star r2.js', done: false }
];

const renderTodo = (todo, i) => html`
<div class="todo">
  <input type="checkbox" id="todo-${i}" ${todo.done && 'checked'}></input>
  <label for="todo-${i}">${todo.task}</label>
</div>
`;

const app = html`
  <h1>Todos</h1>
  <p>${todos.every(t => t.done) && 'Congratulations, you did everything!'}</p>
  <div class="todos">
    ${todos.map(renderTodo)}
  </div>
`;
```

### State Management

I love svelte stores but, they require me to install svelte. Unfortunately, the spirit of my lord and saviour Rich Harris cannot always be with me, so I have made my own bootleg svelte store. I will consider adding derived stores to this although it isn't too bad doing derived stores manually.

We will now re-write the above todos example with useState to add reactivity.

```javascript
import { useState } from 'r2.js';

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

const app = html`
  <h1>Todos</h1>
  <p>${allDone() && 'Congratulations, you did everything!'}</p>
  <div class="todos">
    ${todos().map(createTodo)}
  </div>
`;
```

### Various JS Utilities

Imagine lodash but good.

```javascript
import { compose, pipe, sortBy, suppress, sleep, clamp } from 'r2.js';

// coolFn1(x) == fn1(fn2(fn3(x)))
const coolFn1 = compose(fn1, fn2, fn3);

// coolFn2(x) = fn3(fn2(fn1(x))) kinda like the | in bash
const coolFn2 = pipe(fn1, fn2, fn3);

// basically Array.prototype.sort but with a key
// will return the array but backwards (sorted by y)
sortBy([
  { x: 0, y: 2 },
  { x: 1, y: 1 },
  { x: 2, y: 0 }
], 'y');

// returns the result of cb if it succeeded, returns error if failed
// either way, nothing will be thrown ultimately
// in this invocation, it'll remove the element if it was found otherwise
// do nothing
suppress(() => {
  document.querySelector('.something-to-remove').remove();
});

// sleeps for 100 ms
await sleep(100);

// if number is less than min, return min
// if it's greater than max, return max
// otherwise return x
// it's basically css's clamp
clamp(x, min, max);
```
