
import { useState } from "react";
import "./App.css";

const initialTickets = [
  {
    id: "TKT-001",
    title: "Wi-Fi not working",
    category: "Network",
    priority: "High",
    status: "Open",
    date: "07 Nov 2026",
    description: "Unable to connect to campus Wi-Fi."
  },
  {
    id: "TKT-002",
    title: "Computer lab system issue",
    category: "Hardware",
    priority: "Medium",
    status: "In Progress",
    date: "06 Nov 2026",
    description: "Computer system is not starting properly."
  },
  {
    id: "TKT-003",
    title: "Unable to access portal",
    category: "Technical",
    priority: "Low",
    status: "Resolved",
    date: "05 Nov 2026",
    description: "Unable to log in to the student portal."
  },
  {
    id: "TKT-004",
    title: "Projector not working",
    category: "Equipment",
    priority: "High",
    status: "Open",
    date: "04 Nov 2026",
    description: "Projector is not displaying anything."
  }
];

function App() {
  const [tickets, setTickets] = useState(initialTickets);
  const [activePage, setActivePage] = useState("Dashboard");
  const [showForm, setShowForm] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  const [form, setForm] = useState({
    title: "",
    category: "Technical",
    priority: "Medium",
    description: ""
  });

  const openCount = tickets.filter(
    t => t.status === "Open"
  ).length;

  const progressCount = tickets.filter(
    t => t.status === "In Progress"
  ).length;

  const resolvedCount = tickets.filter(
    t => t.status === "Resolved"
  ).length;

  const filteredTickets = tickets.filter(ticket => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(search.toLowerCase()) ||
      ticket.id.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "All" || ticket.status === filter;

    const matchesPage =
      activePage !== "My Tickets" ||
      ticket.id.startsWith("TKT-");

    return matchesSearch && matchesFilter && matchesPage;
  });

  function navigate(page) {
    setActivePage(page);
    setSearch("");
    setFilter("All");

    if (page === "Raise a Ticket") {
      setShowForm(true);
    }
  }

  function createTicket(e) {
    e.preventDefault();

    const newTicket = {
      ...form,
      id: `TKT-${String(tickets.length + 1).padStart(3, "0")}`,
      status: "Open",
      date: new Date().toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric"
      })
    };

    setTickets(previous => [newTicket, ...previous]);

    setForm({
      title: "",
      category: "Technical",
      priority: "Medium",
      description: ""
    });

    setShowForm(false);
    setActivePage("My Tickets");
  }

  function updateStatus(id, newStatus) {
    setTickets(previous =>
      previous.map(ticket =>
        ticket.id === id
          ? { ...ticket, status: newStatus }
          : ticket
      )
    );

    setSelectedTicket(previous =>
      previous ? { ...previous, status: newStatus } : null
    );
  }

  const pageTitles = {
    Dashboard: "Ticket Management",
    "My Tickets": "My Tickets",
    "Track Ticket": "Track Your Ticket",
    "Help & FAQs": "Help & FAQs",
    Notifications: "Notifications",
    Settings: "Settings"
  };

  return (
    <div className="app">

      {/* SIDEBAR */}
      <aside className="sidebar">

        <div className="brand">
          <div className="brand-icon">🎓</div>

          <div>
            <h2>CampusDesk</h2>
            <small>TICKET MANAGEMENT</small>
          </div>
        </div>

        <div className="campus-box">
          <span className="campus-logo">BV</span>

          <div>
            <b>Student Portal</b>
            <small>Campus Support</small>
          </div>

          <span className="arrow">⌄</span>
        </div>

        <p className="nav-heading">MAIN MENU</p>

        <button
          className={`nav-item ${activePage === "Dashboard" ? "active" : ""}`}
          onClick={() => navigate("Dashboard")}
        >
          <span>▦</span> Ticket Dashboard
        </button>

        <button
          className="nav-item"
          onClick={() => navigate("Raise a Ticket")}
        >
          <span>＋</span> Raise a Ticket
        </button>

        <button
          className={`nav-item ${activePage === "My Tickets" ? "active" : ""}`}
          onClick={() => navigate("My Tickets")}
        >
          <span>▤</span> My Tickets
        </button>

        <button
          className={`nav-item ${activePage === "Track Ticket" ? "active" : ""}`}
          onClick={() => navigate("Track Ticket")}
        >
          <span>◷</span> Track Ticket
        </button>

        <button
          className={`nav-item ${activePage === "Help & FAQs" ? "active" : ""}`}
          onClick={() => navigate("Help & FAQs")}
        >
          <span>▣</span> Help & FAQs
        </button>

        <p className="nav-heading">ACCOUNT</p>

        <button
          className={`nav-item ${activePage === "Notifications" ? "active" : ""}`}
          onClick={() => navigate("Notifications")}
        >
          <span>♧</span> Notifications
        </button>

        <button
          className={`nav-item ${activePage === "Settings" ? "active" : ""}`}
          onClick={() => navigate("Settings")}
        >
          <span>⚙</span> Settings
        </button>

        <div className="profile">
          <div className="profile-icon">A</div>

          <div>
            <b>Student</b>
            <small>Campus User</small>
          </div>

          <span className="arrow">⌄</span>
        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="main">

        {/* TOP HEADER */}
        <header className="topbar">

          <div className="breadcrumb">
            Campus <span>›</span>
            <b>{pageTitles[activePage]}</b>
          </div>

          <div className="top-right">

            <input
              className="global-search"
              placeholder="Search tickets..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />

            <button
              className="notification-button"
              onClick={() => navigate("Notifications")}
            >
              ♧
            </button>

            <div className="session">
              Academic Session
              <b>2026–27</b>
            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}
        <section className="content">

          {/* DASHBOARD AND TICKETS */}
          {(
            activePage === "Dashboard" ||
            activePage === "My Tickets" ||
            activePage === "Track Ticket"
          ) && (

            <>

              <div className="page-heading">

                <div>
                  <small className="eyebrow">
                    CAMPUS SUPPORT
                  </small>

                  <h1>{pageTitles[activePage]}</h1>

                  <p>
                    {activePage === "Dashboard"
                      ? "Raise issues, track requests and get support from your campus."
                      : activePage === "Track Ticket"
                      ? "Search and track the progress of your support requests."
                      : "View and manage all your submitted support requests."}
                  </p>
                </div>

                <button
                  className="gold-button"
                  onClick={() => setShowForm(true)}
                >
                  + &nbsp; Raise a Ticket
                </button>

              </div>

              {/* STATISTICS */}
              {activePage === "Dashboard" && (

                <div className="stats">

                  <div className="stat-card">
                    <div className="stat-top">
                      <span>Total Tickets</span>
                      <span className="stat-icon blue">▤</span>
                    </div>

                    <h2>{tickets.length.toString().padStart(2, "0")}</h2>
                    <small>All submitted tickets</small>
                  </div>

                  <div className="stat-card">
                    <div className="stat-top">
                      <span>Open Tickets</span>
                      <span className="stat-icon red">◷</span>
                    </div>

                    <h2>{openCount.toString().padStart(2, "0")}</h2>
                    <small>Awaiting resolution</small>
                  </div>

                  <div className="stat-card">
                    <div className="stat-top">
                      <span>In Progress</span>
                      <span className="stat-icon gold">◴</span>
                    </div>

                    <h2>{progressCount.toString().padStart(2, "0")}</h2>
                    <small>Currently being handled</small>
                  </div>

                  <div className="stat-card">
                    <div className="stat-top">
                      <span>Resolved</span>
                      <span className="stat-icon green">✓</span>
                    </div>

                    <h2>{resolvedCount.toString().padStart(2, "0")}</h2>
                    <small>Successfully completed</small>
                  </div>

                </div>
              )}

              {/* TICKET TABLE */}
              <section className="ticket-panel">

                <div className="panel-header">

                  <div>
                    <h3>
                      {activePage === "Track Ticket"
                        ? "Track Your Requests"
                        : "Recent Tickets"}
                    </h3>

                    <p>
                      View ticket details and current status
                    </p>
                  </div>

                  <div className="filters">

                    <select
                      value={filter}
                      onChange={e => setFilter(e.target.value)}
                    >
                      <option value="All">All Status</option>
                      <option value="Open">Open</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Resolved">Resolved</option>
                    </select>

                  </div>

                </div>

                <div className="table-wrap">

                  <table>

                    <thead>
                      <tr>
                        <th>Ticket ID</th>
                        <th>Issue Title</th>
                        <th>Category</th>
                        <th>Priority</th>
                        <th>Status</th>
                        <th>Date</th>
                        <th>Action</th>
                      </tr>
                    </thead>

                    <tbody>

                      {filteredTickets.map(ticket => (

                        <tr key={ticket.id}>

                          <td className="ticket-id">
                            {ticket.id}
                          </td>

                          <td className="ticket-title">
                            {ticket.title}
                          </td>

                          <td>{ticket.category}</td>

                          <td>
                            <span className={`priority ${ticket.priority.toLowerCase()}`}>
                              {ticket.priority}
                            </span>
                          </td>

                          <td>
                            <span className={`status ${ticket.status.toLowerCase().replace(" ", "-")}`}>
                              {ticket.status}
                            </span>
                          </td>

                          <td>{ticket.date}</td>

                          <td>
                            <button
                              className="view-button"
                              onClick={() => setSelectedTicket(ticket)}
                            >
                              View
                            </button>
                          </td>

                        </tr>

                      ))}

                      {filteredTickets.length === 0 && (
                        <tr>
                          <td colSpan="7" className="empty">
                            No tickets found.
                          </td>
                        </tr>
                      )}

                    </tbody>

                  </table>

                </div>

                <div className="table-footer">
                  Showing {filteredTickets.length} of {tickets.length} tickets
                </div>

              </section>

              {/* HELP CARD */}
              <div className="help-card">

                <span className="help-icon">♧</span>

                <div>
                  <b>Need assistance?</b>

                  <p>
                    Raise a ticket and our campus support team
                    will help you resolve your issue.
                  </p>
                </div>

                <button
                  className="text-button"
                  onClick={() => navigate("Help & FAQs")}
                >
                  Get Help →
                </button>

              </div>

            </>
          )}

          {/* HELP AND FAQ PAGE */}
          {activePage === "Help & FAQs" && (

            <div className="simple-panel">
              <h2>How can we help you?</h2>
              <p>Find answers to common campus support questions.</p>

              <div className="faq-item">
                <b>How do I raise a ticket?</b>
                <p>Click on Raise a Ticket, fill in the issue details and submit the form.</p>
              </div>

              <div className="faq-item">
                <b>How can I track my ticket?</b>
                <p>Open Track Ticket and search using your ticket ID or issue title.</p>
              </div>

              <div className="faq-item">
                <b>What do ticket statuses mean?</b>
                <p>Open means waiting for action, In Progress means being handled, and Resolved means completed.</p>
              </div>

              <button className="gold-button" onClick={() => setShowForm(true)}>
                Raise a Ticket
              </button>
            </div>

          )}

          {/* NOTIFICATIONS PAGE */}
          {activePage === "Notifications" && (

            <div className="simple-panel">
              <h2>Notifications</h2>
              <p>Your ticket updates will appear here.</p>

              {tickets.slice(0, 4).map(ticket => (
                <div className="faq-item" key={ticket.id}>
                  <b>{ticket.id} – {ticket.title}</b>
                  <p>Current status: {ticket.status}</p>
                </div>
              ))}
            </div>

          )}

          {/* SETTINGS PAGE */}
          {activePage === "Settings" && (

            <div className="simple-panel">
              <h2>Account Settings</h2>
              <p>Campus support account information.</p>

              <div className="faq-item">
                <b>Account Type</b>
                <p>Student</p>
              </div>

              <div className="faq-item">
                <b>Academic Session</b>
                <p>2026–27</p>
              </div>

              <div className="faq-item">
                <b>Module</b>
                <p>Ticket Management</p>
              </div>
            </div>

          )}

        </section>

      </main>

      {/* RAISE TICKET MODAL */}
      {showForm && (

        <div className="modal-overlay">

          <form className="ticket-form" onSubmit={createTicket}>

            <div className="form-heading">

              <div>
                <h2>Raise a New Ticket</h2>
                <p>Provide details about your issue.</p>
              </div>

              <button
                type="button"
                className="close-button"
                onClick={() => setShowForm(false)}
              >
                ✕
              </button>

            </div>

            <label>Issue Title</label>

            <input
              required
              maxLength="100"
              placeholder="Enter issue title"
              value={form.title}
              onChange={e => setForm({
                ...form,
                title: e.target.value
              })}
            />

            <label>Category</label>

            <select
              value={form.category}
              onChange={e => setForm({
                ...form,
                category: e.target.value
              })}
            >
              <option>Technical</option>
              <option>Network</option>
              <option>Hardware</option>
              <option>Software</option>
              <option>Equipment</option>
              <option>Other</option>
            </select>

            <label>Priority</label>

            <select
              value={form.priority}
              onChange={e => setForm({
                ...form,
                priority: e.target.value
              })}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>

            <label>Description</label>

            <textarea
              required
              rows="4"
              maxLength="1000"
              placeholder="Describe your issue..."
              value={form.description}
              onChange={e => setForm({
                ...form,
                description: e.target.value
              })}
            />

            <div className="form-actions">

              <button
                type="button"
                className="cancel-button"
                onClick={() => setShowForm(false)}
              >
                Cancel
              </button>

              <button type="submit" className="gold-button">
                Submit Ticket
              </button>

            </div>

          </form>

        </div>

      )}

      {/* TICKET DETAILS MODAL */}
      {selectedTicket && (

        <div className="modal-overlay">

          <div className="ticket-form">

            <div className="form-heading">
              <div>
                <small className="eyebrow">TICKET DETAILS</small>
                <h2>{selectedTicket.id}</h2>
              </div>

              <button
                className="close-button"
                onClick={() => setSelectedTicket(null)}
              >
                ✕
              </button>
            </div>

            <div className="detail-item">
              <small>Issue Title</small>
              <b>{selectedTicket.title}</b>
            </div>

            <div className="detail-item">
              <small>Category</small>
              <b>{selectedTicket.category}</b>
            </div>

            <div className="detail-item">
              <small>Priority</small>
              <b>{selectedTicket.priority}</b>
            </div>

            <div className="detail-item">
              <small>Description</small>
              <p>{selectedTicket.description}</p>
            </div>

            <div className="detail-item">
              <small>Current Status</small>
              <b>{selectedTicket.status}</b>
            </div>

            <div className="detail-item">
              <small>Submitted Date</small>
              <b>{selectedTicket.date}</b>
            </div>

            <label>Update Status (Demo)</label>

            <select
              value={selectedTicket.status}
              onChange={e => updateStatus(
                selectedTicket.id,
                e.target.value
              )}
            >
              <option>Open</option>
              <option>In Progress</option>
              <option>Resolved</option>
            </select>

            <div className="form-actions">
              <button
                className="gold-button"
                onClick={() => setSelectedTicket(null)}
              >
                Close
              </button>
            </div>

          </div>

        </div>

      )}

    </div>
  );
}

export default App;
