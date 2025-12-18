import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';

/**
 * PUBLIC_INTERFACE
 * TodoItem - Renders a single todo with edit, toggle, and delete actions.
 */
export default function TodoItem({ todo, onToggle, onDelete, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(todo.title);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const save = () => {
    const newTitle = draft.trim();
    if (!newTitle) {
      setIsEditing(false);
      setDraft(todo.title);
      return;
    }
    if (newTitle !== todo.title) {
      onUpdate({ ...todo, title: newTitle });
    }
    setIsEditing(false);
  };

  const cancel = () => {
    setDraft(todo.title);
    setIsEditing(false);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      save();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      cancel();
    }
  };

  return (
    <li className="todo-item" role="listitem" aria-label={`Todo: ${todo.title}`}>
      <input
        id={`chk-${todo.id}`}
        type="checkbox"
        className="checkbox"
        checked={!!todo.completed}
        onChange={() => onToggle(todo.id)}
        aria-checked={!!todo.completed}
        aria-label={`Mark "${todo.title}" as ${todo.completed ? 'incomplete' : 'complete'}`}
      />
      {isEditing ? (
        <input
          ref={inputRef}
          className="input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKeyDown}
          aria-label={`Edit todo ${todo.title}`}
        />
      ) : (
        <span
          className={`todo-title ${todo.completed ? 'completed' : ''}`}
          onDoubleClick={() => setIsEditing(true)}
          tabIndex={0}
          role="textbox"
          aria-readonly="true"
          onKeyDown={(e) => {
            if (e.key === 'Enter') setIsEditing(true);
          }}
        >
          {todo.title}
        </span>
      )}
      <div className="actions">
        {isEditing ? (
          <>
            <button className="btn btn-primary" onClick={save} aria-label="Save edit">
              Save
            </button>
            <button className="btn btn-ghost" onClick={cancel} aria-label="Cancel edit">
              Cancel
            </button>
          </>
        ) : (
          <>
            <button
              className="btn btn-ghost"
              onClick={() => setIsEditing(true)}
              aria-label="Edit todo"
            >
              Edit
            </button>
            <button
              className="btn btn-danger"
              onClick={() => onDelete(todo.id)}
              aria-label="Delete todo"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </li>
  );
}

TodoItem.propTypes = {
  todo: PropTypes.shape({
    id: PropTypes.string.isRequired,
    title: PropTypes.string.isRequired,
    completed: PropTypes.bool,
  }).isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};
