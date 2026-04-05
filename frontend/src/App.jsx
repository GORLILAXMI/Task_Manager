import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [status, setStatus] = useState("Pending");
  const [editingId, setEditingId] = useState(null);

  const API_URL = "http://localhost:8081/tasks";

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await axios.get(API_URL);
    setTasks(res.data);
  };

  const handleAdd = async () => {
    if (!title || !deadline) return;

    if (editingId) {
      await axios.put(`${API_URL}/${editingId}`, {
        title,
        description,
        deadline,
        status,
      });
      setEditingId(null);
    } else {
      await axios.post(API_URL, {
        title,
        description,
        deadline,
        status,
      });
    }

    setTitle("");
    setDescription("");
    setDeadline("");
    setStatus("Pending");

    fetchTasks();
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${id}`);
    fetchTasks();
  };

  const handleEdit = (task) => {
    setTitle(task.title);
    setDescription(task.description);
    setDeadline(task.deadline);
    setStatus(task.status);
    setEditingId(task.id);
  };

  return (
  <div>
    <h1 className="header">Manage your tasks efficiently 🚀</h1>

    {/* DASHBOARD STATS */}
    <div className="stats">
      <div className="stat-card">
        <h3>{tasks.length}</h3>
        <p>Total</p>
      </div>

      <div className="stat-card">
        <h3>{tasks.filter(t => t.status === "Pending").length}</h3>
        <p>Pending</p>
      </div>

      <div className="stat-card">
        <h3>{tasks.filter(t => t.status === "Completed").length}</h3>
        <p>Completed</p>
      </div>
    </div>

    {/* FORM */}
    <div className="form-container">
      <input
        type="text"
        placeholder="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />

      <textarea
        placeholder="Task Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <input
        type="date"
        value={deadline}
        onChange={(e) => setDeadline(e.target.value)}
      />

      <select
        value={status}
        onChange={(e) => setStatus(e.target.value)}
      >
        <option>Pending</option>
        <option>Completed</option>
      </select>

      <button className="add-btn" onClick={handleAdd}>
        {editingId ? "Update Task" : "Add Task"}
      </button>
    </div>

    {/* TASKS */}
    <div className="task-grid">
      {tasks.map((task, index) => (
        <div key={task.id} className="task-card">
          <h3>{index + 1}. {task.title}</h3>

          <p>{task.description}</p>

          <p>📅 {task.deadline}</p>

          <span className={`status ${task.status === "Completed" ? "completed" : "pending"}`}>
            {task.status}
          </span>

          <div className="btn-group">
            <button
              className="edit-btn"
              onClick={() => handleEdit(task)}
            >
              Edit
            </button>

            <button
              className="delete-btn"
              onClick={() => handleDelete(task.id)}
              style={{ marginLeft: "10px" }}
            >
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  </div>
);
}

export default App;