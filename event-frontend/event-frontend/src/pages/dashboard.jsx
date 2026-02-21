// ================= IMPORTS =================

// React hooks
// useState -> used to store and update data
// useEffect -> runs code automatically when component loads
import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

// Axios instance used to call backend APIs
import API from "../services/api";

// Modal component used to create a new club
import AddClubModal from "../components/AddClubModal";

// CSS styling for dashboard
import "./dashboard.css";


// ================= DASHBOARD COMPONENT =================
function Dashboard() {

  const navigate = useNavigate();
  // clubs -> stores list of clubs fetched from backend
  // setClubs -> function used to update clubs
  const [clubs, setClubs] = useState([]);

  // showModal -> controls whether AddClub popup is visible
  // false = hidden, true = visible
  const [showModal, setShowModal] = useState(false);

  // loading -> tells UI whether data is being fetched
  // true = loading screen shown
  // false = clubs displayed
  const [loading, setLoading] = useState(true);


  // ================= FETCH CLUBS FUNCTION =================
  // This function calls backend and gets all clubs
  const fetchClubs = async () => {
    try {
      // Start loading before API call
      setLoading(true);

      // Send GET request to backend route
      // Backend → MongoDB → returns clubs data
      const res = await API.get("/clubs/getClubs");

      // Save clubs into React state
      // If clubs undefined, fallback to empty array
      setClubs(res.data.clubs || []);

    } catch (error) {
      // If any error occurs, print it in console
      console.log("Error fetching clubs:", error);
    } finally {
      // Stop loading after API completes (success or error)
      setLoading(false);
    }
  };


  // ================= RUN WHEN PAGE LOADS =================
  // useEffect runs automatically when component mounts
  // [] means run only once (like page load)
  useEffect(() => {
    fetchClubs(); // fetch clubs when dashboard opens
  }, []);


  // ================= UI RETURN =================
  return (
    <div className="dashboard">

      {/* ===== DASHBOARD HEADER ===== */}
      <div className="dashboard-header">

        {/* Page Title */}
        <h2 className="dashboard-title">
          Welcome to Eventopia, Admin
        </h2>

        {/* Button to open Add Club modal */}
        <button
          className="add-btn"
          onClick={() => setShowModal(true)} // open modal
        >
          + Add Club
        </button>

      </div>


      {/* ===== SHOW MODAL ONLY IF showModal IS TRUE ===== */}
      {showModal && (
        <AddClubModal
          close={() => setShowModal(false)} // function to close modal
          refresh={fetchClubs} // refresh dashboard after adding club
        />
      )}


      {/* ================= CONDITIONAL RENDERING ================= */}
      {/* If loading is true -> show loading UI */}
      {/* Else -> show club cards */}

      {loading ? (

        // ===== Loading Screen =====
        <div className="loading">
          <h2>Loading clubs...</h2>
        </div>

      ) : (

        // ===== Club Grid =====
        <div className="club-grid">

          {/* Loop through all clubs using map */}
          {clubs.map((club) => (

            // Each club card
            // key is required by React for list rendering
            <div
              className="club-card"
              key={club._id}
              onClick={() => navigate(`/club/${club._id}`)}
            >

              {/* Club image */}
              <img src={club.image} alt={club.name} />

              {/* Club name */}
              <h3>{club.name}</h3>

              {/* Club description */}
              <p>{club.description}</p>

            </div>
          ))}

        </div>

      )}

    </div>
  );
}


// Export component so it can be used in routing
export default Dashboard;