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

  // open details modal
  const openDetails = (event) => {
    setSelectedEvent(event);
  };

  // close details modal
  const closeDetails = () => {
    setSelectedEvent(null);
  };

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
              <h3>No events yet</h3>
            ) : (
              events.map((event) => (
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