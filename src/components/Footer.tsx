import { Link } from 'react-router-dom';
import { Combine, Shield, Globe } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

const toolLinks = [
  { to: '/merge', label: 'Merge PDFs' },
  { to: '/split', label: 'Split PDFs' },
  { to: '/compress', label: 'Compress PDF' },
  { to: '/rotate', label: 'Rotate Pages' },
  { to: '/pdf-signature', label: 'Sign PDF' },
  { to: '/encrypt', label: 'Encrypt PDF' },
  { to: '/pdf-to-word', label: 'PDF to Word' },
  { to: '/word-to-pdf', label: 'Word to PDF' },
  { to: '/image-to-pdf', label: 'Image to PDF' },
  { to: '/bg-remover', label: 'Remove Background' },
];

const companyLinks = [
  { to: '/about', labelKey: 'nav.about' },
  { to: '/contact', labelKey: 'nav.contact' },
  { to: '/blog', labelKey: 'nav.blog' },
  { to: '/privacy', label: 'Privacy Policy' },
  { to: '/terms', label: 'Terms of Service' },
];

const aiLinks = [
  { to: '/ai-summarize', label: 'AI Summarizer' },
  { to: '/ai-translate', label: 'AI Translator' },
  { to: '/ai-qa', label: 'AI Q&A' },
  { to: '/ai-document-tools', label: '40+ AI Tools' },
];

const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border/60 bg-card/50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg gradient-bg">
                <Combine className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="text-lg font-bold text-foreground">MergesPDF</span>
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              {t('footer.desc')}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Shield className="h-3.5 w-3.5" /> GDPR
              </div>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <Globe className="h-3.5 w-3.5" /> 150+ {t('stats.countries')}
              </div>
            </div>
          </div>

          {/* PDF Tools */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">{t('footer.pdftools')}</h4>
            <ul className="space-y-2">
              {toolLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* AI Tools */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">{t('footer.aitools')}</h4>
            <ul className="space-y-2">
              {aiLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">{t('footer.company')}</h4>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                    {'labelKey' in link ? t(link.labelKey) : link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              Support: <a href="mailto:merge.pdf.st@gmail.com" className="text-primary hover:underline">merge.pdf.st@gmail.com</a>
            </p>
          </div>
        </div>

        <div className="mt-10 border-t border-border/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            {t('footer.copyright').replace('{year}', new Date().getFullYear().toString())}
          </p>
          <p className="text-xs text-muted-foreground">
            {t('footer.notice')}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
