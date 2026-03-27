// ================= IMPORTS =================
import { useEffect, useState, useRef } from "react";
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
        <button className="confirm-delete-btn" onClick={onConfirm}>Delete {label}</button>
        <button className="confirm-cancel-btn" onClick={onCancel}>Cancel</button>
      </div>
    </div>
  );
}

// ================= PROFILE BUTTON =================
function ProfileButton({ user, onLogout }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const initial = (user?.name || user?.role || "U").charAt(0).toUpperCase();

  const menuItems = [
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
      label: "My Profile",
      action: () => navigate("/profile"),
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="3" />
          <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
        </svg>
      ),
      label: "Settings",
      action: () => navigate("/settings"),
    },
    {
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M9 11l3 3L22 4" />
          <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
        </svg>
      ),
      label: "My Participation",
      action: () => navigate("/my-participation"),
    },
  ];

  return (
    <div ref={ref} className="profile-btn-wrapper">
      <button
        className={`profile-trigger-btn ${open ? "profile-trigger-btn--open" : ""}`}
        onClick={() => setOpen(!open)}
        aria-label="Profile menu"
      >
        <div className="profile-avatar">{initial}</div>
        <span className="profile-name">{user?.name || user?.role || "User"}</span>
        <svg
          className={`profile-chevron ${open ? "profile-chevron--up" : ""}`}
          xmlns="http://www.w3.org/2000/svg" width="12" height="12"
          viewBox="0 0 24 24" fill="none" stroke="currentColor"
          strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <div className="profile-dropdown">
          <div className="profile-dropdown-header">
            <div className="profile-dropdown-avatar">{initial}</div>
            <div className="profile-dropdown-info">
              <span className="profile-dropdown-name">{user?.name || user?.role || "User"}</span>
              {user?.email && <span className="profile-dropdown-email">{user.email}</span>}
            </div>
          </div>
          <div className="profile-dropdown-divider" />
          {menuItems.map((item, i) => (
            <button key={i} className="profile-menu-item"
              onClick={() => { item.action(); setOpen(false); }}>
              <span className="profile-menu-icon">{item.icon}</span>
              {item.label}
            </button>
          ))}
          <div className="profile-dropdown-divider" />
          <button className="profile-menu-item profile-menu-item--danger"
            onClick={() => { onLogout(); setOpen(false); }}>
            <span className="profile-menu-icon">
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
            </span>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

// ================= DASHBOARD COMPONENT =================
function Dashboard() {
  const navigate = useNavigate();

  const [clubs, setClubs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const [confirmClubId, setConfirmClubId] = useState(null);
  const [user, setUser] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");

  // ================= GET USER FROM TOKEN =================
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setRole(decoded.role);
        setUser({
          name: decoded.name || decoded.username || null,
          email: decoded.email || null,
          role: decoded.role || null,
        });
      } catch (err) {
        console.log("Invalid token");
      }
    }
  }, []);

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("Logged out successfully!");
    setTimeout(() => { navigate("/"); toast.dismiss(); }, 800);
  };

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

  useEffect(() => { fetchClubs(); }, []);

  // ================= FILTERED CLUBS =================
  const filteredClubs = clubs.filter(
    (club) =>
      club.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      club.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // ================= UI =================
  return (
    <div className="dashboard">
      <Toaster position="top-center" />

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

          {/* Title */}
          <h2 className="dashboard-title">
            Welcome to Eventopia, {role || "User"}
          </h2>

          {/* Search Bar */}
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
              placeholder="Search clubs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            {searchQuery && (
              <button className="search-clear-btn" onClick={() => setSearchQuery("")}>✕</button>
            )}
          </div>

          {/* Right Buttons — Order: Add Club → All Events → Profile */}
          <div className="header-buttons">

            {/* Add Club (admin only) */}
            {role?.toLowerCase() === "admin" && (
              <button className="animated-add-btn-dash" onClick={() => setShowModal(true)}>
                <span className="button__text">Add Club</span>
                <span className="button__icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" stroke="currentColor" fill="none">
                    <line y2="19" y1="5" x2="12" x1="12"></line>
                    <line y2="12" y1="12" x2="19" x1="5"></line>
                  </svg>
                </span>
              </button>
            )}

            {/* ===== ALL EVENTS BUTTON — between Add Club and Profile ===== */}
            <button
              className="all-events-btn"
              onClick={() => navigate("/all-events")}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15"
                viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              All Events
            </button>

            {/* Profile Button */}
            <ProfileButton user={user} onLogout={handleLogout} />

          </div>
        </div>
      </div>

      {/* ===== CONTENT ===== */}
      <div className="dashboard-content">
        {showModal && (
          <AddClubModal close={() => setShowModal(false)} refresh={fetchClubs} />
        )}

        {loading ? (
          <div className="loading"><h2>Loading clubs...</h2></div>
        ) : (
          <div className="club-grid">
            {filteredClubs.length === 0 && (
              <div className="no-events">
                <div className="no-events-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </div>
                <h3>No clubs found</h3>
                <p>No clubs match "{searchQuery}". Try a different keyword.</p>
              </div>
            )}
            {filteredClubs.map((club) => (
              <div
                className="club-card"
                key={club._id}
                onClick={() => navigate(`/club/${club._id}`)}
              >
                {role === "Admin" && (
                  <button
                    className="delete-icon"
                    onClick={(e) => { e.stopPropagation(); setConfirmClubId(club._id); }}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                      <path d="M10 11v6" /><path d="M14 11v6" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
                    </svg>
                  </button>
                )}
                <img src={club.image} alt={club.name} />
                <div className="club-content">
                  <h3>{club.name}</h3>
                  <p>{club.description}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;