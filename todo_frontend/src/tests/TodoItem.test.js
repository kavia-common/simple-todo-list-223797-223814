import { render, screen, fireEvent } from '@testing-library/react';
import TodoItem from '../components/TodoItem';
import '../__mocks__/localStorageMock';

const baseTodo = { id: '1', title: 'Sample', completed: false };

test('renders todo item and supports edit keyboard', () => {
  const onToggle = jest.fn();
  const onDelete = jest.fn();
  const onUpdate = jest.fn();

  render(
    <ul>
      <TodoItem todo={baseTodo} onToggle={onToggle} onDelete={onDelete} onUpdate={onUpdate} />
    </ul>
  );

  expect(screen.getByText('Sample')).toBeInTheDocument();
  fireEvent.doubleClick(screen.getByText('Sample'));
  const input = screen.getByLabelText(/edit todo/i);
  fireEvent.change(input, { target: { value: 'Changed' } });
  fireEvent.keyDown(input, { key: 'Enter', code: 'Enter' });

  expect(onUpdate).toHaveBeenCalledWith(expect.objectContaining({ title: 'Changed' }));
});

test('escape cancels edit', () => {
  const onToggle = jest.fn();
  const onDelete = jest.fn();
  const onUpdate = jest.fn();

  render(
    <ul>
      <TodoItem todo={baseTodo} onToggle={onToggle} onDelete={onDelete} onUpdate={onUpdate} />
    </ul>
  );

  fireEvent.doubleClick(screen.getByText('Sample'));
  const input = screen.getByLabelText(/edit todo/i);
  fireEvent.change(input, { target: { value: 'Nope' } });
  fireEvent.keyDown(input, { key: 'Escape', code: 'Escape' });

  expect(onUpdate).not.toHaveBeenCalled();
  expect(screen.getByText('Sample')).toBeInTheDocument();
});
