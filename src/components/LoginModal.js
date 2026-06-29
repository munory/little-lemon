import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './LoginModal.css';

function LoginModal({ onClose }) {
  const { login } = useAuth();
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(email);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick} role="presentation">
      <div
        className="modal-container login-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="login-title"
      >
        <button className="modal-close" onClick={onClose} aria-label="Close sign in">✕</button>

        <div className="login-modal-body">
          <h2 id="login-title" className="login-modal-title">Sign In</h2>

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn-login-submit">Log In</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
