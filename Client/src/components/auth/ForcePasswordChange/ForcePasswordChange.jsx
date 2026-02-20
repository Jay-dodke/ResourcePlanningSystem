import {useState} from "react";
import Modal from "../../ui/Modal/Modal";
import Button from "../../ui/Button/Button";
import Alert from "../../ui/Alert/Alert";
import {changePassword} from "../../../services/auth.service";
import {useAuthStore} from "../../../store/useAuthStore";
import {getErrorMessage} from "../../../utils/errors";

const ForcePasswordChange = () => {
  const user = useAuthStore((state) => state.user);
  const accessToken = useAuthStore((state) => state.accessToken);
  const refreshToken = useAuthStore((state) => state.refreshToken);
  const setAuth = useAuthStore((state) => state.setAuth);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!user?.mustChangePassword) {
    return null;
  }

  const handleSubmit = async () => {
    if (!newPassword || newPassword.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    try {
      setLoading(true);
      setError("");
      await changePassword({newPassword});
      setAuth({
        user: {...user, mustChangePassword: false},
        accessToken,
        refreshToken,
      });
    } catch (err) {
      setError(getErrorMessage(err, "Unable to change password"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      open
      title="Update your password"
      onClose={() => null}
      hideClose
      disableBackdropClose
      footer={
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? "Updating..." : "Update password"}
        </Button>
      }
    >
      <div className="grid gap-3">
        <p className="text-sm text-secondary">
          Your password has been reset by an administrator. Please set a new password to continue.
        </p>
        <input
          className="ghost-input"
          type="password"
          placeholder="New password"
          value={newPassword}
          onChange={(event) => setNewPassword(event.target.value)}
        />
        <input
          className="ghost-input"
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
        />
        {error ? <Alert tone="error">{error}</Alert> : null}
      </div>
    </Modal>
  );
};

export default ForcePasswordChange;
