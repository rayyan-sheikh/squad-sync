import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store/authStore';
import { Button } from '../components/ui/button';
import { Logo } from '../components/Logo';

export const DashboardPage = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      {/* Navbar */}
      <header className="border-b border-border px-6 py-4 flex items-center justify-between backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <Logo size="sm" />
        <div className="flex items-center gap-4">
          <span className="text-sm text-muted-foreground hidden sm:block">{user?.email}</span>
          <Button
            variant="outline" size="sm" onClick={handleLogout}
            className="border-border text-muted-foreground hover:text-foreground hover:border-primary/40 transition-all"
          >
            Logout
          </Button>
        </div>
      </header>

      {/* Content */}
      <main className="flex items-center justify-center min-h-[calc(100vh-65px)] relative overflow-hidden">
        <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-primary/5 rounded-full blur-3xl pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="relative text-center space-y-3"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Phase 1 — Auth Complete
          </div>
          <h1 className="text-4xl font-semibold text-foreground">You're in.</h1>
          <p className="text-muted-foreground text-sm">More features coming in the next phase.</p>
        </motion.div>
      </main>
    </motion.div>
  );
};
