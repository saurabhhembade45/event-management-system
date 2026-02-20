import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import API from "../services/api";

function ClubEvents() {

  // get clubId from URL
  const { clubId } = useParams();

  const [club, setClub] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // fetch club + events
  const fetchClubEvents = async () => {
    try {
      setLoading(true);

      const res = await API.get(`/clubs/${clubId}`);

      setClub(res.data.club);
      setEvents(res.data.events || []);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClubEvents();
  }, [clubId]);

  return (
    <div className="dashboard">

      {/* HEADER */}
      <div className="dashboard-header">
        <h2>
          {club ? club.name : "Loading..."}
        </h2>

        <button className="add-btn">
          + Add Event
        </button>
      </div>

      {/* EVENTS */}
      {loading ? (
        <h2>Loading events...</h2>
      ) : (
        <div className="club-grid">
          {events.map((event) => (
            <div className="club-card" key={event._id}>
              <img src={event.image} alt={event.title} />
              <h3>{event.title}</h3>
              <p>{event.description}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ClubEvents;