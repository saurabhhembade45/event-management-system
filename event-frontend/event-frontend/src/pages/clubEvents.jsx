// ================= IMPORTS =================
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import AddEventModal from "../components/addEventModal";
import EventCard from "../components/eventCard";
import EventDetailsModal from "../pages/eventDetailPage";
import "./dashboard.css";
import { jwtDecode } from "jwt-decode";
import toast, { Toaster } from "react-hot-toast";

// ================= DELETE CONFIRM MODAL =================
function DeleteConfirmModal({ onConfirm, onCancel, label = "event" }) {
  return (
    <div className="confirm-overlay">
      <div className="confirm-box">
        <div className="confirm-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        </div>
        <h3>Are you sure?</h3>
        <p>This action cannot be undone. All values associated with this {label} will be lost.</p>
        <button className="confirm-delete-btn" onClick={onConfirm}>
          Delete {label}
        </button>
        <button className="confirm-cancel-btn" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </div>
  );
}

// ================= CLUB EVENTS COMPONENT =================
function ClubEvents() {
  const { clubId } = useParams();
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [clubName, setClubName] = useState("");
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [role, setRole] = useState(null);
  const [confirmEventId, setConfirmEventId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ================= GET ROLE FROM TOKEN =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setRole(decoded.role);
    }
  }, []);

  // ================= FETCH EVENTS =================
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/events/club/${clubId}`);
      setEvents(res.data.events || []);
      if (res.data.clubName) {
        setClubName(res.data.clubName);
      }
    } catch (error) {
      console.log("Error fetching events:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, [clubId]);

  // ================= DELETE EVENT =================
  const handleDeleteEvent = async () => {
    try {
      await API.delete(`/events/deleteEvent/${confirmEventId}`);
      setConfirmEventId(null);
      fetchEvents();
      toast.success("Event deleted!");
    } catch (error) {
      toast.error("Failed to delete event.");
    }
  };

  const openDetails = (event) => setSelectedEvent(event);
  const closeDetails = () => setSelectedEvent(null);

  // ================= FILTERED EVENTS =================
  const filteredEvents = events.filter(
    (event) =>
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||   // ← FIXED: was event.name
      event.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="dashboard">
      <Toaster position="top-center" />

      {/* ===== DELETE CONFIRM MODAL ===== */}
      {confirmEventId && (
        <DeleteConfirmModal
          label="event"
          onConfirm={handleDeleteEvent}
          onCancel={() => setConfirmEventId(null)}
        />
      )}

      {/* ================= HEADER ================= */}
      <div className="dashboard-header">
        <div className="header-inner">
          <h2 className="dashboard-title">
            {clubName || "Club Events"}
          </h2>

          {/* ===== SEARCH BAR ===== */}
          <div className="search-wrapper">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              className="search-input"
              type="text"
              placeholder="Search events..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button
                className="search-clear-btn"
                onClick={() => setSearchQuery("")}
              >
                ✕
              </button>
            )}
          </div>

          {role === "admin" && (
            <div className="club-event-btn">
              <button
                className="animated-add-btn"
                onClick={() => setShowModal(true)}
              >
                <span className="button__text">Add Event</span>
                <span className="button__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" fill="none">
                    <line y2="19" y1="5" x2="12" x1="12"></line>
                    <line y2="12" y1="12" x2="19" x1="5"></line>
                  </svg>
                </span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ================= PAGE CONTENT ================= */}
      <div className="dashboard-content">
        {/* ADD EVENT MODAL */}
        {showModal && (
          <AddEventModal
            close={() => setShowModal(false)}
            refresh={fetchEvents}
            clubId={clubId}
          />
        )}

        {/* EVENTS LIST */}
        {loading ? (
          <div className="loading">
            <h2>Loading events...</h2>
          </div>
        ) : (
          <div className="club-grid">
            {events.length === 0 ? (

              /* ===== NO EVENTS AT ALL ===== */
              <div className="no-events">
                <div className="no-events-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                    <line x1="10" y1="15" x2="14" y2="15" />
                    <line x1="12" y1="13" x2="12" y2="17" />
                  </svg>
                </div>
                <h3>No Events Yet</h3>
                <p>
                  {role === "admin"
                    ? `This club has no events yet. Click "Add Event" to create the first one.`
                    : "This club hasn't added any events yet. Check back later!"}
                </p>
              </div>

            ) : filteredEvents.length === 0 ? (

              /* ===== NO SEARCH RESULTS ===== */
              <div className="no-events">
                <div className="no-events-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <h3>No events found</h3>
                <p>No events match "{searchQuery}". Try a different keyword.</p>
              </div>

            ) : (
              /* ===== EVENT CARDS ===== */
              filteredEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  openDetails={openDetails}
                  onDelete={role === "admin" ? (id) => setConfirmEventId(id) : null}
                />
              ))
            )}
          </div>
        )}
      </div>

      {/* ================= EVENT DETAILS MODAL ================= */}
      {selectedEvent && (
        <EventDetailsModal
          event={selectedEvent}
          close={closeDetails}
        />
      )}
    </div>
  );
}

export default ClubEvents;