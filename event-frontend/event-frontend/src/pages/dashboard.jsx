// ================= IMPORTS =================
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import AddClubModal from "../components/AddClubModal";
import { jwtDecode } from "jwt-decode";
import "./dashboard.css";


// ================= DASHBOARD COMPONENT =================
function Dashboard() {

  const navigate = useNavigate();

  // STATES
  const [clubs, setClubs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null); // ✅ role state


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


  // ================= PAGE LOAD =================
  useEffect(() => {
    fetchClubs();
  }, []);


  // ================= UI =================
  return (
    <div className="dashboard">

      {/* ===== FIXED HEADER ===== */}
      <div className="dashboard-header">
        <div className="header-inner">

          <h2 className="dashboard-title">
            Welcome to Eventopia, {role || "User"}
          </h2>

          {/* ✅ Add Club visible only for admin */}
          {role?.toLowerCase() === "admin" && (
            <button
              className="add-btn"
              onClick={() => setShowModal(true)}
            >
              + Add Club
            </button>
          )}

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