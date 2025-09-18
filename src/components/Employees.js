import React, { useState, useEffect } from "react";
import { collection, addDoc, getDocs, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../firebase";
import emailjs from "emailjs-com";
import './Employees.css';


function Employees() {
  const [employees, setEmployees] = useState([]);
  const [form, setForm] = useState({ employeeId: "", name: "", mobile: "", address: "", email: "" });
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    const fetchEmployees = async () => {
      const querySnapshot = await getDocs(collection(db, "employees"));
      setEmployees(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };
    fetchEmployees();
  }, []);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const generateRandomCode = () => Math.random().toString(36).substring(2, 8).toUpperCase();

  const sendEmail = (email, code) => {
    const templateParams = { to_email: email, code };
    emailjs.send("service_hwimiwo", "template_ca5of29", templateParams, "JyF8cQZPegN3dBvKL")
      .then(() => alert("Verification code sent!"))
      .catch(err => alert("Failed to send email: " + err.text));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = generateRandomCode();

    if (editingId) {
      const empRef = doc(db, "employees", editingId);
      await updateDoc(empRef, { ...form, verificationCode: code });
      setEditingId(null);
    } else {
      await addDoc(collection(db, "employees"), { ...form, verificationCode: code });
    }

    sendEmail(form.email, code);
    setForm({ employeeId: "", name: "", mobile: "", address: "", email: "" });

    const querySnapshot = await getDocs(collection(db, "employees"));
    setEmployees(querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })));
  };

  const handleDelete = async (id) => {
    await deleteDoc(doc(db, "employees", id));
    setEmployees(employees.filter(e => e.id !== id));
  };

  const handleEdit = (employee) => {
    setForm(employee);
    setEditingId(employee.id);
  };

  return (
  <div className="employees-container">
    <h2>Employees</h2>
    <form onSubmit={handleSubmit} className="employees-form">
      <input
        name="employeeId"
        placeholder="ID"
        value={form.employeeId}
        onChange={handleChange}
        required
      />
      <input
        name="name"
        placeholder="Name"
        value={form.name}
        onChange={handleChange}
        required
      />
      <input
        name="mobile"
        placeholder="Mobile"
        value={form.mobile}
        onChange={handleChange}
        required
      />
      <input
        name="address"
        placeholder="Address"
        value={form.address}
        onChange={handleChange}
        required
      />
      <input
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
      />
      <button type="submit">{editingId ? "Update" : "Add"}</button>
    </form>

    <ul className="employees-list">
      {employees.map((e) => (
        <li key={e.id}>
          {e.employeeId} - {e.name} - {e.mobile} - {e.address}
          <div className="employee-buttons">
            <button onClick={() => handleEdit(e)}>Edit</button>
            <button onClick={() => handleDelete(e.id)}>Delete</button>
          </div>
        </li>
      ))}
    </ul>
  </div>
);

}

export default Employees;
