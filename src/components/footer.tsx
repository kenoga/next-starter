import { messages } from '@/lib/messages';

export const Footer = () => {
  return (
    <footer className="text-muted-foreground absolute bottom-2 w-full text-center text-sm">
      © {new Date().getFullYear()} {messages.app_name}
    </footer>
  );
};
