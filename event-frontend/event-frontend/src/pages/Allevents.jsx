// ================= IMPORTS =================
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./dashboard.css";
import { jwtDecode } from "jwt-decode";
import toast, { Toaster } from "react-hot-toast";

// ================= ALL EVENTS PAGE =================
function AllEvents() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ================= GET ROLE FROM TOKEN =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
      } catch (err) {
        console.log("Invalid token");
      }
    }
  }, []);

  // ================= FETCH ALL EVENTS =================
  const fetchAllEvents = async () => {
    try {
      setLoading(true);
      const res = await API.get("/events/getAllEvents");
      setEvents(res.data.events || []);
    } catch (error) {
      console.log("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllEvents();
  }, []);

  // ================= FILTERED EVENTS =================
  const filteredEvents = events.filter(
    (event) =>
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.clubName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ================= UI =================
  return (
    <div className="dashboard">
      <Toaster position="top-center" />

      {/* ===== FIXED HEADER ===== */}
      <div className="dashboard-header">
        <div className="header-inner">

          {/* Back button + Title */}
          <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
            <button className="all-events-back-btn" onClick={() => navigate("/dashboard")}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2.5"
                strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6" />
              </svg>
            </button>
            <h2 className="dashboard-title">All Events</h2>
          </div>

          {/* ===== SEARCH BAR ===== */}
          <div className="search-wrapper">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
              viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="search-input"
              type="text"
              placeholder="Search events or clubs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear-btn" onClick={() => setSearchQuery("")}>✕</button>
            )}
          </div>

          {/* Spacer */}
          <div style={{ marginLeft: "auto" }} />
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="dashboard-content">
        {loading ? (
          <div className="loading">
            <h2>Loading events...</h2>
          </div>
        ) : (
          <div className="club-grid">

            {/* No events at all */}
            {events.length === 0 && (
              <div className="no-events">
                <div className="no-events-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                </div>
                <h3>No Events Yet</h3>
                <p>No events have been added across any clubs yet.</p>
              </div>
            )}

            {/* No search results */}
            {events.length > 0 && filteredEvents.length === 0 && (
              <div className="no-events">
                <div className="no-events-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32"
                    viewBox="0 0 24 24" fill="none" stroke="currentColor"
                    strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <h3>No events found</h3>
                <p>No events match "{searchQuery}". Try a different keyword.</p>
              </div>
            )}

            {/* Event Cards — navigate to detail page on click */}
            {filteredEvents.map((event) => (
              <div
                className="club-card"
                key={event._id}
                onClick={() => navigate(`/event/${event._id}`)}
              >
                <img src={event.image} alt={event.title} />
                <div className="club-content">
                  {event.clubName && (
                    <span className="event-club-badge">{event.clubName}</span>
                  )}
                  <h3>{event.title}</h3>
                  <p>{event.description}</p>
                </div>
              </div>
            ))}

          </div>
        )}
      </div>
    </div>
  );
}

export default AllEvents;