import clubs from "../data/clubs";
import ClubCard from "../components/clubCard";

function Dashboard() {
  return (
    <div className="dashboard">
      <h1>Welcome to Eventopia 🎉</h1>

      <div className="clubs-container">
        {clubs.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}
      </div>
    </div>
  );
}

export default Dashboard;
