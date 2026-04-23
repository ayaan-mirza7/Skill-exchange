import "./RewardModal.css";
import Button from "./ui/Button";

export default function RewardModal({ open, spent = 0, reward = 0, onClose }) {
  if (!open) return null;

  return (
    <div className="reward-backdrop" onClick={onClose}>
      <div className="reward-modal" onClick={(e) => e.stopPropagation()}>
        <h3>Credits Deducted Successfully</h3>
        <p>
          You spent <strong>{spent}</strong> credits
        </p>
        <p className="reward-line">🎉 You received {reward} bonus credits!</p>
        <Button onClick={onClose}>Done</Button>
      </div>
    </div>
  );
}
