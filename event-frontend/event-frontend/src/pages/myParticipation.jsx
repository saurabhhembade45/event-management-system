import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import "./dashboard.css";

function MyParticipation() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchParticipations();
  }, []);

  const fetchParticipations = async () => {
    try {
      const res = await API.get("/participants/my");
      setEvents(res.data.participations || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="header-inner">
          <h2 className="dashboard-title">
            My Participated Events
          </h2>
        </div>
      </div>

      <div className="dashboard-content">
        {loading ? (
          <h2>Loading...</h2>
        ) : events.length === 0 ? (
          <div className="no-participation">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/>
              <line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
            <h3>No Participations Yet</h3>
            <p>You haven't registered for any events yet. Browse clubs and join an event!</p>
            <button className="add-btn" onClick={() => navigate("/dashboard")}>
              Browse Clubs
            </button>
          </div>
        ) : (
          <div className="club-grid">
            {events.map((item) => (
              <div className="club-card" key={item._id}>
                <img src={item.event.image} alt={item.event.title} />
                <h3>{item.event.title}</h3>
                <p>{item.event.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyParticipation;