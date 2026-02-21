import { useNavigate } from "react-router-dom";

function EventCard({ event }) {

  const navigate = useNavigate();

  return (
    <div
      className="club-card"
      onClick={() => navigate(`/event/${event._id}`)}
      style={{ cursor: "pointer" }}
    >
      <img src={event.image} alt={event.title} />

      <h3>{event.title}</h3>

      <p>
        {event.description.length > 70
          ? event.description.substring(0, 70) + "..."
          : event.description}
      </p>
    </div>
  );
}

export default EventCard;