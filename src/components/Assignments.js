import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import './Assignments.css';

function Assignments() {
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ projectId: "", employeeId: "", role: "" });

  useEffect(() => {
    const fetchProjects = async () => {
      const projSnap = await getDocs(collection(db, "projects"));
      setProjects(projSnap.docs.map(doc => doc.data()));
    };
    const fetchEmployees = async () => {
      const empSnap = await getDocs(collection(db, "employees"));
      setEmployees(empSnap.docs.map(doc => doc.data()));
    };
    fetchProjects();
    fetchEmployees();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await addDoc(collection(db, "assignments"), form);
    alert("Assigned!");
    setForm({ projectId: "", employeeId: "", role: "" });
  };

  return (
  <div className="assignments-container">
    <h2>Assign Project</h2>
    <form onSubmit={handleSubmit} className="assignment-form">
      <select
        name="projectId"
        value={form.projectId}
        onChange={handleChange}
        required
      >
        <option value="">Select Project</option>
        {projects.map((p) => (
          <option key={p.projectId} value={p.projectId}>
            {p.projectName}
          </option>
        ))}
      </select>

      <select
        name="employeeId"
        value={form.employeeId}
        onChange={handleChange}
        required
      >
        <option value="">Select Employee</option>
        {employees.map((e) => (
          <option key={e.employeeId} value={e.employeeId}>
            {e.name}
          </option>
        ))}
      </select>

      <select
        name="role"
        value={form.role}
        onChange={handleChange}
        required
      >
        <option value="">Select Role</option>
        <option value="Developer">Developer</option>
        <option value="Tester">Tester</option>
        <option value="Manager">Manager</option>
      </select>

      <button type="submit">Assign</button>
    </form>
  </div>
);
}

export default Assignments;
