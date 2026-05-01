import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuthStore } from '../store/authStore';
import { Logo } from '../components/Logo';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.08, duration: 0.45, ease: [0.22, 1, 0.36, 1] },
  }),
};

const Rings = () => (
  <div className="absolute bottom-16 -right-16 w-72 h-72 pointer-events-none">
    {[0, 1, 2, 3, 4].map((i) => (
      <div
        key={i}
        className="absolute inset-0 m-auto rounded-full border border-primary/10"
        style={{ transform: `scale(${1 - i * 0.18})` }}
      />
    ))}
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="w-3 h-3 rounded-full bg-primary/50 opacity-70" />
    </div>
  </div>
);

export const RegisterPage = () => {
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await register(email, password);
      toast.success('Account created! Welcome to SquadSync.');
      navigate('/dashboard');
    } catch (err: unknown) {
      const msg =
        (err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } })
          ?.response?.data?.message ?? 'Registration failed';
      toast.error(msg);
    }
  };

  return (
    <div className="min-h-screen flex bg-page">

      {/* ── Left branding panel ── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="hidden lg:flex flex-col justify-between w-[460px] shrink-0 relative overflow-hidden p-12 border-r border-border/50 glass-panel dot-grid"
      >
        <div className="absolute -top-32 -left-32 w-80 h-80 rounded-full bg-primary/8 blur-3xl pointer-events-none" />
        <Rings />
        <Logo size="md" />

        <div className="space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Free to join
          </div>
          <h2 className="text-[2rem] font-semibold text-foreground leading-tight tracking-tight">
            Your squad is<br />waiting for you.
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
            Join thousands discovering activities, booking slots, and coordinating with friends in real time.
          </p>
        </div>

        <p className="text-xs text-muted-foreground/40 relative z-10">© 2026 SquadSync</p>
      </motion.div>

      {/* ── Right form panel ── */}
      <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />

        <div className="relative w-full max-w-[360px]">
          <motion.div custom={0} variants={fadeUp} initial="hidden" animate="show"
            className="flex justify-center mb-10 lg:hidden">
            <Logo size="md" />
          </motion.div>

          <motion.p custom={0} variants={fadeUp} initial="hidden" animate="show"
            className="text-xs font-semibold text-primary uppercase tracking-[0.15em] mb-2">
            Get started
          </motion.p>
          <motion.h1 custom={1} variants={fadeUp} initial="hidden" animate="show"
            className="text-[1.75rem] font-semibold text-foreground tracking-tight mb-8">
            Create your account
          </motion.h1>

          <motion.div custom={2} variants={fadeUp} initial="hidden" animate="show"
            className="rounded-2xl overflow-hidden border border-border/70 glass-card">
            <div className="h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" />

            <form onSubmit={handleSubmit} className="p-7 space-y-5">
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.1em]" htmlFor="email">
                  Email address
                </label>
                <input
                  id="email" type="email" required
                  value={email} onChange={(e) => setEmail(e.target.value)}
                  className="input-auth w-full px-4 py-2.5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/35"
                  placeholder="you@example.com"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-[0.1em]" htmlFor="password">
                  Password
                </label>
                <input
                  id="password" type="password" required
                  value={password} onChange={(e) => setPassword(e.target.value)}
                  className="input-auth w-full px-4 py-2.5 rounded-xl text-sm text-foreground placeholder:text-muted-foreground/35"
                  placeholder="Min. 8 characters"
                />
              </div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
                className="btn-glow w-full py-2.5 rounded-xl text-sm font-semibold mt-1"
              >
                {isLoading ? 'Creating account...' : 'Get started'}
              </motion.button>
            </form>
          </motion.div>

          <motion.p custom={3} variants={fadeUp} initial="hidden" animate="show"
            className="text-center text-sm text-muted-foreground mt-5">
            Already have an account?{' '}
            <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign in
            </Link>
          </motion.p>
        </div>
      </div>
    </div>
  );
};
