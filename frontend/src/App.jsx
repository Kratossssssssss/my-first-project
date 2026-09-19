import { useEffect, useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8080/api/applications";

const emptyForm = {
  company: "",
  jobTitle: "",
  location: "",
  jobType: "Internship",
  applicationDate: "",
  status: "APPLIED",
  salary: "",
  jobUrl: "",
  notes: "",
  userId: 1,
};

function App() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchApplications();
  }, []);

  async function fetchApplications() {
    try {
      const response = await fetch(API_URL);

      if (!response.ok) {
        throw new Error("Failed to fetch applications");
      }

      const data = await response.json();
      setApplications(data);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  }

  function handleChange(event) {
    const {name, value} = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function openAddForm() {
    setEditingId(null);
    setForm(emptyForm);
    setShowForm(true);
  }

  function openEditForm(application) {
    setEditingId(application.id);

    setForm({
      company: application.company || "",
      jobTitle: application.jobTitle || "",
      location: application.location || "",
      jobType: application.jobType || "Internship",
      applicationDate: application.applicationDate || "",
      status: application.status || "APPLIED",
      salary: application.salary || "",
      jobUrl: application.jobUrl || "",
      notes: application.notes || "",
      userId: application.userId || 1,
    });

    setShowForm(true);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);

    const application = {
      ...form,
      salary: Number(form.salary),
      userId: Number(form.userId),
    };

    try {
      let response;

      if (editingId !== null) {
        response = await fetch(`${API_URL}/${editingId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(application),
        });
      } else {
        response = await fetch(API_URL, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(application),
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save application");
      }

      const savedApplication = await response.json();

      if (editingId !== null) {
        setApplications((previous) =>
            previous.map((app) =>
                app.id === editingId ? savedApplication : app
            )
        );
      } else {
        setApplications((previous) => [
          ...previous,
          savedApplication,
        ]);
      }

      setForm(emptyForm);
      setEditingId(null);
      setShowForm(false);
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to save application");
    } finally {
      setSaving(false);
    }
  }

  async function deleteApplication(id) {
    const confirmed = window.confirm(
        "Are you sure you want to delete this application?"
    );

    if (!confirmed) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete application");
      }

      setApplications((previous) =>
          previous.filter((app) => app.id !== id)
      );
    } catch (error) {
      console.error("Error:", error);
      alert("Failed to delete application");
    }
  }

  const total = applications.length;

  const applied = applications.filter(
      (app) => app.status === "APPLIED"
  ).length;

  const interviews = applications.filter(
      (app) => app.status === "INTERVIEW"
  ).length;

  const rejected = applications.filter(
      (app) => app.status === "REJECTED"
  ).length;

  const filteredApplications = applications.filter((application) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
        application.company.toLowerCase().includes(search) ||
        application.jobTitle.toLowerCase().includes(search) ||
        application.location.toLowerCase().includes(search);

    const matchesStatus =
        statusFilter === "ALL" ||
        application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });


    return (
        <div className="app">
          <header className="header">
            <div>
              <h1>Job Tracker</h1>
              <p>Track your job and internship applications</p>
            </div>

            <button className="add-button" onClick={openAddForm}>
              + Add Application
            </button>
          </header>

          <main>
            <section className="stats">
              <div className="stat-card">
                <span>Total Applications</span>
                <strong>{total}</strong>
              </div>

              <div className="stat-card">
                <span>Applied</span>
                <strong>{applied}</strong>
              </div>

              <div className="stat-card">
                <span>Interviews</span>
                <strong>{interviews}</strong>
              </div>

              <div className="stat-card">
                <span>Rejected</span>
                <strong>{rejected}</strong>
              </div>
            </section>

            <section className="applications">
              <div className="section-header">
                <div>
                  <h2>Applications</h2>
                  <p>Your recent job applications</p>
                </div>

                <button
                    className="refresh-button"
                    onClick={fetchApplications}
                >
                  Refresh
                </button>
              </div>
              <div className="filters">
                <input
                    type="text"
                    className="search-input"
                    placeholder="🔍 Search company, job title, or location..."
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                />

                <select
                    className="status-filter"
                    value={statusFilter}
                    onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <option value="ALL">All Statuses</option>
                  <option value="SAVED">Saved</option>
                  <option value="APPLIED">Applied</option>
                  <option value="SCREENING">Screening</option>
                  <option value="INTERVIEW">Interview</option>
                  <option value="REJECTED">Rejected</option>
                </select>
              </div>

              {loading ? (
                  <p className="message">Loading applications...</p>
              ) : applications.length === 0 ? (
                  <p className="message">No applications found.</p>
              ) : (
                  <div className="table-container">
                    <table>
                      <thead>
                      <tr>
                        <th>Company</th>
                        <th>Position</th>
                        <th>Location</th>
                        <th>Type</th>
                        <th>Status</th>
                        <th>Salary</th>
                        <th>Actions</th>
                      </tr>
                      </thead>

                      <tbody>
                      {filteredApplications.map((application) => (
                          <tr key={application.id}>
                            <td className="company">
                              {application.company}
                            </td>

                            <td>{application.jobTitle}</td>

                            <td>{application.location}</td>

                            <td>{application.jobType}</td>

                            <td>
                        <span
                            className={`status ${application.status.toLowerCase()}`}
                        >
                          {application.status}
                        </span>
                            </td>

                            <td>
                              ₹
                              {Number(application.salary).toLocaleString(
                                  "en-IN"
                              )}
                            </td>

                            <td>
                              <div className="actions">
                                <button
                                    className="edit-button"
                                    onClick={() =>
                                        openEditForm(application)
                                    }
                                >
                                  ✏️
                                </button>

                                <button
                                    className="delete-button"
                                    onClick={() =>
                                        deleteApplication(application.id)
                                    }
                                >
                                  🗑️
                                </button>
                              </div>
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                  </div>
              )}
            </section>
          </main>

          {showForm && (
              <div className="modal-overlay">
                <div className="modal">
                  <div className="modal-header">
                    <div>
                      <h2>
                        {editingId !== null
                            ? "Edit Application"
                            : "Add Application"}
                      </h2>

                      <p>
                        {editingId !== null
                            ? "Update your application details."
                            : "Enter the details of your application."}
                      </p>
                    </div>

                    <button
                        className="close-button"
                        onClick={() => setShowForm(false)}
                    >
                      ×
                    </button>
                  </div>

                  <form onSubmit={handleSubmit}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Company</label>

                        <input
                            name="company"
                            value={form.company}
                            onChange={handleChange}
                            placeholder="e.g. Google"
                            required
                        />
                      </div>

                      <div className="form-group">
                        <label>Job Title</label>

                        <input
                            name="jobTitle"
                            value={form.jobTitle}
                            onChange={handleChange}
                            placeholder="e.g. Software Engineer Intern"
                            required
                        />
                      </div>

                      <div className="form-group">
                        <label>Location</label>

                        <input
                            name="location"
                            value={form.location}
                            onChange={handleChange}
                            placeholder="e.g. Hyderabad"
                            required
                        />
                      </div>

                      <div className="form-group">
                        <label>Job Type</label>

                        <select
                            name="jobType"
                            value={form.jobType}
                            onChange={handleChange}
                        >
                          <option value="Internship">Internship</option>
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Application Date</label>

                        <input
                            type="date"
                            name="applicationDate"
                            value={form.applicationDate}
                            onChange={handleChange}
                            required
                        />
                      </div>

                      <div className="form-group">
                        <label>Status</label>

                        <select
                            name="status"
                            value={form.status}
                            onChange={handleChange}
                        >
                          <option value="SAVED">Saved</option>
                          <option value="APPLIED">Applied</option>
                          <option value="SCREENING">Screening</option>
                          <option value="INTERVIEW">Interview</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Salary</label>

                        <input
                            type="number"
                            name="salary"
                            value={form.salary}
                            onChange={handleChange}
                            placeholder="e.g. 50000"
                            min="0"
                            required
                        />
                      </div>

                      <div className="form-group">
                        <label>Job URL</label>

                        <input
                            type="url"
                            name="jobUrl"
                            value={form.jobUrl}
                            onChange={handleChange}
                            placeholder="https://..."
                        />
                      </div>

                      <div className="form-group full-width">
                        <label>Notes</label>

                        <textarea
                            name="notes"
                            value={form.notes}
                            onChange={handleChange}
                            placeholder="Add notes about this application..."
                            rows="4"
                        />
                      </div>
                    </div>

                    <div className="form-actions">
                      <button
                          type="button"
                          className="cancel-button"
                          onClick={() => setShowForm(false)}
                      >
                        Cancel
                      </button>

                      <button
                          type="submit"
                          className="save-button"
                          disabled={saving}
                      >
                        {saving
                            ? "Saving..."
                            : editingId !== null
                                ? "Update Application"
                                : "Save Application"}
                      </button>
                    </div>
                  </form>
                </div>
              </div>
          )}
        </div>
    );
  }
  export default App;