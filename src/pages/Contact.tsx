import { Link } from 'react-router-dom';
import { Mail, MessageSquare, Clock, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Header from '@/components/Header';
import SEOHead from '@/components/SEOHead';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Contact = () => {
  const { toast } = useToast();
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

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
      const { error } = await supabase.functions.invoke('send-contact-email', {
        body: { name, email, message },
      });

      if (error) throw error;

      setSent(true);
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
        title="Contact MergesPDF — Get Help & Support"
        description="Get in touch with the MergesPDF team. We're here to help with questions, feedback, or feature requests."
        path="/contact"
      />

      <header className="border-b border-border/60">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Combine className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="font-display text-xl font-bold text-foreground">MergesPDF</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hidden text-sm text-muted-foreground hover:text-foreground sm:block">About</Link>
            <Link to="/blog" className="hidden text-sm text-muted-foreground hover:text-foreground sm:block">Blog</Link>
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
            {/* Form or Success */}
            <div className="md:col-span-3">
              {sent ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card p-10 text-center"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                  <h2 className="font-display text-xl font-bold text-foreground">Message Sent!</h2>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Thank you for reaching out. We'll get back to you within 24–48 hours.
                  </p>
                  <Button onClick={() => setSent(false)} variant="outline" className="mt-6 rounded-xl">
                    Send Another Message
                  </Button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
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
              )}
            </div>

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

      <Footer />
    </div>
  );
};

export default Contact;
