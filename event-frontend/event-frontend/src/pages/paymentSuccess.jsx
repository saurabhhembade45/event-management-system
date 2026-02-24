import { useNavigate, useParams, useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import "./dashboard.css";

function PaymentSuccess() {
  const navigate = useNavigate();
  const { eventId } = useParams();

  // if you later pass event name via state
  const location = useLocation();
  const eventName = location.state?.eventName || "Event";

  // ===== DOWNLOAD PDF RECEIPT =====
  const downloadReceipt = () => {
    const doc = new jsPDF();

    // ===== TITLE =====
    doc.setFontSize(20);
    doc.text(eventName, 105, 20, { align: "center" });

    // ===== SUBTITLE =====
    doc.setFontSize(16);
    doc.text("Event Registration Receipt", 105, 35, { align: "center" });

    // LINE
    doc.line(20, 40, 190, 40);

    // ===== DETAILS =====
    doc.setFontSize(12);

    doc.text(`Event ID: ${eventId}`, 20, 55);
    doc.text(`Status: Registered`, 20, 65);
    doc.text(
      `Date: ${new Date().toLocaleString()}`,
      20,
      75
    );

    // THANK YOU MESSAGE
    doc.setFontSize(14);
    doc.text(
      "Thank you for registering for this event!",
      105,
      95,
      { align: "center" }
    );

    doc.setFontSize(12);
    doc.text(
      "We look forward to your participation.",
      105,
      105,
      { align: "center" }
    );

    // FOOTER
    doc.setFontSize(10);
    doc.text(
      "This is a system generated receipt.",
      105,
      270,
      { align: "center" }
    );

    // SAVE PDF
    doc.save("Event_Receipt.pdf");
  };

  return (
    <div className="dashboard">
      <div className="payment-card" style={{ textAlign: "center" }}>

        <h1>🎉 Registration Successful</h1>


        <p>Your participation has been confirmed successfully.</p>

        <hr style={{ margin: "20px 0" }} />

        {/* DOWNLOAD RECEIPT */}
        <button className="pay-btn" onClick={downloadReceipt}>
          ⬇ Download Receipt (PDF)
        </button>

        <br /><br />

        {/* GO HOME */}
        <button
          className="add-btn"
          onClick={() => navigate("/dashboard")}
        >
          🏠 Go To Home
        </button>

      </div>
    </div>
  );
}

export default PaymentSuccess;