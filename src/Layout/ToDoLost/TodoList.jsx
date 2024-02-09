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
  const priorityColor = priority => {
    switch (priority) {
      case 'low':
        return 'bg-green-500';
      case 'medium':
        return 'bg-yellow-500';
      case 'high':
        return 'bg-red-500';
      default:
        return 'bg-green-500';
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
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="border px-4 py-2">Task</th>
            <th className="border px-4 py-2">Priority</th>
            <th className="border px-4 py-2">Status</th>
            <th className="border px-4 py-2">Action</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr >
              <td className="border px-4 py-2">
                {task.text}
              </td>
              <td className={`border px-4 py-2 ${priorityColor(task.priority)}`}>
                {
                  
                  task.priority
                }
              </td>
              <td className="border px-4 py-2">
                <button
                  
                >
                  {task.completed ? 'Completed' : 'Complete'}
                </button>
              </td>
              <td>
              <button
                      
                      className="px-3 py-1 bg-blue-500 text-white rounded focus:outline-none mr-2"
                    >
                      Edit
                    </button>
                    <button
                      className="px-3 py-1 bg-red-500 text-white rounded focus:outline-none"
                    >
                      Delete
                    </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodoList;
