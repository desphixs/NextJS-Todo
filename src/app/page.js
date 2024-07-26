// This tells Next.js that this is a client component
// This allows you to use hooks like useState and useEffect.
"use client";

import { useState, useEffect } from "react";
import { FaEdit, FaTrash, FaSave, FaPlusCircle, FaCheckCircle } from "react-icons/fa";

export default function Home() {
    // Initialize state variable 'tasks' with an empty array to store the list of tasks
    const [tasks, setTasks] = useState([]);
    // Initialize state variable 'newTask' with an empty string to store the new task input value
    const [newTask, setNewTask] = useState("");
    // Initialize state variable 'editingTask' with null to track the task being edited
    const [editingTask, setEditingTask] = useState(null);

    // useEffect hook to run a function when the component mounts (on initial render)
    useEffect(() => {
        // Ensure the code runs only in the browser
        if (typeof window !== "undefined") {
            // Retrieve tasks from localStorage and parse them into a JavaScript object
            const storedTasks = JSON.parse(localStorage.getItem("tasks"));
            // If there are stored tasks, update the 'tasks' state with these tasks
            if (storedTasks) {
                setTasks(storedTasks);
            }
        }
    }, []); // Empty dependency array ensures this runs only once when the component mounts

    // useEffect hook to run a function whenever the 'tasks' state changes
    useEffect(() => {
        // Ensure the code runs only in the browser
        if (typeof window !== "undefined") {
            // Convert the 'tasks' state to a JSON string and save it in localStorage
            localStorage.setItem("tasks", JSON.stringify(tasks));
        }
    }, [tasks]); // Dependency array with 'tasks' ensures this runs every time 'tasks' changes

    // Function to add a new task to the list
    const addTask = () => {
        // Check if the new task input is not just whitespace
        if (newTask.trim()) {
            // Update the 'tasks' state by appending the new task object with a unique ID and the input value
            setTasks([...tasks, { text: newTask, id: Date.now(), completed: false }]);
            // Reset the 'newTask' state to an empty string
            setNewTask("");
        }
    };

    // Function to delete a task from the list based on its ID
    const deleteTask = (id) => {
        // Update the 'tasks' state by filtering out the task with the given ID
        setTasks(tasks.filter((task) => task.id !== id));
    };

    // Function to start editing a task
    const startEditing = (task) => {
        // Set 'editingTask' state to the task object that is being edited
        setEditingTask(task);
        // Set 'newTask' state to the text of the task being edited, so it appears in the input field
        setNewTask(task.text);
    };

    // Function to update an existing task
    const updateTask = () => {
        // Check if there is a task being edited
        if (editingTask) {
            // Update the 'tasks' state by mapping over the tasks and updating the text of the task being edited
            setTasks(tasks.map((task) => (task.id === editingTask.id ? { ...task, text: newTask } : task)));
            // Reset 'editingTask' state to null, indicating no task is being edited
            setEditingTask(null);
            // Reset 'newTask' state to an empty string
            setNewTask("");
        }
    };

    // Function to toggle the completion status of a task
    const toggleCompletion = (id) => {
        // Update the 'tasks' state by mapping over the tasks and toggling the 'completed' status of the task with the given ID
        setTasks(tasks.map((task) => (task.id === id ? { ...task, completed: !task.completed } : task)));
    };

    return (
        <main className="flex min-h-screen flex-col items-center justify-between p-24">
            <div>
                {/* Header for the to-do list */}
                <h1 className="text-3xl font-bold">Next.JS To-Do List</h1>
                {/* Input field for entering new tasks */}
                <div className="mt-5 flex items-center">
                    <input
                        type="text" // Set the input type to text
                        value={newTask} // Bind the input value to 'newTask' state
                        onChange={(e) => setNewTask(e.target.value)} // Update 'newTask' state on input change
                        className="h-10 rounded-md text-black ps-3 focus:outline-none focus:ring-0 focus:border-blue-500"
                        placeholder="Write todo"
                    />
                    {/* Button to add a new task or update an existing task */}
                    <button className="bg-blue-500 h-10 w-10 rounded-md ms-2 flex justify-center items-center" onClick={editingTask ? updateTask : addTask}>
                        {editingTask ? <FaSave size={20} /> : <FaPlusCircle size={20} />}{" "}
                    </button>
                </div>
                {/* Unordered list to display the tasks */}
                <ul className="mt-10">
                    {/* Map over the 'tasks' state to create a list item for each task */}
                    {tasks.map((task) => (
                        <li key={task.id} className={`bg-gray-900 p-3 rounded-md mb-3 flex justify-between items-center ${task.completed ? "line-through" : ""}`}>
                            {/* Task text with a strikethrough if the task is completed */}
                            <span className={`me-2 font-semibold ${task.completed ? "text-gray-500" : ""}`}>{task.text}</span>
                            {/* Buttons for completing, editing, and deleting tasks */}
                            <div className="flex gap-2">
                                <button className="bg-green-500 h-10 w-10 rounded-md flex justify-center items-center" onClick={() => toggleCompletion(task.id)}>
                                    <FaCheckCircle />
                                </button>
                                <button className="bg-blue-500 h-10 w-10 rounded-md flex justify-center items-center" onClick={() => startEditing(task)}>
                                    <FaEdit />
                                </button>
                                <button className="bg-red-500 h-10 w-10 rounded-md flex justify-center items-center" onClick={() => deleteTask(task.id)}>
                                    <FaTrash />
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
}
