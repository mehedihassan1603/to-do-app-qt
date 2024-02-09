import { useState } from "react";


const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState('low');

  const addTask = () => {
    if (newTask.trim() !== '') {
      const newTasks = [...tasks, { id: Date.now(), text: newTask, completed: false, priority: newTaskPriority }];
      setTasks(newTasks);
      setNewTask('');
      setNewTaskPriority('low');
    }
  };

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <div className="mb-4 flex">
        <input
          type="text"
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
          placeholder="Enter a new task..."
          className="mr-2 px-2 py-1 border border-gray-300 focus:outline-none"
        />
        <select
          value={newTaskPriority}
          onChange={e => setNewTaskPriority(e.target.value)}
          className="mr-2 px-2 py-1 border border-gray-300 focus:outline-none"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button onClick={addTask} className="px-3 py-1 bg-blue-500 text-white hover:bg-blue-600 focus:outline-none">
          Add Task
        </button>
      </div>
    </div>
  );
};

export default TodoList;
