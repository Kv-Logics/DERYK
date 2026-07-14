import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleButton } from '../components/GoogleButton';

export default function Signup() {
  const { signUp, signInWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await signUp(email, password, displayName);
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleGoogle = async () => {
    setError('');
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      navigate('/', { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="login-split bg-[#070B11] text-white font-sans">
      {/* LEFT: visual panel */}
      <div className="login-left fade-in">
        {/* ambient rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-ring bg-ring-2" style={{ width: 'min(560px,80%)', height: 'auto', aspectRatio: '1' }} />
          <div className="bg-ring bg-ring-3" style={{ width: 'min(400px,58%)', height: 'auto', aspectRatio: '1' }} />
          <div className="orbit" style={{ width: 'min(560px,80%)', aspectRatio: '1', animation: 'spin 24s linear infinite' }}>
            <span className="orbit-dot orbit-dot-blue" />
          </div>
        </div>

        {/* centered DERYK wordmark with swipe */}
        <div className="absolute inset-0 flex items-center justify-center z-[2]">
          <span className="lg-wm">
            <span className="lg-wm-txt">DERYK</span>
            <span className="lg-wm-bar" />
          </span>
        </div>

        {/* bottom scrim + tagline */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: 'linear-gradient(180deg,rgba(7,11,17,.35) 0%,rgba(7,11,17,.15) 40%,rgba(7,11,17,.85) 100%)' }}
        />
        <div className="absolute left-11 bottom-11 right-11 pointer-events-none">
          <div className="flex items-center gap-2 mb-4">
            <span className="w-[7px] h-[7px] rounded-full bg-[#34D399]" style={{ boxShadow: '0 0 8px 2px rgba(52,211,153,.5)' }} />
            <span className="text-[11px] tracking-[.14em] uppercase text-white/55">Mission Control</span>
          </div>
          <h2 className="neuton-font font-normal leading-[1.15] max-w-[440px]" style={{ fontSize: 'clamp(26px,3.2vw,40px)' }}>
            Command every mission from one calm cockpit.
          </h2>
        </div>
      </div>

      {/* RIGHT: form */}
      <div className="relative flex items-center justify-center px-8 py-12 overflow-hidden">
        <div className="login-halo" />
        <div className="relative w-full max-w-[380px]">
          <div className="flex justify-center mb-7 fade-up" style={{ animationDelay: '.05s' }}>
            <img src="/logo.png" alt="DERYK Logo" className="h-10 w-auto object-contain" />
          </div>

          <h1 className="neuton-font mb-1.5 text-center text-3xl font-normal fade-up d-1">Create your account</h1>
          <p className="mb-8 text-center text-sm text-white/50 fade-up" style={{ animationDelay: '.15s' }}>
            Join DERYK mission control
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-3.5 fade-up d-2">
            <input
              type="text"
              required
              placeholder="Full name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className="lg-field w-full rounded-xl border border-white/10 bg-[#333842] px-4 py-3.5 text-sm outline-none"
            />
            <input
              type="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="lg-field w-full rounded-xl border border-white/10 bg-[#333842] px-4 py-3.5 text-sm outline-none"
            />
            <input
              type="password"
              required
              minLength={6}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="lg-field w-full rounded-xl border border-white/10 bg-[#333842] px-4 py-3.5 text-sm outline-none"
            />
            {error && <p className="text-sm text-red-400">{error}</p>}
            <button
              type="submit"
              disabled={submitting}
              className="mt-1.5 w-full rounded-xl bg-[#6495ED] py-3.5 text-sm font-semibold text-[#0d1420] transition-all hover:brightness-110 hover:-translate-y-px disabled:opacity-60 shadow-[0_4px_16px_rgba(100,149,237,0.28)]"
            >
              {submitting ? 'Creating account...' : 'Sign up'}
            </button>
          </form>

          <div className="my-5 flex items-center gap-3 fade-up" style={{ animationDelay: '.25s' }}>
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs uppercase tracking-wide text-white/40">or</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>

          <div className="fade-up d-3">
            <GoogleButton onClick={handleGoogle} disabled={googleLoading}>
              {googleLoading ? 'Signing in...' : 'Continue with Google'}
            </GoogleButton>
          </div>

          <div className="mt-6 text-center text-sm text-white/50 fade-up" style={{ animationDelay: '.35s' }}>
            Already have an account?{' '}
            <Link to="/login" className="text-[#6495ED] hover:underline">
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
