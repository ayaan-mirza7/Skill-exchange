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
const RAZORPAY_CHECKOUT_URL = "https://checkout.razorpay.com/v1/checkout.js";

const loadRazorpayCheckout = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_CHECKOUT_URL;
    script.onload = () => resolve(true);
    script.onerror = () => reject(new Error("Unable to load Razorpay checkout"));
    document.body.appendChild(script);
  });

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
      await loadRazorpayCheckout();
      const orderRes = await api.post("/payments/create-order", { credits: finalCredits });
      const order = orderRes.data;

      const checkout = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "Skill Exchange",
        description: `${finalCredits} credits`,
        order_id: order.orderId,
        prefill: {
          name: user?.name || "",
          email: user?.email || "",
          contact: user?.phone || "",
        },
        theme: {
          color: "#2563eb",
        },
        handler: async (paymentResponse) => {
          try {
            const verifyRes = await api.post("/payments/verify", paymentResponse);
            if (typeof verifyRes?.data?.credits === "number") {
              updateCredits(verifyRes.data.credits);
            }
            await refreshUser();
            setMessage(
              `${verifyRes.data.message} Added ${finalCredits} credits for INR ${verifyRes.data.amountInr}.`,
            );
            setCustomCredits("");
          } catch (err) {
            setError(err?.response?.data?.message || "Payment verification failed");
          } finally {
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setLoading(false);
            setError("Payment was cancelled.");
          },
        },
      });

      checkout.open();
    } catch (err) {
      setError(err?.response?.data?.message || err.message || "Payment failed");
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
