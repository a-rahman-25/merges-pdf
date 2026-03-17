import { Link } from 'react-router-dom';
import { Shield, Zap, Globe, Heart, Code, Users, Eye, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';
import SEOHead from '@/components/SEOHead';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';

const values = [
  { icon: Shield, title: 'Privacy First', desc: 'Every file stays on your device. We never upload, store, or see your documents.' },
  { icon: Heart, title: 'Forever Free', desc: 'No subscriptions, no premium tiers, no watermarks, no hidden fees. Not a cent, ever.' },
  { icon: Code, title: 'Open Source', desc: 'Transparent code you can inspect, audit, and contribute to. Nothing hidden.' },
  { icon: Users, title: 'User Obsessed', desc: 'Built around real needs. Every feature solves a real problem for real people.' },
  { icon: Eye, title: 'No Dark Patterns', desc: 'No manipulative UX. No forced sign-ups. No guilt-tripping modals.' },
];

const timeline = [
  { year: '2024', title: 'The Problem', desc: 'Frustrated by PDF tools that uploaded files to servers, charged hidden fees, and plastered ads everywhere.' },
  { year: '2024', title: 'The Idea', desc: 'Modern browsers can process PDFs, convert images, and run AI — all without a server. Why not build PDF tools on that?' },
  { year: '2025', title: 'Launch', desc: 'MergesPDF launched with merge, split, and compress. All client-side. Response was overwhelming.' },
  { year: '2026', title: 'Today', desc: '30+ tools, AI features, OCR, e-signatures — all still free, all still private. Used in 150+ countries.' },
];

const team = [
  { initial: 'A', name: 'Alex Rivera', role: 'Founder & Lead Developer', bio: 'Full-stack engineer passionate about browser APIs and privacy-respecting tools.' },
  { initial: 'S', name: 'Sam Nguyen', role: 'Product & Design', bio: 'UX designer focused on making powerful tools feel effortless.' },
];

const About = () => (
  <div className="min-h-screen bg-background">
    <SEOHead
      title="About MergesPDF — Built to Make Privacy the Default"
      description="Learn about MergesPDF — a free, privacy-first PDF tools platform. All processing happens in your browser."
      path="/about"
    />

    <Header />

    <main className="mx-auto max-w-4xl px-6 py-16 md:py-24">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        {/* Hero */}
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground md:text-5xl leading-tight">
          Built to make privacy<br />
          <span className="gradient-text">the default, not the exception.</span>
        </h1>

        {/* Mission */}
        <div className="mt-10 space-y-6 text-muted-foreground leading-relaxed text-lg">
          <p>
            MergesPDF was born from a simple frustration: why do PDF tools need to upload your files to a server? 
            Your tax returns, contracts, medical records, and personal documents shouldn't have to travel through 
            someone else's infrastructure just to be merged or compressed.
          </p>
          <p>
            Modern browsers are incredibly powerful. They can process PDFs, convert images, run OCR, and even 
            execute AI models — all locally, using your device's own processing power. We built MergesPDF to 
            harness that power and give everyone access to professional-grade PDF tools without compromising privacy.
          </p>
          <p>
            Every tool on MergesPDF runs entirely in your browser. When you close the tab, your files are gone — 
            because they were never anywhere else. No accounts, no uploads, no tracking. Just tools that work.
          </p>
        </div>

        {/* Values */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground">Our Values</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((v) => (
              <div key={v.title} className="rounded-2xl border border-border bg-card p-5">
                <v.icon className="mb-3 h-6 w-6 text-primary" />
                <h3 className="font-semibold text-foreground">{v.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground">How MergesPDF Started</h2>
          <div className="mt-6 space-y-6">
            {timeline.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex flex-col items-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full gradient-bg text-sm font-bold text-primary-foreground shrink-0">
                    {item.year.slice(-2)}
                  </div>
                  {i < timeline.length - 1 && <div className="w-px flex-1 bg-border mt-2" />}
                </div>
                <div className="pb-6">
                  <p className="text-xs font-semibold text-primary">{item.year}</p>
                  <h3 className="font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Open Source */}
        <div className="mt-16 rounded-2xl border border-border bg-accent/30 p-8 text-center">
          <Sparkles className="mx-auto h-8 w-8 text-primary mb-3" />
          <h2 className="text-xl font-bold text-foreground">Open Source</h2>
          <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
            MergesPDF is built on open-source technology. Transparency is at our core — 
            you can inspect the code and verify that your files truly stay private.
          </p>
          <Button variant="outline" className="mt-4 rounded-xl">
            ⭐ Star us on GitHub
          </Button>
        </div>

        {/* Team */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-foreground">Team</h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            {team.map((member) => (
              <div key={member.name} className="rounded-2xl border border-border bg-card p-5 flex gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full gradient-bg text-lg font-bold text-primary-foreground shrink-0">
                  {member.initial}
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">{member.name}</h3>
                  <p className="text-xs text-primary font-medium">{member.role}</p>
                  <p className="mt-1 text-sm text-muted-foreground">{member.bio}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="mt-16 rounded-2xl border border-border bg-card p-6 text-center">
          <p className="font-medium text-foreground">Have questions or feedback?</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Reach us at{' '}
            <a href="mailto:merge.pdf.st@gmail.com" className="text-primary hover:underline">merge.pdf.st@gmail.com</a>{' '}
            or visit our <Link to="/contact" className="text-primary hover:underline">contact page</Link>.
          </p>
        </div>
      </motion.div>
    </main>

    <Footer />
  </div>
);

export default About;
