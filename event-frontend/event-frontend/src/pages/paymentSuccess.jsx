import { useNavigate, useParams, useLocation } from "react-router-dom";
import { jsPDF } from "jspdf";
import "./dashboard.css";

function PaymentSuccess() {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const location = useLocation();
  const eventName = location.state?.eventName || "Event";

  // ===== DOWNLOAD PDF RECEIPT =====
  const downloadReceipt = () => {
    const doc = new jsPDF();

    // TITLE
    doc.setFontSize(20);
    doc.text(eventName, 105, 20, { align: "center" });

    // SUBTITLE
    doc.setFontSize(16);
    doc.text("Event Registration Receipt", 105, 35, { align: "center" });

    // LINE
    doc.line(20, 40, 190, 40);

    // DETAILS
    doc.setFontSize(12);
    doc.text(`Event ID: ${eventId}`, 20, 55);
    doc.text(`Status: Registered`, 20, 65);
    doc.text(`Date: ${new Date().toLocaleString()}`, 20, 75);

    // MESSAGE
    doc.setFontSize(14);
    doc.text("Thank you for registering for this event!", 105, 95, { align: "center" });
    doc.setFontSize(12);
    doc.text("We look forward to your participation.", 105, 105, { align: "center" });

    // FOOTER
    doc.setFontSize(10);
    doc.text("This is a system generated receipt.", 105, 270, { align: "center" });

    // SAVE PDF
    doc.save("Event_Receipt.pdf");
  };

  return (
    <div className="dashboard">
      <div className="payment-card" style={{ textAlign: "center" }}>
        <h1>🎉 Registration Successful</h1>
        <p>Your participation has been confirmed successfully.</p>
        <hr style={{ margin: "20px 0" }} />

        {/* DOWNLOAD RECEIPT BUTTON */}
        <div
          className="download-btn"
          data-tooltip="Download Receipt"
          onClick={downloadReceipt}
        >
          <div className="download-wrapper">
            <div className="download-text">Download Receipt</div>
            <span className="download-icon">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 0 0 4.561 21h14.878a2 2 0 0 0 1.94-1.515L22 17" />
              </svg>
            </span>
          </div>
        </div>

        <br /><br />

        {/* GO HOME BUTTON */}
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