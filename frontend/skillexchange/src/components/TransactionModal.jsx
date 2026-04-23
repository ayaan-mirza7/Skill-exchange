import "./TransactionModal.css";
import Button from "./ui/Button";

export default function TransactionModal({
  open,
  title = "Confirm Unlock",
  requiredCredits,
  currentCredits,
  loading,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div className="tx-modal-backdrop" onClick={loading ? undefined : onCancel}>
      <div className="tx-modal" onClick={(e) => e.stopPropagation()}>
        <h3>{title}</h3>
        <p className="muted-text">Please confirm this transaction.</p>
        <div className="tx-stats">
          <div>
            <span>Required Credits</span>
            <strong>{requiredCredits}</strong>
          </div>
          <div>
            <span>Current Credits</span>
            <strong>{currentCredits}</strong>
          </div>
        </div>
        <div className="tx-actions">
          <Button variant="ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={loading}>
            {loading ? "Processing..." : "Confirm"}
          </Button>
        </div>
      </div>
    </div>
  );
}
