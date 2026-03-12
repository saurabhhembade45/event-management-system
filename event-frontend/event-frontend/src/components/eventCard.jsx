import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react";

function EventCard({ event, onDelete }) {
  const navigate = useNavigate();
  return (
    <div
      className="club-card"
      onClick={() => navigate(`/event/${event._id}`)}
      style={{ cursor: "pointer" }}
    >
      {/* ===== DELETE ICON (admin only) ===== */}
      {onDelete && (
        <button
          className="delete-icon"
          onClick={(e) => {
            e.stopPropagation();
            onDelete(event._id);
          }}
        >
          <Trash2 size={18} />
        </button>
      )}

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