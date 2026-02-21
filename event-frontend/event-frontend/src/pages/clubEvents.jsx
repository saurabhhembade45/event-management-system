import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import AddEventModal from "../components/addEventModal";
import EventCard from "../components/eventCard";
import EventDetailsModal from "../pages/eventDetailPage"; 
import "./dashboard.css";

function ClubEvents() {

  const { clubId } = useParams();

  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [clubName, setClubName] = useState("");

  // ⭐ selected event for details modal
  const [selectedEvent, setSelectedEvent] = useState(null);

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

  // ⭐ open details modal
  const openDetails = (event) => {
    setSelectedEvent(event);
  };

  // ⭐ close details modal
  const closeDetails = () => {
    setSelectedEvent(null);
  };

  return (
    <div className="dashboard">

      {/* ===== HEADER ===== */}
      <div className="dashboard-header">
        <h2 className="dashboard-title">
          {clubName || "Club Events"}
        </h2>

        <button
          className="add-btn"
          onClick={() => setShowModal(true)}
        >
          + Add Event
        </button>
      </div>

      {/* ===== ADD EVENT MODAL ===== */}
      {showModal && (
        <AddEventModal
          close={() => setShowModal(false)}
          refresh={fetchEvents}
          clubId={clubId}
        />
      )}

      {/* ===== CONTENT ===== */}
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
                openDetails={openDetails}   // ⭐ pass click handler
              />
            ))
          )}
        </div>
      )}

      {/* ===== EVENT DETAILS MODAL ===== */}
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