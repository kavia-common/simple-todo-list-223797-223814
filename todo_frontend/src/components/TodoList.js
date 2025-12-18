import React from 'react';
import PropTypes from 'prop-types';
import TodoItem from './TodoItem';

/**
 * PUBLIC_INTERFACE
 * TodoList - Renders list of todos or empty state.
 */
export default function TodoList({ todos, onToggle, onDelete, onUpdate }) {
  if (!todos.length) {
    return (
      <div className="info subtle" role="status" aria-live="polite">
        No todos yet. Add your first task above.
      </div>
    );
  }

  return (
    <ul className="todo-list" role="list" aria-label="Todo list">
      {todos.map((t) => (
        <TodoItem
          key={t.id}
          todo={t}
          onToggle={onToggle}
          onDelete={onDelete}
          onUpdate={onUpdate}
        />
      ))}
    </ul>
  );
}

TodoList.propTypes = {
  todos: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      completed: PropTypes.bool,
    })
  ).isRequired,
  onToggle: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func.isRequired,
};
