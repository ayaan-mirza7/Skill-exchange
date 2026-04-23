import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/footer";
import Card from "../components/ui/Card";
import Button from "../components/ui/Button";
import api from "../api";
import { useUser } from "../context/UserContext";
import "./AppPages.css";
import "./purchaseCredits.css";

const CREDIT_OPTIONS = [1, 5, 10];

export default function PurchaseCredits() {
  const { user, refreshUser, updateCredits } = useUser();
  const [selected, setSelected] = useState(5);
  const [customCredits, setCustomCredits] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePurchase = async () => {
    const finalCredits = customCredits ? Number(customCredits) : Number(selected);
    if (!Number.isInteger(finalCredits) || finalCredits <= 0) {
      setError("Please enter a valid credits amount.");
      return;
    }

    setLoading(true);
    setMessage("");
    setError("");
    try {
      const paymentId = `rzp_test_${Date.now()}`;
      const res = await api.post("/user/purchase-credits", { credits: finalCredits, paymentId });
      if (typeof res?.data?.credits === "number") {
        updateCredits(res.data.credits);
      }
      await refreshUser();
      setMessage(
        `${res.data.message} Added ${finalCredits} credits for INR ${res.data.amountInr}.`,
      );
      setCustomCredits("");
    } catch (err) {
      setError(err?.response?.data?.message || "Payment failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell">
      <Navbar />
      <main className="page-main purchase-page">
        <Card className="purchase-card">
          <h1 className="page-title">Purchase Credits</h1>
          <p className="muted-text">1 Credit = INR 100</p>
          <p className="muted-text">Current Balance: {user?.credits ?? 0} credits</p>
          <div className="payment-tag">Razorpay Demo Checkout (test mode)</div>

          <div className="credit-options">
            {CREDIT_OPTIONS.map((credits) => (
              <button
                key={credits}
                className={`credit-option ${selected === credits ? "selected" : ""}`}
                onClick={() => setSelected(credits)}
                disabled={loading}
              >
                {credits} credits - INR {credits * 100}
              </button>
            ))}
          </div>
          <input
            type="number"
            min="1"
            className="custom-credit-input"
            placeholder="Or enter custom credits"
            value={customCredits}
            onChange={(e) => setCustomCredits(e.target.value)}
            disabled={loading}
          />

          <Button onClick={handlePurchase} disabled={loading}>
            {loading
              ? "Processing Razorpay Transaction..."
              : `Pay INR ${(customCredits ? Number(customCredits || 0) : selected) * 100}`}
          </Button>

          {message && <p className="success-text">{message}</p>}
          {error && <p className="error-text">{error}</p>}
        </Card>
      </main>
      <Footer />
    </div>
  );
}
