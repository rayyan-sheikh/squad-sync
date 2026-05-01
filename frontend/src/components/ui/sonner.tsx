import { Toaster as Sonner, type ToasterProps } from 'sonner';

const Toaster = (props: ToasterProps) => (
  <Sonner
    theme="dark"
    position="top-right"
    toastOptions={{
      style: {
        background: 'var(--popover)',
        border: '1px solid var(--border)',
        color: 'var(--popover-foreground)',
        borderRadius: 'var(--radius)',
      },
    }}
    {...props}
  />
);

export { Toaster };
