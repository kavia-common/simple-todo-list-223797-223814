import React, { useState } from 'react';
import PropTypes from 'prop-types';

/**
 * PUBLIC_INTERFACE
 * TodoForm - Input form for adding a new todo item.
 * onAdd(title: string): void
 */
export default function TodoForm({ onAdd }) {
  const [title, setTitle] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setTitle('');
  };

  return (
    <form onSubmit={submit} aria-label="Add todo form">
      <div className="input-row">
        <label htmlFor="new-todo" className="visually-hidden">
          New todo
        </label>
        <input
          id="new-todo"
          className="input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          aria-label="New todo title"
        />
        <button type="submit" className="btn btn-primary" aria-label="Add todo">
          Add
        </button>
      </div>
    </form>
  );
}

TodoForm.propTypes = {
  onAdd: PropTypes.func.isRequired,
};
