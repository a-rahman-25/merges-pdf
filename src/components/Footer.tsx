import { Link } from 'react-router-dom';
import { Combine, Shield, Globe } from 'lucide-react';
import { useI18n } from '@/hooks/useI18n';

const toolLinks = [
  { to: '/merge', key: 'tool.merge' },
  { to: '/split', key: 'tool.split' },
  { to: '/compress', key: 'tool.compress' },
  { to: '/rotate', key: 'tool.rotate' },
  { to: '/pdf-signature', key: 'tool.sign' },
  { to: '/encrypt', key: 'tool.encrypt' },
  { to: '/pdf-overlay', key: 'tool.pdfOverlay' },
  { to: '/pdf-bookmarks', key: 'tool.bookmarks' },
  { to: '/repair-pdf', key: 'tool.repair' },
  { to: '/page-size', key: 'tool.pageSize' },
  { to: '/pdf-redact', key: 'tool.redact' },
];

const converterLinks = [
  { to: '/pdf-to-word', key: 'tool.pdfToWord' },
  { to: '/word-to-pdf', key: 'tool.wordToPdf' },
  { to: '/pdf-to-excel', key: 'tool.pdfToExcel' },
  { to: '/excel-to-pdf', key: 'tool.excelToPdf' },
  { to: '/powerpoint-to-pdf', key: 'tool.pptxToPdf' },
  { to: '/image-to-pdf', key: 'tool.imageToPdf' },
  { to: '/epub-to-pdf', key: 'tool.epubToPdf' },
  { to: '/scan-to-pdf', key: 'tool.scanToPdf' },
  { to: '/pdf-a', key: 'tool.pdfA' },
  { to: '/heic-to-pdf', key: 'tool.heicToPdf' },
  { to: '/html-to-pdf', key: 'tool.htmlToPdf' },
  { to: '/bg-remover', key: 'tool.bgRemove' },
  { to: '/compare-pdf', key: 'tool.comparePdf' },
  { to: '/pdf-to-powerpoint', key: 'tool.pdfToPpt' },
  { to: '/markdown-to-pdf', key: 'tool.markdownToPdf' },
];

const companyLinks = [
  { to: '/about', key: 'nav.about' },
  { to: '/contact', key: 'nav.contact' },
  { to: '/blog', key: 'nav.blog' },
  { to: '/privacy', key: 'footer.privacy' },
  { to: '/terms', key: 'footer.terms' },
];

const aiLinks = [
  { to: '/ai-summarize', key: 'tool.aiSummarize' },
  { to: '/ai-translate', key: 'tool.aiTranslate' },
  { to: '/ai-qa', key: 'tool.aiQa' },
  { to: '/ai-document-tools', key: 'tool.aiTools' },
];

const Footer = () => {
  const { t } = useI18n();

  return (
    <footer className="border-t border-border/60 bg-card/50">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
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

          {/* Converters */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">{t('footer.converters')}</h4>
            <ul className="space-y-2">
              {converterLinks.map((link) => (
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
                    {t(link.key)}
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-xs text-muted-foreground">
              {t('footer.support')}: <a href="mailto:merge.pdf.st@gmail.com" className="text-primary hover:underline">merge.pdf.st@gmail.com</a>
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
