import './App.css'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState('');

  const fetchTodos = async () => {
      const response = await axios.get('http://localhost:5000/todos');
      setTodos(response.data);
  };

  const addTodo = async () => {
      if (newTodo.trim()) {
          const response = await axios.post('http://localhost:5000/todos', { title: newTodo });
          setTodos([...todos, response.data]);
          setNewTodo('');
      }
  };

  const toggleTodo = async (id, completed) => {
      const response = await axios.put(`http://localhost:5000/todos/${id}`, { completed: !completed });
      setTodos(todos.map(todo => (todo._id === id ? response.data : todo)));
  };

  const deleteTodo = async (id) => {
      await axios.delete(`http://localhost:5000/todos/${id}`);
      setTodos(todos.filter(todo => todo._id !== id));
  };

  const startEditing = (id, currentTitle) => {
      setEditingId(id);
      setEditingTitle(currentTitle);
  };

  const saveEdit = async (id) => {
      if (editingTitle.trim()) {
          const response = await axios.put(`http://localhost:5000/todos/${id}`, { title: editingTitle });
          setTodos(todos.map(todo => (todo._id === id ? response.data : todo)));
          setEditingId(null);
          setEditingTitle('');
      }
  };

  const cancelEdit = () => {
      setEditingId(null);
      setEditingTitle('');
  };

  useEffect(() => {
      fetchTodos();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
        <h1 className="text-3xl font-bold text-blue-600 mb-6">To-Do App</h1>
        <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-6">
            <div className="flex items-center mb-4">
                <input
                    type="text"
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    placeholder="Enter a new to-do"
                    className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
                <button
                    onClick={addTodo}
                    className="ml-4 px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600"
                >
                    Add
                </button>
            </div>
            <ul className="space-y-2">
                {todos.map((todo) => (
                    <li
                        key={todo._id}
                        className="flex items-center bg-gray-50 border rounded-lg px-4 py-2 shadow-sm"
                    >
                        <input
                            type="checkbox"
                            checked={todo.completed}
                            onChange={() => toggleTodo(todo._id, todo.completed)}
                            className="mr-4"
                        />
                        {editingId === todo._id ? (
                            <div className="flex-1 flex items-center space-x-2">
                                <input
                                    type="text"
                                    value={editingTitle}
                                    onChange={(e) => setEditingTitle(e.target.value)}
                                    className="flex-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
                                />
                                <button
                                    onClick={() => saveEdit(todo._id)}
                                    className="px-2 py-1 bg-green-500 text-white font-semibold rounded-md hover:bg-green-600"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={cancelEdit}
                                    className="px-2 py-1 bg-gray-400 text-white font-semibold rounded-md hover:bg-gray-500"
                                >
                                    Cancel
                                </button>
                            </div>
                        ) : (
                            <>
                                <span
                                    className={`flex-1 ${
                                        todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
                                    }`}
                                >
                                    {todo.title}
                                </span>
                                <button
                                    onClick={() => startEditing(todo._id, todo.title)}
                                    className="text-blue-500 hover:text-blue-700 mr-4"
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => deleteTodo(todo._id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    Delete
                                </button>
                            </>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    </div>
  );
}

export default App;
