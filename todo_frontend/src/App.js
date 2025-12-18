import React, { useEffect, useState } from 'react';
import './App.css';
import './index.css';
import Header from './components/Header';
import TodoForm from './components/TodoForm';
import TodoList from './components/TodoList';
import { useTodos } from './hooks/useTodos';

/**
 * PUBLIC_INTERFACE
 * App - Single page Todo application entry component.
 * Renders header, form, list, and actions with Ocean Professional styling.
 */
function App() {
  const {
    todos,
    addTodo,
    updateTodo,
    toggleTodo,
    deleteTodo,
    clearCompleted,
    loading,
    error,
  } = useTodos();

  const [theme] = useState('light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <div className="ocean-app">
      <Header />
      <main className="ocean-container" aria-live="polite">
        <section className="card" aria-labelledby="todo-section-title">
          <div className="card-header">
            <h2 id="todo-section-title" className="card-title">Your Tasks</h2>
            <button
              type="button"
              className="btn btn-amber"
              onClick={clearCompleted}
              aria-label="Clear completed todos"
            >
              Clear Completed
            </button>
          </div>

          <TodoForm onAdd={addTodo} />

          {loading && (
            <div role="status" aria-live="polite" className="info subtle">
              Loading todos...
            </div>
          )}

          {error && (
            <div role="alert" className="error">
              {error}
            </div>
          )}

          <TodoList
            todos={todos}
            onToggle={toggleTodo}
            onDelete={deleteTodo}
            onUpdate={updateTodo}
          />
        </section>
      </main>
      <footer className="ocean-footer" aria-label="Footer">
        <p>Todos are stored locally in your browser.</p>
      </footer>
    </div>
  );
}

export default App;
