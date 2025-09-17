// src/components/Projects.js
import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import "./Projects.css";

function Projects() {
  const [projects, setProjects] = useState([]);
  const [form, setForm] = useState({ projectId: "", projectName: "", projectTitle: "", duration: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchProjects = async () => {
      const querySnapshot = await getDocs(collection(db, "projects"));
      setProjects(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchProjects();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      const projectRef = doc(db, "projects", editingId);
      await updateDoc(projectRef, form);
      setEditingId(null);
    } else {
      await addDoc(collection(db, "projects"), form);
    }
    setForm({ projectId: "", projectName: "", projectTitle: "", duration: "" });

    const querySnapshot = await getDocs(collection(db, "projects"));
    setProjects(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "projects", id));
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleEdit = (project) => {
    setForm(project);
    setEditingId(project.id);
  };

  return (
  
  <div className="projects-container">
    <h2>Projects</h2>
    <form onSubmit={handleSubmit} className="projects-form">
      <input
        name="projectId"
        placeholder="Project ID"
        value={form.projectId}
        onChange={handleChange}
        required
      />
      <input
        name="projectName"
        placeholder="Project Name"
        value={form.projectName}
        onChange={handleChange}
        required
      />
      <input
        name="projectTitle"
        placeholder="Project Title"
        value={form.projectTitle}
        onChange={handleChange}
        required
      />
      <input
        name="duration"
        placeholder="Duration"
        value={form.duration}
        onChange={handleChange}
        required
      />
      <button type="submit">{editingId ? "Update" : "Add"}</button>
    </form>

    <ul className="projects-list">
      {projects.map((p) => (
        <li key={p.id}>
          {p.projectId} - {p.projectName} - {p.projectTitle} - {p.duration}
          <div className="project-buttons">
            <button onClick={() => handleEdit(p)}>Edit</button>
            <button onClick={() => handleDelete(p.id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

  
}

export default Projects;
