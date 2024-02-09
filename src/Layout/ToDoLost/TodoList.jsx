import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const TodoList = () => {
  const [tasks, setTasks] = useState(() => {
    const storedTasks = localStorage.getItem("tasks");
    return storedTasks ? JSON.parse(storedTasks) : [];
  });
  const [newTask, setNewTask] = useState("");
  const [newTaskPriority, setNewTaskPriority] = useState("low");
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTaskText, setEditedTaskText] = useState("");
  const [editedTaskPriority, setEditedTaskPriority] = useState("");
  const [filterPriority, setFilterPriority] = useState(null);

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
  const addTask = () => {
    if (newTask.trim() !== "") {
        const newTasks = [{ id: Date.now(), text: newTask, completed: false, priority: newTaskPriority }, ...tasks];
        setTasks(newTasks);
        setNewTask('');
        setNewTaskPriority('low');
      // Show a success message using SweetAlert
      Swal.fire({
        title: "Good job!",
        text: "You've successfully added a new task!",
        icon: "success",
      });
    } else {
      // Show an error message if the new task is empty
      Swal.fire({
        title: "Error!",
        text: "Task cannot be empty.",
        icon: "error",
        button: "OK",
      });
    }
  };

  const toggleCompletion = (id, completed) => {
    // Display a confirmation dialog using SweetAlert
    Swal.fire({
      title: completed
        ? "Are you sure you want to mark this task as incomplete?"
        : "Are you sure you want to mark this task as completed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: completed ? "Mark as Incomplete" : "Mark as Completed",
      cancelButtonText: "Cancel",
    }).then((result) => {
      // If user confirms the action
      if (result.isConfirmed) {
        // Toggle completion status
        const updatedTasks = tasks.map((task) =>
          task.id === id ? { ...task, completed: !completed } : task
        );
        // Update the state with the updated tasks
        setTasks(updatedTasks);
        // Show a success message using SweetAlert
        Swal.fire({
          title: completed
            ? "Task marked as incomplete!"
            : "Task marked as completed!",
          icon: "success",
        });
      }
    });
  };

  const editTask = (id) => {
    // Display a confirmation dialog using SweetAlert
    Swal.fire({
      title: "Are you sure?",
      text: "Once edited, the changes will be applied.",
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, edit it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      // If user confirms editing
      if (result.isConfirmed) {
        // Update the task with the edited text and priority
        const updatedTasks = tasks.map((task) =>
          task.id === id
            ? {
                ...task,
                text: editedTaskText || task.text,
                priority: editedTaskPriority || task.priority,
              }
            : task
        );
        // Update the state with the edited tasks
        setTasks(updatedTasks);
        // Show a success message using SweetAlert
        Swal.fire("Edited!", "Your task has been updated.", "success");
        // Clear the editing state
        setEditingTaskId(null);
        setEditedTaskText("");
        setEditedTaskPriority("");
      }
    });
  };

  const deleteTask = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this task!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedTasks = tasks.filter((task) => task.id !== id);
        setTasks(updatedTasks);
        Swal.fire("Deleted!", "Your task has been deleted.", "success");
      }
    });
  };

  const priorityColor = (priority) => {
    switch (priority) {
      case "low":
        return "bg-green-500";
      case "medium":
        return "bg-yellow-500";
      case "high":
        return "bg-red-500";
      default:
        return "bg-green-500";
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const filteredTasks = filterPriority
    ? tasks.filter((task) => task.priority === filterPriority)
    : tasks;

  return (
    <div className="container mx-auto mt-8">
      <h1 className="text-2xl font-bold mb-4">Todo List</h1>
      <div className="mb-4 flex">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task..."
          className="mr-2 px-2 py-1 border border-gray-300 focus:outline-none"
        />
        <select
          value={newTaskPriority}
          onChange={(e) => setNewTaskPriority(e.target.value)}
          className="mr-2 px-2 py-1 border border-gray-300 focus:outline-none"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          onClick={addTask}
          className="px-3 py-1 bg-blue-500 text-white hover:bg-blue-600 focus:outline-none"
        >
          Add Task
        </button>
      </div>
      <p>Total Tasks: {totalTasks}</p>
      <p>Completed Tasks: {completedTasks}</p>
      <div className="mb-4 flex">
        <select
          value={filterPriority || ""}
          onChange={(e) => setFilterPriority(e.target.value || null)}
          className="px-3 py-1 mr-2 bg-gray-300 hover:bg-gray-400 focus:outline-none"
        >
          <option value="">All</option>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
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
          {filteredTasks.map((task) => (
            <tr
              key={task.id}
              className={editingTaskId === task.id ? "bg-gray-100" : ""}
            >
              <td className="border px-4 py-2">
                {editingTaskId === task.id ? (
                  <input
                    type="text"
                    value={editedTaskText || task.text}
                    onChange={(e) => setEditedTaskText(e.target.value)}
                    className="px-2 py-1 border border-gray-300 focus:outline-none"
                  />
                ) : (
                  task.text
                )}
              </td>
              <td
                className={`border px-4 py-2 ${priorityColor(task.priority)}`}
              >
                {editingTaskId === task.id ? (
                  <select
                    value={editedTaskPriority || task.priority}
                    onChange={(e) => setEditedTaskPriority(e.target.value)}
                    className="px-2 py-1 border border-gray-300 focus:outline-none"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                ) : (
                  task.priority
                )}
              </td>
              <button
                onClick={() => toggleCompletion(task.id, task.completed)}
                className={`px-3 py-1 ${
                  task.completed ? "bg-green-500" : "bg-yellow-500"
                } text-white rounded focus:outline-none`}
              >
                {task.completed ? "Completed" : "Incomplete"}
              </button>

              <td className="border px-4 py-2">
                {editingTaskId === task.id ? (
                  <>
                    <button
                      onClick={() => editTask(task.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded focus:outline-none mr-2"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingTaskId(null);
                        setEditedTaskText("");
                        setEditedTaskPriority("");
                      }}
                      className="px-3 py-1 bg-gray-500 text-white rounded focus:outline-none"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setEditingTaskId(task.id)}
                      className="px-3 py-1 bg-blue-500 text-white rounded focus:outline-none mr-2"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteTask(task.id)}
                      className="px-3 py-1 bg-red-500 text-white rounded focus:outline-none"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default TodoList;
