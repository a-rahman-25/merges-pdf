import { Link } from 'react-router-dom';
import { Combine, Mail, MessageSquare, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import ThemeToggle from '@/components/ThemeToggle';
import SEOHead from '@/components/SEOHead';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Contact = () => {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSending(true);
    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = (formData.get('name') as string).trim();
    const email = (formData.get('email') as string).trim();
    const message = (formData.get('message') as string).trim();

    if (!name || !email || !message) {
      toast({ title: 'Please fill in all fields', variant: 'destructive' });
      setSending(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke('send-contact-email', {
        body: { name, email, message },
      });

      if (error) throw error;

      toast({ title: 'Message sent!', description: 'We\'ll get back to you within 24–48 hours.' });
      form.reset();
    } catch (err) {
      console.error('Email send error:', err);
      toast({ title: 'Failed to send message', description: 'Please try again or email us directly at merge.pdf.st@gmail.com', variant: 'destructive' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Contact MergePDF — Get Help & Support"
        description="Get in touch with the MergePDF team. We're here to help with questions, feedback, or feature requests."
        path="/contact"
      />

      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Combine className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">MergePDF</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hidden text-sm text-muted-foreground hover:text-foreground sm:block">About</Link>
            <Link to="/contact" className="hidden text-sm text-muted-foreground hover:text-foreground sm:block">Contact</Link>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16 md:py-24">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="font-display text-4xl font-bold tracking-tight text-foreground md:text-5xl">
            Get in <span className="text-primary">touch</span>
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            Have a question, suggestion, or found a bug? We'd love to hear from you.
          </p>

          <div className="mt-10 grid gap-10 md:grid-cols-5">
            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 md:col-span-3">
              <div>
                <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-foreground">Name</label>
                <Input id="name" name="name" placeholder="Your name" maxLength={100} required />
              </div>
              <div>
                <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-foreground">Email</label>
                <Input id="email" name="email" type="email" placeholder="you@example.com" maxLength={255} required />
              </div>
              <div>
                <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-foreground">Message</label>
                <Textarea id="message" name="message" placeholder="Tell us what's on your mind..." rows={5} maxLength={2000} required />
              </div>
              <Button type="submit" disabled={sending} className="w-full rounded-xl">
                {sending ? 'Sending...' : 'Send Message'}
              </Button>
            </form>

            {/* Info */}
            <div className="space-y-6 md:col-span-2">
              {[
                { icon: Mail, title: 'Email', desc: 'merge.pdf.st@gmail.com', href: 'mailto:merge.pdf.st@gmail.com' },
                { icon: Clock, title: 'Response Time', desc: 'Usually within 24–48 hours' },
                { icon: MessageSquare, title: 'Feedback', desc: 'Feature requests and bug reports are always welcome!' },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent">
                    <item.icon className="h-5 w-5 text-accent-foreground" />
                  </div>
                  <div>
                    <h3 className="font-display text-sm font-semibold text-foreground">{item.title}</h3>
                    {item.href ? (
                      <a href={item.href} className="text-sm text-primary hover:underline">{item.desc}</a>
                    ) : (
                      <p className="text-sm text-muted-foreground">{item.desc}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </main>

      <footer className="border-t border-border/60 py-10">
        <div className="mx-auto max-w-6xl px-6">
          <div className="flex flex-col items-center gap-6 sm:flex-row sm:justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Combine className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-display text-lg font-bold text-foreground">MergePDF</span>
            </div>
            <div className="flex gap-6 text-sm text-muted-foreground">
              <Link to="/about" className="hover:text-foreground">About</Link>
              <Link to="/contact" className="hover:text-foreground">Contact</Link>
              <Link to="/blog" className="hover:text-foreground">Blog</Link>
            </div>
          </div>
          <div className="mt-6 border-t border-border/60 pt-6 text-center text-sm text-muted-foreground">
            <p>Built with care · No data leaves your device · 100% Free</p>
            <p className="mt-1">
              Support: <a href="mailto:merge.pdf.st@gmail.com" className="text-primary hover:underline">merge.pdf.st@gmail.com</a>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Contact;
