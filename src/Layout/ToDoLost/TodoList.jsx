import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import "./styles.css";
import ReactPaginate from "react-paginate";

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
  const [pageNumber, setPageNumber] = useState(0);
  const tasksPerPage = 10;
  const pagesVisited = pageNumber * tasksPerPage;

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);
  const addTask = () => {
    if (newTask.trim() !== "") {
      const newTasks = [
        {
          id: Date.now(),
          text: newTask,
          completed: false,
          priority: newTaskPriority,
        },
        ...tasks,
      ];
      setTasks(newTasks);
      setNewTask("");
      setNewTaskPriority("low");
      Swal.fire({
        title: "Good job!",
        text: "You've successfully added a new task!",
        icon: "success",
      });
    } else {
      Swal.fire({
        title: "Error!",
        text: "Task cannot be empty.",
        icon: "error",
        button: "OK",
      });
    }
  };

  const toggleCompletion = (id, completed) => {
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
      if (result.isConfirmed) {
        const updatedTasks = tasks.map((task) =>
          task.id === id ? { ...task, completed: !completed } : task
        );
        setTasks(updatedTasks);
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
      if (result.isConfirmed) {
        const updatedTasks = tasks.map((task) =>
          task.id === id
            ? {
                ...task,
                text: editedTaskText || task.text,
                priority: editedTaskPriority || task.priority,
              }
            : task
        );
        setTasks(updatedTasks);
        Swal.fire("Edited!", "Your task has been updated.", "success");
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
        return "bg-green-400";
      case "medium":
        return "bg-yellow-400";
      case "high":
        return "bg-red-400";
      default:
        return "bg-green-400";
    }
  };

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const filteredTasks = filterPriority
    ? tasks.filter((task) => task.priority === filterPriority)
    : tasks;

  const handlePageChange = ({ selected }) => {
    setPageNumber(selected);
  };

  const displayedTasks = filteredTasks.slice(
    pagesVisited,
    pagesVisited + tasksPerPage
  );

  return (
    <div className="container mx-auto pt-8 mb-10 bg-gray-300">
      <h1 className="text-3xl font-bold text-center mb-8">Todo List</h1>
      <div className="mb-6 w-10/12 md:w-9/12 mx-auto flex flex-col md:flex-row gap-3 justify-center items-center">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Enter a new task..."
          className="mr-2 px-3 py-2 w-full border border-gray-300 rounded-lg focus:outline-none"
        />
        <select
          value={newTaskPriority}
          onChange={(e) => setNewTaskPriority(e.target.value)}
          className="mr-2 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button
          onClick={addTask}
          className="px-4 w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none"
        >
          Add Task
        </button>
      </div>
      <div className="flex justify-center gap-10 text-xl my-6">
        <p className="task-counter">
          Total Tasks: <span className="font-bold">{totalTasks}</span>
        </p>
        <p className="task-counter">
          Completed Tasks: <span className="font-bold">{completedTasks}</span>
        </p>
      </div>
      <div className="mb-6 flex justify-center items-center">
        <h1>Filter By Priority: </h1>
        <select
          value={filterPriority || ""}
          onChange={(e) => setFilterPriority(e.target.value || null)}
          className="px-4 py-2 bg-gray-200 border border-slate-600 rounded-lg focus:outline-none"
        >
          <option value="">All</option>
          <option value="low">Low Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="high">High Priority</option>
        </select>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full bg-cyan-400 border-gray-300 rounded-lg shadow-md">
          <thead>
            <tr className="bg-slate-600 border-b text-white font-bold text-sm md:text-lg">
              <th className="px-1 md:px-4 py-2">Task</th>
              <th className="px-1 md:px-4 py-2">Priority</th>
              <th className="px-1 md:px-4 py-2">Status</th>
              <th className="px-1 md:px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {displayedTasks.map((task) => (
              <tr
                key={task.id}
                className={
                  editingTaskId === task.id ? "border-t border-gray-300" : ""
                }
              >
                <td className="border text-center px-4 py-2">
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
                  className={`px-1 border-b text-center font-bold ${priorityColor(
                    task.priority
                  )}`}
                >
                  {editingTaskId === task.id ? (
                    <select
                      value={editedTaskPriority || task.priority}
                      onChange={(e) => setEditedTaskPriority(e.target.value)}
                      className="px-2 border border-gray-300 focus:outline-none"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  ) : (
                    task.priority
                  )}
                </td>
                <td className="text-center border-b">
                  <button
                    onClick={() => toggleCompletion(task.id, task.completed)}
                    className={`px-4 py-2 ${
                      task.completed
                        ? "bg-green-500 hover:bg-green-600"
                        : "bg-yellow-500 hover:bg-yellow-600"
                    } text-white text-sm md:text-lg rounded focus:outline-none`}
                  >
                    {task.completed ? "Completed" : "Incomplete"}
                  </button>
                </td>

                <td className="border py-2 text-center">
                  {editingTaskId === task.id ? (
                    <>
                      <button
                        onClick={() => editTask(task.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded focus:outline-none mr-2"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => {
                          setEditingTaskId(null);
                          setEditedTaskText("");
                          setEditedTaskPriority("");
                        }}
                        className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 focus:outline-none"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => setEditingTaskId(task.id)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none mr-2"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none"
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
      <div className="pagination-container">
        <ReactPaginate
          previousLabel={"Previous"}
          nextLabel={"Next"}
          pageCount={Math.ceil(tasks.length / tasksPerPage)}
          onPageChange={handlePageChange}
          containerClassName={"pagination"}
          activeClassName={"active"}
        />
      </div>
    </div>
  );
};

export default TodoList;
