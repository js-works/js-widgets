/** @jsx h */
import { createRef, h, RefObject } from 'preact';
import { component, render } from '../../main/core';
import { getRefresher, effect, stateObj } from '../../main/ext';
import { Router, Link } from 'preact-router';
import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit';
// @ts-ignore
import { createHashHistory } from 'history';
import 'preact/debug';

// --- types ---------------------------------------------------------

enum TodoFilter {
  None,
  Active,
  Completed
}

type Todo = {
  id: number;
  title: string;
  completed: boolean;
};

// -------------------------------------------------------------------

const ENTER_KEY = 13;
const ESC_KEY = 27;
const STORAGE_KEY = 'todomvc::preactive';

const todoSlice = createSlice({
  name: 'todos',

  initialState: {
    todos: [] as Todo[]
  },

  reducers: {
    create(state, action: PayloadAction<{ title: string }>) {
      const id = state.todos.reduce((max, it) => Math.max(max, it.id + 1), 0);

      state.todos.push({
        id,
        title: action.payload.title,
        completed: false
      });
    },

    edit(state, action: PayloadAction<{ id: number; title: string }>) {
      state.todos.find((it) => it.id === action.payload.id)!.title =
        action.payload.title;
    },

    destroy(state, action: PayloadAction<{ id: number }>) {
      const idx = state.todos.findIndex((it) => it.id === action.payload.id);
      state.todos.splice(idx, 1);
    },

    toggle(state, action: PayloadAction<{ id: number; completed: boolean }>) {
      const idx = state.todos.findIndex((it) => it.id === action.payload.id);
      state.todos[idx].completed = action.payload.completed;
    },

    toggleAll(state, action: PayloadAction<{ completed: boolean }>) {
      state.todos.forEach(
        (it) => void (it.completed = action.payload.completed)
      );
    },

    clearCompleted(state) {
      state.todos = state.todos.filter((it) => !it.completed);
    }
  }
});

const store = configureStore({
  reducer: todoSlice.reducer,
  preloadedState: { todos: loadTodos() }
});

const actions = todoSlice.actions;
const dispatch = store.dispatch;

const Header = component('Header', () => {
  const [state, set] = stateObj({ title: '' });
  const onInput = (ev: any) => set.title(ev.target.value);

  const onKeyDown = (ev: any) => {
    if (ev.keyCode === ENTER_KEY) {
      const newTitle = ev.target.value.trim();
      set.title('');

      if (newTitle) {
        ev.preventDefault();
        dispatch(actions.create({ title: newTitle }));
      }
    }
  };

  return () => (
    <header className="header">
      <h1>todos</h1>
      <input
        className="new-todo"
        placeholder="What needs to be done?"
        autoFocus
        onChange={onInput}
        onKeyDown={onKeyDown}
        value={state.title}
      />
    </header>
  );
});

// --- TodoItem ------------------------------------------------------

const TodoItem = component('TodoItem')<{
  todo: Todo;
}>((props) => {
  const inputFieldRef: RefObject<HTMLInputElement> = createRef();

  const [state, set] = stateObj({
    active: false,
    title: props.todo.title
  });

  const onDestroyClick = () => dispatch(actions.destroy({ id: props.todo.id }));

  const onToggleClick = (ev: any) =>
    dispatch(
      actions.toggle({ id: props.todo.id, completed: ev.target.checked })
    );

  const onDoubleClick = () => set.active(true);
  const onInput = (ev: any) => set.title(ev.target.value);

  const onBlur = (ev: any) => {
    const title = ev.target.value.trim();

    set({ active: false, title });

    if (title) {
      dispatch(actions.edit({ id: props.todo.id, title }));
    } else {
      dispatch(actions.destroy({ id: props.todo.id }));
    }
  };

  const onKeyDown = (ev: any) => {
    if (ev.keyCode === ENTER_KEY) {
      ev.target.blur();
    } else if (ev.keyCode === ESC_KEY) {
      set.active(false);
    }
  };

  effect(() => {
    inputFieldRef.current && inputFieldRef.current.focus();
  });

  return () => {
    const classes =
      (state.active ? 'editing ' : '') +
      (props.todo.completed ? 'completed' : '');

    return (
      <li className={classes}>
        <div className="view">
          <input
            className="toggle"
            type="checkbox"
            checked={props.todo.completed}
            onChange={onToggleClick}
          />
          <label onDblClick={onDoubleClick}>{state.title}</label>
          <button className="destroy" onClick={onDestroyClick} />
        </div>
        <input
          ref={inputFieldRef}
          className="edit"
          value={state.title}
          onChange={onInput}
          onBlur={onBlur}
          onKeyDown={onKeyDown}
        />
      </li>
    );
  };
});

// --- Main ----------------------------------------------------------

const Main = component('Main')<{
  todos: Todo[];
  filter: TodoFilter;
}>((props) => {
  const onChange = () =>
    dispatch(
      actions.toggleAll({
        completed: !props.todos.every((todo) => todo.completed)
      })
    );

  return () => {
    const completed = !props.todos.every((todo) => todo.completed),
      filteredTodos =
        props.filter === TodoFilter.Active
          ? props.todos.filter((todo) => !todo.completed)
          : props.filter === TodoFilter.Completed
          ? props.todos.filter((todo) => todo.completed)
          : props.todos;

    return (
      <section className="main">
        <input
          id="toggle-all"
          className="toggle-all"
          type="checkbox"
          checked={completed}
          onChange={onChange}
        />
        <label htmlFor="toggle-all">Mark all as complete</label>
        <ul className="todo-list">
          {filteredTodos.map((todo) => (
            <TodoItem todo={todo} key={todo.id} />
          ))}
        </ul>
      </section>
    );
  };
});

// --- Filters -------------------------------------------------------

const Filters = component('Filters')<{
  filter: TodoFilter;
}>((props) => {
  const { filter } = props;

  return (
    <ul className="filters">
      <li>
        <Link
          href="#/"
          className={filter === TodoFilter.None ? 'selected' : ''}
        >
          All
        </Link>
      </li>
      <li>
        <Link
          href="#/active"
          className={filter === TodoFilter.Active ? 'selected' : ''}
        >
          Active
        </Link>
      </li>
      <li>
        <Link
          href="#/completed"
          className={filter === TodoFilter.Completed ? 'selected' : ''}
        >
          Completed
        </Link>
      </li>
    </ul>
  );
});

// --- Footer --------------------------------------------------------

const Footer = component('Footer')<{
  todos: Todo[];
  filter: TodoFilter;
}>((props) => {
  const onClearCompletedClick = () => dispatch(actions.clearCompleted());

  return () => {
    const completed = props.todos.filter((todo) => todo.completed).length,
      remaining = props.todos.length - completed;

    return (
      <footer className="footer">
        <span className="todo-count">
          <strong>{remaining}</strong> {remaining === 1 ? 'item' : 'items'} left
        </span>
        <Filters filter={props.filter} />
        {!!completed && (
          <button className="clear-completed" onClick={onClearCompletedClick}>
            Clear completed
          </button>
        )}
      </footer>
    );
  };
});

function saveTodos(todos: Todo[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  } catch {}
}

function loadTodos(): Todo[] {
  try {
    try {
      const storedTodos = JSON.parse(localStorage.getItem(STORAGE_KEY) as any);

      if (Array.isArray(storedTodos) && storedTodos.length > 0) {
        return storedTodos;
      }
    } catch {}

    localStorage.removeItem(STORAGE_KEY);
  } catch {}

  return [];
}

const App = component('App', () => {
  const refresh = getRefresher();

  const history = createHashHistory(),
    getFilteredContent = (filter: TodoFilter) => {
      const todos = store.getState().todos;

      return (
        <div>
          <Header />
          {!!todos.length && <Main todos={todos} filter={filter} />}
          {!!todos.length && <Footer todos={todos} filter={filter} />}
        </div>
      );
    };

  effect(
    () =>
      store.subscribe(() => {
        saveTodos(store.getState().todos);
        refresh();
      }),
    () => []
  );

  return () => (
    <Router history={history}>
      <div path="/active">{getFilteredContent(TodoFilter.Active)}</div>
      <div path="/completed">{getFilteredContent(TodoFilter.Completed)}</div>
      <div path="/">{getFilteredContent(TodoFilter.None)}</div>
    </Router>
  );
});

// --- main ----------------------------------------------------------

render(<App />, document.querySelector('.todoapp')!);
