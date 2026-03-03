import { useEffect, useState } from "react";
import API from "../services/api";
import "./dashboard.css";

function MyParticipation() {

  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetchParticipations();
  }, []);

  const fetchParticipations = async () => {
    try {
      const res = await API.get("/participants/my");
      setEvents(res.data.participations || []);
    } catch (error) {
      console.log(error);
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
        <div className="club-grid">
          {events.map((item) => (
            <div className="club-card" key={item._id}>
              <img src={item.event.image} alt={item.event.title} />
              <h3>{item.event.title}</h3>
              <p>{item.event.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MyParticipation;