// ================= IMPORTS =================
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import AddClubModal from "../components/AddClubModal";
import { jwtDecode } from "jwt-decode";
import toast, { Toaster } from "react-hot-toast";
import "./dashboard.css";

// ================= DELETE CONFIRM MODAL =================
function DeleteConfirmModal({ onConfirm, onCancel, label = "club" }) {
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

// ================= DASHBOARD COMPONENT =================
function Dashboard() {
  const navigate = useNavigate();

  // STATES
  const [clubs, setClubs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [confirmClubId, setConfirmClubId] = useState(null);

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

  // ================= FETCH CLUBS =================
  const fetchClubs = async () => {
    try {
      setLoading(true);
      const res = await API.get("/clubs/getClubs");
      setClubs(res.data.clubs || []);
    } catch (error) {
      console.log("Error fetching clubs:", error);
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE CLUB =================
  const handleDeleteClub = async () => {
    try {
      await API.delete(`/clubs/deleteClub/${confirmClubId}`);
      setConfirmClubId(null);
      fetchClubs();
      toast.success("Club deleted!");
    } catch (error) {
      toast.error("Failed to delete club.");
    }
  };

  // ================= PAGE LOAD =================
  useEffect(() => {
    fetchClubs();
  }, []);

  // ================= UI =================
  return (
    <div className="dashboard">
      <Toaster position="top-center" />

      {/* ===== DELETE CONFIRM MODAL ===== */}
      {confirmClubId && (
        <DeleteConfirmModal
          label="club"
          onConfirm={handleDeleteClub}
          onCancel={() => setConfirmClubId(null)}
        />
      )}

      {/* ===== FIXED HEADER ===== */}
      <div className="dashboard-header">
        <div className="header-inner">
          <h2 className="dashboard-title">
            Welcome to Eventopia, {role || "User"}
          </h2>
          <div className="header-buttons">
            {role?.toLowerCase() === "admin" && (
              <button
                className="animated-add-btn"
                onClick={() => setShowModal(true)}
              >
                <span className="button__text">Add Club</span>
                <span className="button__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" fill="none">
                    <line y2="19" y1="5" x2="12" x1="12"></line>
                    <line y2="12" y1="12" x2="19" x1="5"></line>
                  </svg>
                </span>
              </button>
            )}
            <button
              className="add-btn"
              onClick={() => navigate("/my-participation")}
            >
              My Participation
            </button>
          </div>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="dashboard-content">
        {/* MODAL */}
        {showModal && (
          <AddClubModal
            close={() => setShowModal(false)}
            refresh={fetchClubs}
          />
        )}

        {/* LOADING OR CLUBS */}
        {loading ? (
          <div className="loading">
            <h2>Loading clubs...</h2>
          </div>
        ) : (
          <div className="club-grid">
            {clubs.map((club) => (
              <div
                className="club-card"
                key={club._id}
                onClick={() => navigate(`/club/${club._id}`)}
              >
                {/* ===== DELETE ICON (admin only) ===== */}
                {role === "admin" && (
                  <button
                    className="delete-icon"
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmClubId(club._id);
                    }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>
                )}

                <img src={club.image} alt={club.name} />
                <h3>{club.name}</h3>
                <p>{club.description}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;