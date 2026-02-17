function ClubCard({ club }) {
    return (
      <div className="club-card">
        <img src={club.image} alt={club.name} />
  
        <div className="club-content">
          <h3>{club.name}</h3>
          <p>{club.description}</p>
  
          <button>View Club</button>
        </div>
      </div>
    );
  }
  
  export default ClubCard;
  