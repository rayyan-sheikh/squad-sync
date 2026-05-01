interface LogoProps {
  size?: 'sm' | 'md' | 'lg';
}

const sizes = {
  sm: 'text-xl tracking-tight',
  md: 'text-2xl tracking-tight',
  lg: 'text-4xl tracking-tight',
};

export const Logo = ({ size = 'md' }: LogoProps) => (
  <span className={`font-bold ${sizes[size]} select-none`}>
    <span className="text-foreground">Squad</span>
    <span className="text-primary">SYNC</span>
  </span>
);
