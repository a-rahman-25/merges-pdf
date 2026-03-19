// Translated FAQ Q&A pairs for all tool pages
// Supported: en, ar, es, fr, de, zh — others fall back to English

import type { Lang } from './translations';

type FaqItem = { q: string; a: string };
type FaqsByLang = Partial<Record<Lang, FaqItem[]>> & { en: FaqItem[] };

const faqData: Record<string, FaqsByLang> = {
  merge: {
    en: [
      { q: 'How do I merge PDF files?', a: 'Simply drag and drop your PDF files into the upload area, reorder them as needed, and click "Merge & Download". The combined PDF will be downloaded instantly.' },
      { q: 'Is there a limit on the number of files?', a: 'No, you can merge as many PDF files as your browser can handle. There is no artificial limit on file count or size.' },
      { q: 'Are my files uploaded to a server?', a: 'No. All processing happens 100% in your browser. Your files never leave your device — we have zero access to your documents.' },
      { q: 'Can I reorder pages before merging?', a: 'Yes! After uploading your files, you can drag and drop them into any order before merging.' },
      { q: 'Does merging reduce quality?', a: 'No. The merge process preserves the original quality of every page in your PDFs. No compression or modification is applied.' },
      { q: 'Do I need to sign up?', a: 'No. MergesPDF is completely free with no sign-up, no login, and no email required. Just upload and merge.' },
    ],
    ar: [
      { q: 'كيف أدمج ملفات PDF؟', a: 'ما عليك سوى سحب وإفلات ملفات PDF في منطقة التحميل، وإعادة ترتيبها حسب الحاجة، ثم النقر على "دمج وتنزيل". سيتم تنزيل ملف PDF المدمج فوراً.' },
      { q: 'هل هناك حد لعدد الملفات؟', a: 'لا، يمكنك دمج أي عدد من ملفات PDF. لا يوجد حد مصطنع لعدد الملفات أو حجمها.' },
      { q: 'هل يتم رفع ملفاتي إلى خادم؟', a: 'لا. تتم جميع العمليات بنسبة 100% في متصفحك. ملفاتك لا تغادر جهازك أبداً.' },
      { q: 'هل يمكنني إعادة ترتيب الصفحات قبل الدمج؟', a: 'نعم! بعد تحميل ملفاتك، يمكنك سحبها وإفلاتها بأي ترتيب قبل الدمج.' },
      { q: 'هل يقلل الدمج من الجودة؟', a: 'لا. عملية الدمج تحافظ على الجودة الأصلية لكل صفحة في ملفات PDF.' },
      { q: 'هل أحتاج إلى التسجيل؟', a: 'لا. MergesPDF مجاني تماماً بدون تسجيل أو بريد إلكتروني. فقط ارفع وادمج.' },
    ],
    es: [
      { q: '¿Cómo combino archivos PDF?', a: 'Arrastra y suelta tus archivos PDF en el área de carga, reordénalos según sea necesario y haz clic en "Combinar y Descargar". El PDF combinado se descargará al instante.' },
      { q: '¿Hay un límite de archivos?', a: 'No, puedes combinar tantos archivos PDF como tu navegador pueda manejar. No hay límite artificial.' },
      { q: '¿Se suben mis archivos a un servidor?', a: 'No. Todo el procesamiento ocurre 100% en tu navegador. Tus archivos nunca salen de tu dispositivo.' },
      { q: '¿Puedo reordenar las páginas antes de combinar?', a: '¡Sí! Después de cargar tus archivos, puedes arrastrarlos y soltarlos en cualquier orden.' },
      { q: '¿La combinación reduce la calidad?', a: 'No. El proceso de combinación preserva la calidad original de cada página.' },
      { q: '¿Necesito registrarme?', a: 'No. MergesPDF es completamente gratuito sin registro ni correo electrónico. Solo sube y combina.' },
    ],
    fr: [
      { q: 'Comment fusionner des fichiers PDF ?', a: 'Glissez et déposez vos fichiers PDF dans la zone de téléchargement, réorganisez-les et cliquez sur "Fusionner et Télécharger".' },
      { q: 'Y a-t-il une limite au nombre de fichiers ?', a: 'Non, vous pouvez fusionner autant de fichiers PDF que votre navigateur peut gérer. Aucune limite artificielle.' },
      { q: 'Mes fichiers sont-ils téléversés sur un serveur ?', a: 'Non. Tout le traitement se fait à 100% dans votre navigateur. Vos fichiers ne quittent jamais votre appareil.' },
      { q: 'Puis-je réorganiser les pages avant la fusion ?', a: 'Oui ! Après avoir téléchargé vos fichiers, vous pouvez les glisser-déposer dans n\'importe quel ordre.' },
      { q: 'La fusion réduit-elle la qualité ?', a: 'Non. Le processus de fusion préserve la qualité originale de chaque page.' },
      { q: 'Dois-je m\'inscrire ?', a: 'Non. MergesPDF est entièrement gratuit sans inscription ni e-mail requis.' },
    ],
    de: [
      { q: 'Wie füge ich PDF-Dateien zusammen?', a: 'Ziehen Sie Ihre PDF-Dateien in den Upload-Bereich, ordnen Sie sie neu an und klicken Sie auf "Zusammenführen & Herunterladen".' },
      { q: 'Gibt es ein Limit für die Anzahl der Dateien?', a: 'Nein, Sie können so viele PDF-Dateien zusammenführen, wie Ihr Browser verarbeiten kann.' },
      { q: 'Werden meine Dateien auf einen Server hochgeladen?', a: 'Nein. Die gesamte Verarbeitung erfolgt zu 100% in Ihrem Browser. Ihre Dateien verlassen nie Ihr Gerät.' },
      { q: 'Kann ich die Seiten vor dem Zusammenführen neu ordnen?', a: 'Ja! Nach dem Hochladen können Sie die Dateien per Drag & Drop neu anordnen.' },
      { q: 'Reduziert das Zusammenführen die Qualität?', a: 'Nein. Der Zusammenführungsprozess bewahrt die Originalqualität jeder Seite.' },
      { q: 'Muss ich mich registrieren?', a: 'Nein. MergesPDF ist völlig kostenlos ohne Registrierung oder E-Mail.' },
    ],
    zh: [
      { q: '如何合并PDF文件？', a: '只需将PDF文件拖放到上传区域，根据需要重新排序，然后点击"合并与下载"。合并后的PDF将立即下载。' },
      { q: '文件数量有限制吗？', a: '没有，您可以合并任意数量的PDF文件。没有人为的文件数量或大小限制。' },
      { q: '我的文件会上传到服务器吗？', a: '不会。所有处理100%在您的浏览器中完成。您的文件永远不会离开您的设备。' },
      { q: '合并前可以重新排序吗？', a: '可以！上传文件后，您可以拖放它们以任意顺序排列。' },
      { q: '合并会降低质量吗？', a: '不会。合并过程保留每页PDF的原始质量，不会进行压缩或修改。' },
      { q: '需要注册吗？', a: '不需要。MergesPDF完全免费，无需注册、登录或电子邮件。' },
    ],
  },

  split: {
    en: [
      { q: 'How does PDF splitting work?', a: 'Upload a PDF file and choose to split all pages into individual files, or enter a page range (e.g., "1-3, 5") to extract specific pages into a new PDF.' },
      { q: 'Can I extract specific pages?', a: 'Yes! Switch to "Page Range" mode and enter the pages you want, like "1-3, 5, 8-10". They\'ll be combined into a single new PDF.' },
      { q: 'Is there a page limit?', a: 'No. You can split PDFs of any size — there are no artificial page or file size limits.' },
      { q: 'Are the split files the same quality?', a: 'Yes. Pages are copied without any re-encoding, so quality is preserved exactly as the original.' },
      { q: 'Is this free?', a: 'Completely free. No subscriptions, no watermarks, no hidden costs.' },
    ],
    ar: [
      { q: 'كيف يعمل تقسيم PDF؟', a: 'ارفع ملف PDF واختر تقسيم جميع الصفحات إلى ملفات فردية، أو أدخل نطاق صفحات (مثل "1-3, 5") لاستخراج صفحات محددة.' },
      { q: 'هل يمكنني استخراج صفحات محددة؟', a: 'نعم! انتقل إلى وضع "نطاق الصفحات" وأدخل الصفحات المطلوبة مثل "1-3, 5, 8-10".' },
      { q: 'هل هناك حد للصفحات؟', a: 'لا. يمكنك تقسيم ملفات PDF بأي حجم — لا توجد حدود مصطنعة.' },
      { q: 'هل الملفات المقسمة بنفس الجودة؟', a: 'نعم. يتم نسخ الصفحات بدون أي إعادة ترميز، لذا يتم الحفاظ على الجودة.' },
      { q: 'هل هذا مجاني؟', a: 'مجاني تماماً. بدون اشتراكات، بدون علامات مائية، بدون تكاليف مخفية.' },
    ],
    es: [
      { q: '¿Cómo funciona la división de PDF?', a: 'Sube un archivo PDF y elige dividir todas las páginas en archivos individuales, o ingresa un rango de páginas (ej. "1-3, 5") para extraer páginas específicas.' },
      { q: '¿Puedo extraer páginas específicas?', a: '¡Sí! Cambia al modo "Rango de páginas" e ingresa las páginas que deseas, como "1-3, 5, 8-10".' },
      { q: '¿Hay límite de páginas?', a: 'No. Puedes dividir PDFs de cualquier tamaño — no hay límites artificiales.' },
      { q: '¿Los archivos divididos mantienen la calidad?', a: 'Sí. Las páginas se copian sin recodificación, preservando la calidad original.' },
      { q: '¿Es gratuito?', a: 'Completamente gratuito. Sin suscripciones, sin marcas de agua, sin costos ocultos.' },
    ],
    fr: [
      { q: 'Comment fonctionne la division de PDF ?', a: 'Téléchargez un PDF et choisissez de diviser toutes les pages en fichiers individuels, ou entrez une plage de pages (ex. "1-3, 5").' },
      { q: 'Puis-je extraire des pages spécifiques ?', a: 'Oui ! Passez en mode "Plage de pages" et entrez les pages souhaitées comme "1-3, 5, 8-10".' },
      { q: 'Y a-t-il une limite de pages ?', a: 'Non. Vous pouvez diviser des PDF de n\'importe quelle taille — aucune limite artificielle.' },
      { q: 'Les fichiers divisés sont-ils de même qualité ?', a: 'Oui. Les pages sont copiées sans réencodage, la qualité est préservée.' },
      { q: 'Est-ce gratuit ?', a: 'Entièrement gratuit. Sans abonnement, sans filigrane, sans frais cachés.' },
    ],
    de: [
      { q: 'Wie funktioniert das PDF-Aufteilen?', a: 'Laden Sie eine PDF-Datei hoch und wählen Sie, ob alle Seiten in einzelne Dateien aufgeteilt werden sollen, oder geben Sie einen Seitenbereich ein (z.B. "1-3, 5").' },
      { q: 'Kann ich bestimmte Seiten extrahieren?', a: 'Ja! Wechseln Sie in den "Seitenbereich"-Modus und geben Sie die gewünschten Seiten ein, wie "1-3, 5, 8-10".' },
      { q: 'Gibt es eine Seitenbegrenzung?', a: 'Nein. Sie können PDFs jeder Größe aufteilen — es gibt keine künstlichen Grenzen.' },
      { q: 'Haben die geteilten Dateien die gleiche Qualität?', a: 'Ja. Seiten werden ohne Neukodierung kopiert, die Qualität bleibt erhalten.' },
      { q: 'Ist das kostenlos?', a: 'Völlig kostenlos. Keine Abonnements, keine Wasserzeichen, keine versteckten Kosten.' },
    ],
    zh: [
      { q: 'PDF拆分如何工作？', a: '上传PDF文件，选择将所有页面拆分为单个文件，或输入页面范围（如"1-3, 5"）提取特定页面。' },
      { q: '可以提取特定页面吗？', a: '可以！切换到"页面范围"模式，输入您想要的页面，如"1-3, 5, 8-10"。' },
      { q: '有页面限制吗？', a: '没有。您可以拆分任意大小的PDF——没有人为限制。' },
      { q: '拆分后的文件质量相同吗？', a: '是的。页面无需重新编码即可复制，质量与原始完全一致。' },
      { q: '这是免费的吗？', a: '完全免费。没有订阅、没有水印、没有隐藏费用。' },
    ],
  },

  compress: {
    en: [
      { q: 'How does PDF compression work?', a: 'Our compressor strips unnecessary metadata, rebuilds the document structure, and removes unused objects to reduce file size without affecting visible content.' },
      { q: 'Will compression reduce quality?', a: 'The compression technique we use focuses on metadata removal and structure optimization. The visible content and page quality remain unchanged.' },
      { q: 'How much can I reduce the file size?', a: 'Results vary by document. PDFs with lots of metadata, unused fonts, or duplicated objects can see 10-60% size reduction.' },
      { q: 'Is there a file size limit?', a: 'There is no hard limit, but very large files (100MB+) may be slower to process since everything runs in your browser.' },
      { q: 'Can I compress multiple PDFs at once?', a: 'Yes! Use the Batch Processing tool to compress multiple PDFs simultaneously with progress tracking.' },
    ],
    ar: [
      { q: 'كيف يعمل ضغط PDF؟', a: 'يقوم الضاغط بإزالة البيانات الوصفية غير الضرورية وإعادة بناء هيكل المستند لتقليل حجم الملف دون التأثير على المحتوى المرئي.' },
      { q: 'هل سيقلل الضغط من الجودة؟', a: 'تقنية الضغط تركز على إزالة البيانات الوصفية وتحسين الهيكل. المحتوى المرئي وجودة الصفحة تبقى دون تغيير.' },
      { q: 'كم يمكنني تقليل حجم الملف؟', a: 'تختلف النتائج حسب المستند. يمكن للملفات ذات البيانات الوصفية الكثيرة أن تشهد تقليلاً بنسبة 10-60%.' },
      { q: 'هل هناك حد لحجم الملف؟', a: 'لا يوجد حد صعب، لكن الملفات الكبيرة جداً قد تكون أبطأ في المعالجة.' },
      { q: 'هل يمكنني ضغط عدة ملفات دفعة واحدة؟', a: 'نعم! استخدم أداة المعالجة الدفعية لضغط عدة ملفات PDF في وقت واحد.' },
    ],
    es: [
      { q: '¿Cómo funciona la compresión de PDF?', a: 'Nuestro compresor elimina metadatos innecesarios, reconstruye la estructura del documento y elimina objetos no utilizados para reducir el tamaño.' },
      { q: '¿La compresión reduce la calidad?', a: 'Nuestra técnica se enfoca en la eliminación de metadatos y optimización de estructura. El contenido visible permanece sin cambios.' },
      { q: '¿Cuánto puedo reducir el tamaño?', a: 'Los resultados varían. Los PDFs con muchos metadatos pueden ver una reducción del 10-60%.' },
      { q: '¿Hay límite de tamaño de archivo?', a: 'No hay límite fijo, pero archivos muy grandes pueden tardar más ya que todo se procesa en tu navegador.' },
      { q: '¿Puedo comprimir varios PDFs a la vez?', a: '¡Sí! Usa la herramienta de procesamiento por lotes para comprimir varios PDFs simultáneamente.' },
    ],
    fr: [
      { q: 'Comment fonctionne la compression PDF ?', a: 'Notre compresseur supprime les métadonnées inutiles et reconstruit la structure du document pour réduire la taille sans affecter le contenu.' },
      { q: 'La compression réduit-elle la qualité ?', a: 'Notre technique se concentre sur la suppression des métadonnées. Le contenu visible reste inchangé.' },
      { q: 'De combien puis-je réduire la taille ?', a: 'Les résultats varient. Les PDF avec beaucoup de métadonnées peuvent voir une réduction de 10 à 60%.' },
      { q: 'Y a-t-il une limite de taille ?', a: 'Pas de limite stricte, mais les très gros fichiers peuvent être plus lents à traiter.' },
      { q: 'Puis-je compresser plusieurs PDF à la fois ?', a: 'Oui ! Utilisez l\'outil de traitement par lots pour compresser plusieurs PDF simultanément.' },
    ],
    de: [
      { q: 'Wie funktioniert die PDF-Komprimierung?', a: 'Unser Kompressor entfernt unnötige Metadaten, baut die Dokumentstruktur neu auf und entfernt ungenutzte Objekte.' },
      { q: 'Reduziert die Komprimierung die Qualität?', a: 'Unsere Technik konzentriert sich auf die Entfernung von Metadaten. Der sichtbare Inhalt bleibt unverändert.' },
      { q: 'Wie viel kann ich die Dateigröße reduzieren?', a: 'Die Ergebnisse variieren. PDFs mit vielen Metadaten können eine Reduktion von 10-60% erfahren.' },
      { q: 'Gibt es eine Dateigrößenbegrenzung?', a: 'Keine feste Grenze, aber sehr große Dateien können langsamer verarbeitet werden.' },
      { q: 'Kann ich mehrere PDFs gleichzeitig komprimieren?', a: 'Ja! Nutzen Sie das Stapelverarbeitungs-Tool für die gleichzeitige Komprimierung.' },
    ],
    zh: [
      { q: 'PDF压缩如何工作？', a: '我们的压缩器去除不必要的元数据，重建文档结构，移除未使用的对象以减小文件大小。' },
      { q: '压缩会降低质量吗？', a: '我们的技术专注于元数据移除和结构优化。可见内容和页面质量保持不变。' },
      { q: '可以减少多少文件大小？', a: '结果因文档而异。含大量元数据的PDF可以减少10-60%。' },
      { q: '有文件大小限制吗？', a: '没有硬性限制，但非常大的文件处理可能较慢，因为一切都在浏览器中运行。' },
      { q: '可以同时压缩多个PDF吗？', a: '可以！使用批量处理工具同时压缩多个PDF。' },
    ],
  },

  rotate: {
    en: [
      { q: 'How do I rotate PDF pages?', a: 'Upload a PDF, select the rotation angle (90°, 180°, or 270°), and click Rotate. The rotated PDF will download instantly.' },
      { q: 'Can I rotate specific pages only?', a: 'Currently, rotation applies to all pages in the PDF. For selective page rotation, split the PDF first, rotate individual pages, then merge them back.' },
      { q: 'Does rotation change the content?', a: 'No, rotation only changes the page orientation. All text, images, and formatting remain exactly the same.' },
      { q: 'Can I undo a rotation?', a: 'Yes — simply rotate the PDF again. For example, if you rotated 90° clockwise, rotate 270° to return to the original orientation.' },
    ],
    ar: [
      { q: 'كيف أقوم بتدوير صفحات PDF؟', a: 'ارفع ملف PDF، حدد زاوية التدوير (90° أو 180° أو 270°)، وانقر على تدوير.' },
      { q: 'هل يمكنني تدوير صفحات محددة فقط؟', a: 'حالياً، التدوير ينطبق على جميع الصفحات. للتدوير الانتقائي، قسّم الملف أولاً ثم دوّر الصفحات الفردية.' },
      { q: 'هل يغير التدوير المحتوى؟', a: 'لا، التدوير يغير فقط اتجاه الصفحة. جميع النصوص والصور تبقى كما هي.' },
      { q: 'هل يمكنني التراجع عن التدوير؟', a: 'نعم — قم بتدوير الملف مرة أخرى. مثلاً إذا دورته 90°، دوّره 270° للعودة.' },
    ],
    es: [
      { q: '¿Cómo roto páginas de PDF?', a: 'Sube un PDF, selecciona el ángulo de rotación (90°, 180° o 270°) y haz clic en Rotar.' },
      { q: '¿Puedo rotar solo páginas específicas?', a: 'Actualmente, la rotación se aplica a todas las páginas. Para rotación selectiva, divide el PDF primero.' },
      { q: '¿La rotación cambia el contenido?', a: 'No, la rotación solo cambia la orientación de la página. Todo el contenido permanece igual.' },
      { q: '¿Puedo deshacer una rotación?', a: 'Sí — simplemente rota el PDF de nuevo. Por ejemplo, si rotaste 90°, rota 270° para volver al original.' },
    ],
    fr: [
      { q: 'Comment faire pivoter des pages PDF ?', a: 'Téléchargez un PDF, sélectionnez l\'angle de rotation (90°, 180° ou 270°) et cliquez sur Pivoter.' },
      { q: 'Puis-je faire pivoter des pages spécifiques ?', a: 'Actuellement, la rotation s\'applique à toutes les pages. Pour une rotation sélective, divisez le PDF d\'abord.' },
      { q: 'La rotation modifie-t-elle le contenu ?', a: 'Non, la rotation ne change que l\'orientation de la page. Tout le contenu reste identique.' },
      { q: 'Puis-je annuler une rotation ?', a: 'Oui — faites simplement pivoter le PDF à nouveau.' },
    ],
    de: [
      { q: 'Wie drehe ich PDF-Seiten?', a: 'Laden Sie ein PDF hoch, wählen Sie den Drehwinkel (90°, 180° oder 270°) und klicken Sie auf Drehen.' },
      { q: 'Kann ich nur bestimmte Seiten drehen?', a: 'Derzeit gilt die Drehung für alle Seiten. Für selektive Drehung teilen Sie das PDF zuerst auf.' },
      { q: 'Ändert die Drehung den Inhalt?', a: 'Nein, die Drehung ändert nur die Seitenausrichtung. Alle Inhalte bleiben gleich.' },
      { q: 'Kann ich eine Drehung rückgängig machen?', a: 'Ja — drehen Sie das PDF einfach erneut.' },
    ],
    zh: [
      { q: '如何旋转PDF页面？', a: '上传PDF，选择旋转角度（90°、180°或270°），然后点击旋转。' },
      { q: '可以只旋转特定页面吗？', a: '目前旋转适用于所有页面。要选择性旋转，请先拆分PDF。' },
      { q: '旋转会改变内容吗？', a: '不会，旋转只改变页面方向。所有文本、图片和格式保持不变。' },
      { q: '可以撤销旋转吗？', a: '可以——只需再次旋转PDF即可。' },
    ],
  },

  encrypt: {
    en: [
      { q: 'How does PDF encryption work?', a: 'Enter a password and we rebuild the PDF with protection metadata. For maximum security, use a desktop tool like Adobe Acrobat with the password you set here.' },
      { q: 'Can I remove the password later?', a: 'You can re-open the protected PDF with your password in any PDF reader. To remove the password, open it in a PDF editor and save without protection.' },
      { q: 'Is the encryption strong?', a: 'Browser-based encryption has limitations compared to desktop tools. For highly sensitive documents, we recommend using the password with a professional PDF encryption tool.' },
      { q: 'Will recipients need a password?', a: 'Yes, anyone who wants to open the encrypted PDF will need the password you set.' },
    ],
    ar: [
      { q: 'كيف يعمل تشفير PDF؟', a: 'أدخل كلمة مرور وسنعيد بناء ملف PDF مع بيانات الحماية.' },
      { q: 'هل يمكنني إزالة كلمة المرور لاحقاً؟', a: 'يمكنك إعادة فتح ملف PDF المحمي بكلمة المرور في أي قارئ PDF.' },
      { q: 'هل التشفير قوي؟', a: 'التشفير في المتصفح له قيود مقارنة بأدوات سطح المكتب. للمستندات الحساسة جداً، نوصي باستخدام أداة تشفير احترافية.' },
      { q: 'هل سيحتاج المستلمون إلى كلمة مرور؟', a: 'نعم، أي شخص يريد فتح ملف PDF المشفر سيحتاج إلى كلمة المرور التي حددتها.' },
    ],
    es: [
      { q: '¿Cómo funciona el cifrado de PDF?', a: 'Ingresa una contraseña y reconstruimos el PDF con metadatos de protección.' },
      { q: '¿Puedo eliminar la contraseña después?', a: 'Puedes abrir el PDF protegido con tu contraseña en cualquier lector de PDF.' },
      { q: '¿Es fuerte el cifrado?', a: 'El cifrado en el navegador tiene limitaciones. Para documentos muy sensibles, recomendamos usar una herramienta profesional.' },
      { q: '¿Los destinatarios necesitarán contraseña?', a: 'Sí, cualquiera que quiera abrir el PDF cifrado necesitará la contraseña que estableciste.' },
    ],
    fr: [
      { q: 'Comment fonctionne le chiffrement PDF ?', a: 'Entrez un mot de passe et nous reconstruisons le PDF avec des métadonnées de protection.' },
      { q: 'Puis-je supprimer le mot de passe plus tard ?', a: 'Vous pouvez rouvrir le PDF protégé avec votre mot de passe dans n\'importe quel lecteur PDF.' },
      { q: 'Le chiffrement est-il fort ?', a: 'Le chiffrement basé sur le navigateur a des limites. Pour les documents très sensibles, utilisez un outil professionnel.' },
      { q: 'Les destinataires auront-ils besoin d\'un mot de passe ?', a: 'Oui, toute personne souhaitant ouvrir le PDF chiffré aura besoin du mot de passe.' },
    ],
    de: [
      { q: 'Wie funktioniert die PDF-Verschlüsselung?', a: 'Geben Sie ein Passwort ein und wir bauen das PDF mit Schutz-Metadaten neu auf.' },
      { q: 'Kann ich das Passwort später entfernen?', a: 'Sie können das geschützte PDF mit Ihrem Passwort in jedem PDF-Reader öffnen.' },
      { q: 'Ist die Verschlüsselung stark?', a: 'Browser-basierte Verschlüsselung hat Grenzen. Für hochsensible Dokumente empfehlen wir ein professionelles Tool.' },
      { q: 'Brauchen Empfänger ein Passwort?', a: 'Ja, jeder der das verschlüsselte PDF öffnen möchte, benötigt das von Ihnen festgelegte Passwort.' },
    ],
    zh: [
      { q: 'PDF加密如何工作？', a: '输入密码，我们会使用保护元数据重建PDF。' },
      { q: '以后可以移除密码吗？', a: '您可以在任何PDF阅读器中使用密码重新打开受保护的PDF。' },
      { q: '加密强度如何？', a: '浏览器加密与桌面工具相比有局限性。对于高度敏感的文档，建议使用专业工具。' },
      { q: '收件人需要密码吗？', a: '是的，任何想打开加密PDF的人都需要您设置的密码。' },
    ],
  },

  pdfToWord: {
    en: [
      { q: 'How does PDF to Word conversion work?', a: 'We extract the document structure from your PDF and create a Word (.docx) file. The conversion preserves page structure and basic formatting.' },
      { q: 'Will all text be preserved?', a: 'Browser-based conversion has limitations. For complex PDFs with embedded fonts or advanced layouts, a desktop tool may produce better results.' },
      { q: 'What format is the output?', a: 'The output is a Microsoft Word .docx file that can be opened in Word, Google Docs, LibreOffice, and most word processors.' },
      { q: 'Is my PDF uploaded anywhere?', a: 'No. Everything is processed in your browser. Your file never leaves your device.' },
    ],
    ar: [
      { q: 'كيف يعمل تحويل PDF إلى Word؟', a: 'نستخرج هيكل المستند من ملف PDF وننشئ ملف Word (.docx). التحويل يحافظ على هيكل الصفحة والتنسيق الأساسي.' },
      { q: 'هل سيتم الحفاظ على جميع النصوص؟', a: 'التحويل في المتصفح له قيود. للملفات المعقدة ذات الخطوط المضمنة، قد تكون أداة سطح المكتب أفضل.' },
      { q: 'ما هو تنسيق الإخراج؟', a: 'الإخراج هو ملف .docx يمكن فتحه في Word وGoogle Docs وLibreOffice.' },
      { q: 'هل يتم رفع ملف PDF إلى أي مكان؟', a: 'لا. كل شيء يتم معالجته في متصفحك. ملفك لا يغادر جهازك أبداً.' },
    ],
    es: [
      { q: '¿Cómo funciona la conversión de PDF a Word?', a: 'Extraemos la estructura del documento y creamos un archivo Word (.docx). La conversión preserva la estructura de la página.' },
      { q: '¿Se preservará todo el texto?', a: 'La conversión en el navegador tiene limitaciones. Para PDFs complejos, una herramienta de escritorio puede dar mejores resultados.' },
      { q: '¿Cuál es el formato de salida?', a: 'El archivo de salida es .docx compatible con Word, Google Docs y LibreOffice.' },
      { q: '¿Se sube mi PDF a algún lugar?', a: 'No. Todo se procesa en tu navegador. Tu archivo nunca sale de tu dispositivo.' },
    ],
    fr: [
      { q: 'Comment fonctionne la conversion PDF vers Word ?', a: 'Nous extrayons la structure du document et créons un fichier Word (.docx).' },
      { q: 'Tout le texte sera-t-il préservé ?', a: 'La conversion dans le navigateur a des limites. Pour les PDF complexes, un outil de bureau peut donner de meilleurs résultats.' },
      { q: 'Quel est le format de sortie ?', a: 'Le fichier de sortie est un .docx compatible avec Word, Google Docs et LibreOffice.' },
      { q: 'Mon PDF est-il téléversé quelque part ?', a: 'Non. Tout est traité dans votre navigateur. Votre fichier ne quitte jamais votre appareil.' },
    ],
    de: [
      { q: 'Wie funktioniert die PDF-zu-Word-Konvertierung?', a: 'Wir extrahieren die Dokumentstruktur und erstellen eine Word-Datei (.docx).' },
      { q: 'Wird der gesamte Text beibehalten?', a: 'Browser-basierte Konvertierung hat Grenzen. Für komplexe PDFs kann ein Desktop-Tool bessere Ergebnisse liefern.' },
      { q: 'Welches Format hat die Ausgabe?', a: 'Die Ausgabe ist eine .docx-Datei, die in Word, Google Docs und LibreOffice geöffnet werden kann.' },
      { q: 'Wird mein PDF irgendwohin hochgeladen?', a: 'Nein. Alles wird in Ihrem Browser verarbeitet. Ihre Datei verlässt nie Ihr Gerät.' },
    ],
    zh: [
      { q: 'PDF转Word如何工作？', a: '我们从PDF中提取文档结构并创建Word(.docx)文件。转换保留页面结构和基本格式。' },
      { q: '所有文本都会保留吗？', a: '浏览器转换有局限性。对于带有嵌入字体的复杂PDF，桌面工具可能效果更好。' },
      { q: '输出格式是什么？', a: '输出是.docx文件，可在Word、Google Docs和LibreOffice中打开。' },
      { q: '我的PDF会上传到某处吗？', a: '不会。一切都在浏览器中处理。您的文件永远不会离开设备。' },
    ],
  },

  wordToPdf: {
    en: [
      { q: 'What Word formats are supported?', a: 'We support .doc and .docx files. For best results, use .docx format.' },
      { q: 'Is formatting preserved?', a: 'The converter extracts text content and renders it into a well-formatted PDF. Complex formatting may not be fully preserved.' },
      { q: 'What about images in the Word file?', a: 'Currently, text content is extracted and converted. Embedded images in Word documents may not appear in the output PDF.' },
      { q: 'Is there a file size limit?', a: 'No hard limit, but very large documents may take longer to process since everything runs in your browser.' },
    ],
    ar: [
      { q: 'ما تنسيقات Word المدعومة؟', a: 'ندعم ملفات .doc و .docx. للحصول على أفضل النتائج، استخدم تنسيق .docx.' },
      { q: 'هل يتم الحفاظ على التنسيق؟', a: 'يستخرج المحوّل محتوى النص ويحوّله إلى PDF منسق. التنسيق المعقد قد لا يُحفظ بالكامل.' },
      { q: 'ماذا عن الصور في ملف Word؟', a: 'حالياً يتم استخراج المحتوى النصي وتحويله. قد لا تظهر الصور المضمنة في ملف PDF الناتج.' },
      { q: 'هل هناك حد لحجم الملف؟', a: 'لا يوجد حد صعب، لكن المستندات الكبيرة جداً قد تستغرق وقتاً أطول.' },
    ],
    es: [
      { q: '¿Qué formatos de Word son compatibles?', a: 'Soportamos archivos .doc y .docx. Para mejores resultados, usa formato .docx.' },
      { q: '¿Se preserva el formato?', a: 'El convertidor extrae el contenido de texto y lo renderiza en un PDF bien formateado.' },
      { q: '¿Qué pasa con las imágenes del archivo Word?', a: 'Actualmente, se extrae y convierte el contenido de texto. Las imágenes incrustadas pueden no aparecer.' },
      { q: '¿Hay límite de tamaño de archivo?', a: 'Sin límite fijo, pero documentos muy grandes pueden tardar más en procesarse.' },
    ],
    fr: [
      { q: 'Quels formats Word sont pris en charge ?', a: 'Nous prenons en charge les fichiers .doc et .docx. Pour de meilleurs résultats, utilisez le format .docx.' },
      { q: 'Le formatage est-il préservé ?', a: 'Le convertisseur extrait le contenu texte et le rend en PDF bien formaté.' },
      { q: 'Qu\'en est-il des images dans le fichier Word ?', a: 'Actuellement, le contenu texte est extrait. Les images intégrées peuvent ne pas apparaître.' },
      { q: 'Y a-t-il une limite de taille ?', a: 'Pas de limite stricte, mais les très gros documents peuvent prendre plus de temps.' },
    ],
    de: [
      { q: 'Welche Word-Formate werden unterstützt?', a: 'Wir unterstützen .doc und .docx Dateien. Für beste Ergebnisse verwenden Sie .docx.' },
      { q: 'Wird die Formatierung beibehalten?', a: 'Der Konverter extrahiert den Textinhalt und rendert ihn in ein gut formatiertes PDF.' },
      { q: 'Was ist mit Bildern in der Word-Datei?', a: 'Derzeit wird der Textinhalt extrahiert. Eingebettete Bilder erscheinen möglicherweise nicht.' },
      { q: 'Gibt es eine Dateigrößenbegrenzung?', a: 'Keine feste Grenze, aber sehr große Dokumente können länger dauern.' },
    ],
    zh: [
      { q: '支持哪些Word格式？', a: '我们支持.doc和.docx文件。为获得最佳效果，请使用.docx格式。' },
      { q: '格式会保留吗？', a: '转换器提取文本内容并将其渲染为格式良好的PDF。' },
      { q: 'Word文件中的图片怎么办？', a: '目前提取并转换文本内容。嵌入的图片可能不会出现在输出PDF中。' },
      { q: '有文件大小限制吗？', a: '没有硬性限制，但非常大的文档处理可能更慢。' },
    ],
  },

  deletePages: {
    en: [
      { q: 'How do I delete pages from a PDF?', a: 'Upload a PDF, enter the page numbers you want to remove (e.g., "1-3, 5"), and click Delete Pages. A new PDF without those pages will be downloaded.' },
      { q: 'Can I undo deleted pages?', a: 'The original file is never modified. If you need the deleted pages back, simply use the original file again.' },
      { q: 'Can I delete all pages except one?', a: 'Yes, but you must keep at least one page. Enter all pages except the one you want to keep.' },
      { q: 'Is the page order preserved?', a: 'Yes. The remaining pages keep their original order after deletion.' },
    ],
    ar: [
      { q: 'كيف أحذف صفحات من PDF؟', a: 'ارفع ملف PDF، أدخل أرقام الصفحات التي تريد إزالتها (مثل "1-3, 5")، وانقر على حذف الصفحات.' },
      { q: 'هل يمكنني التراجع عن الصفحات المحذوفة؟', a: 'الملف الأصلي لا يتم تعديله أبداً. إذا كنت بحاجة إلى الصفحات المحذوفة، استخدم الملف الأصلي مرة أخرى.' },
      { q: 'هل يمكنني حذف جميع الصفحات إلا واحدة؟', a: 'نعم، لكن يجب الاحتفاظ بصفحة واحدة على الأقل.' },
      { q: 'هل يتم الحفاظ على ترتيب الصفحات؟', a: 'نعم. تحتفظ الصفحات المتبقية بترتيبها الأصلي بعد الحذف.' },
    ],
    es: [
      { q: '¿Cómo elimino páginas de un PDF?', a: 'Sube un PDF, ingresa los números de página a eliminar (ej. "1-3, 5") y haz clic en Eliminar Páginas.' },
      { q: '¿Puedo deshacer las páginas eliminadas?', a: 'El archivo original nunca se modifica. Si necesitas las páginas eliminadas, simplemente usa el archivo original de nuevo.' },
      { q: '¿Puedo eliminar todas las páginas menos una?', a: 'Sí, pero debes mantener al menos una página.' },
      { q: '¿Se preserva el orden de las páginas?', a: 'Sí. Las páginas restantes mantienen su orden original.' },
    ],
    fr: [
      { q: 'Comment supprimer des pages d\'un PDF ?', a: 'Téléchargez un PDF, entrez les numéros de pages à supprimer (ex. "1-3, 5") et cliquez sur Supprimer.' },
      { q: 'Puis-je annuler la suppression ?', a: 'Le fichier original n\'est jamais modifié. Utilisez simplement le fichier original à nouveau.' },
      { q: 'Puis-je supprimer toutes les pages sauf une ?', a: 'Oui, mais vous devez garder au moins une page.' },
      { q: 'L\'ordre des pages est-il préservé ?', a: 'Oui. Les pages restantes conservent leur ordre original.' },
    ],
    de: [
      { q: 'Wie lösche ich Seiten aus einem PDF?', a: 'Laden Sie ein PDF hoch, geben Sie die zu entfernenden Seitenzahlen ein (z.B. "1-3, 5") und klicken Sie auf Seiten löschen.' },
      { q: 'Kann ich gelöschte Seiten rückgängig machen?', a: 'Die Originaldatei wird nie verändert. Verwenden Sie einfach die Originaldatei erneut.' },
      { q: 'Kann ich alle Seiten bis auf eine löschen?', a: 'Ja, aber Sie müssen mindestens eine Seite behalten.' },
      { q: 'Wird die Seitenreihenfolge beibehalten?', a: 'Ja. Die verbleibenden Seiten behalten ihre ursprüngliche Reihenfolge.' },
    ],
    zh: [
      { q: '如何从PDF中删除页面？', a: '上传PDF，输入要删除的页码（如"1-3, 5"），然后点击删除页面。' },
      { q: '可以撤销删除的页面吗？', a: '原始文件永远不会被修改。如果需要被删除的页面，只需再次使用原始文件。' },
      { q: '可以删除除一页外的所有页面吗？', a: '可以，但必须保留至少一页。' },
      { q: '页面顺序会保留吗？', a: '是的。剩余页面在删除后保持原始顺序。' },
    ],
  },

  extractPages: {
    en: [
      { q: 'How do I extract pages from a PDF?', a: 'Upload a PDF, enter the page numbers you want (e.g., "1-3, 5, 8"), and click Extract. A new PDF with only those pages will be downloaded.' },
      { q: 'What\'s the difference between Extract and Split?', a: 'Extract combines selected pages into one new PDF. Split creates individual files for each page.' },
      { q: 'Can I extract pages in a different order?', a: 'Pages are extracted in the order they appear in the original document.' },
      { q: 'Is the quality preserved?', a: 'Yes. Pages are copied without any re-encoding, preserving the original quality exactly.' },
    ],
    ar: [
      { q: 'كيف أستخرج صفحات من PDF؟', a: 'ارفع ملف PDF، أدخل أرقام الصفحات المطلوبة (مثل "1-3, 5, 8")، وانقر على استخراج.' },
      { q: 'ما الفرق بين الاستخراج والتقسيم؟', a: 'الاستخراج يجمع الصفحات المحددة في ملف PDF جديد واحد. التقسيم ينشئ ملفات فردية لكل صفحة.' },
      { q: 'هل يمكنني استخراج الصفحات بترتيب مختلف؟', a: 'يتم استخراج الصفحات بالترتيب الذي تظهر به في المستند الأصلي.' },
      { q: 'هل يتم الحفاظ على الجودة؟', a: 'نعم. يتم نسخ الصفحات بدون إعادة ترميز، مع الحفاظ على الجودة الأصلية.' },
    ],
    es: [
      { q: '¿Cómo extraigo páginas de un PDF?', a: 'Sube un PDF, ingresa los números de página (ej. "1-3, 5, 8") y haz clic en Extraer.' },
      { q: '¿Cuál es la diferencia entre Extraer y Dividir?', a: 'Extraer combina las páginas seleccionadas en un nuevo PDF. Dividir crea archivos individuales por cada página.' },
      { q: '¿Puedo extraer páginas en diferente orden?', a: 'Las páginas se extraen en el orden en que aparecen en el documento original.' },
      { q: '¿Se preserva la calidad?', a: 'Sí. Las páginas se copian sin recodificación, preservando la calidad original.' },
    ],
    fr: [
      { q: 'Comment extraire des pages d\'un PDF ?', a: 'Téléchargez un PDF, entrez les numéros de pages (ex. "1-3, 5, 8") et cliquez sur Extraire.' },
      { q: 'Quelle est la différence entre Extraire et Diviser ?', a: 'Extraire combine les pages sélectionnées en un nouveau PDF. Diviser crée des fichiers individuels.' },
      { q: 'Puis-je extraire les pages dans un ordre différent ?', a: 'Les pages sont extraites dans l\'ordre du document original.' },
      { q: 'La qualité est-elle préservée ?', a: 'Oui. Les pages sont copiées sans réencodage.' },
    ],
    de: [
      { q: 'Wie extrahiere ich Seiten aus einem PDF?', a: 'Laden Sie ein PDF hoch, geben Sie die gewünschten Seitenzahlen ein (z.B. "1-3, 5, 8") und klicken Sie auf Extrahieren.' },
      { q: 'Was ist der Unterschied zwischen Extrahieren und Aufteilen?', a: 'Extrahieren kombiniert ausgewählte Seiten in ein neues PDF. Aufteilen erstellt einzelne Dateien.' },
      { q: 'Kann ich Seiten in anderer Reihenfolge extrahieren?', a: 'Seiten werden in der Reihenfolge des Originaldokuments extrahiert.' },
      { q: 'Wird die Qualität beibehalten?', a: 'Ja. Seiten werden ohne Neukodierung kopiert.' },
    ],
    zh: [
      { q: '如何从PDF中提取页面？', a: '上传PDF，输入所需页码（如"1-3, 5, 8"），然后点击提取。' },
      { q: '提取和拆分有什么区别？', a: '提取将选定页面合并到一个新PDF中。拆分为每个页面创建单独的文件。' },
      { q: '可以按不同顺序提取页面吗？', a: '页面按原始文档中出现的顺序提取。' },
      { q: '质量会保留吗？', a: '是的。页面无需重新编码即可复制，完全保留原始质量。' },
    ],
  },

  watermark: {
    en: [
      { q: 'What kind of watermarks can I add?', a: 'You can add text watermarks with customizable font size, opacity, and rotation. The watermark is applied diagonally across every page.' },
      { q: 'Can I add an image watermark?', a: 'Currently only text watermarks are supported. Image watermark support is coming soon.' },
      { q: 'Can I control the watermark position?', a: 'The watermark is centered and rotated at 45° for maximum coverage. You can adjust opacity and font size.' },
      { q: 'Is the watermark removable?', a: 'The watermark is embedded directly into the PDF. It cannot be easily removed, making it effective for document protection.' },
    ],
    ar: [
      { q: 'ما نوع العلامات المائية التي يمكنني إضافتها؟', a: 'يمكنك إضافة علامات مائية نصية مع حجم خط وشفافية ودوران قابل للتخصيص.' },
      { q: 'هل يمكنني إضافة علامة مائية صورة؟', a: 'حالياً يتم دعم العلامات المائية النصية فقط. دعم علامات الصور قادم قريباً.' },
      { q: 'هل يمكنني التحكم في موضع العلامة المائية؟', a: 'العلامة المائية مركزة ومدورة بزاوية 45°. يمكنك ضبط الشفافية وحجم الخط.' },
      { q: 'هل العلامة المائية قابلة للإزالة؟', a: 'العلامة المائية مضمنة مباشرة في ملف PDF ولا يمكن إزالتها بسهولة.' },
    ],
    es: [
      { q: '¿Qué tipo de marcas de agua puedo añadir?', a: 'Puedes añadir marcas de agua de texto con tamaño de fuente, opacidad y rotación personalizables.' },
      { q: '¿Puedo añadir una marca de agua de imagen?', a: 'Actualmente solo se admiten marcas de agua de texto. El soporte para imágenes llegará pronto.' },
      { q: '¿Puedo controlar la posición de la marca de agua?', a: 'La marca de agua está centrada y rotada a 45°. Puedes ajustar la opacidad y el tamaño de fuente.' },
      { q: '¿La marca de agua es removible?', a: 'La marca de agua está incrustada directamente en el PDF y no puede eliminarse fácilmente.' },
    ],
    fr: [
      { q: 'Quel type de filigrane puis-je ajouter ?', a: 'Vous pouvez ajouter des filigranes texte avec taille de police, opacité et rotation personnalisables.' },
      { q: 'Puis-je ajouter un filigrane image ?', a: 'Actuellement, seuls les filigranes texte sont pris en charge.' },
      { q: 'Puis-je contrôler la position du filigrane ?', a: 'Le filigrane est centré et tourné à 45°. Vous pouvez ajuster l\'opacité et la taille.' },
      { q: 'Le filigrane est-il supprimable ?', a: 'Le filigrane est intégré directement dans le PDF et ne peut pas être facilement supprimé.' },
    ],
    de: [
      { q: 'Welche Art von Wasserzeichen kann ich hinzufügen?', a: 'Sie können Textwasserzeichen mit anpassbarer Schriftgröße, Deckkraft und Drehung hinzufügen.' },
      { q: 'Kann ich ein Bild-Wasserzeichen hinzufügen?', a: 'Derzeit werden nur Textwasserzeichen unterstützt.' },
      { q: 'Kann ich die Position des Wasserzeichens steuern?', a: 'Das Wasserzeichen ist zentriert und um 45° gedreht. Sie können Deckkraft und Schriftgröße anpassen.' },
      { q: 'Ist das Wasserzeichen entfernbar?', a: 'Das Wasserzeichen ist direkt in das PDF eingebettet und kann nicht leicht entfernt werden.' },
    ],
    zh: [
      { q: '可以添加什么类型的水印？', a: '您可以添加具有可自定义字体大小、不透明度和旋转的文字水印。' },
      { q: '可以添加图片水印吗？', a: '目前仅支持文字水印。图片水印支持即将推出。' },
      { q: '可以控制水印位置吗？', a: '水印居中并旋转45°以获得最大覆盖范围。您可以调整不透明度和字体大小。' },
      { q: '水印可以移除吗？', a: '水印直接嵌入PDF中，不能轻易移除。' },
    ],
  },

  flatten: {
    en: [
      { q: 'What does flattening a PDF do?', a: 'Flattening removes form fields, annotations, layers, and interactive elements, producing a static, non-editable PDF.' },
      { q: 'Is PDF flattening free?', a: 'Yes, completely free with no limits or sign-up required.' },
      { q: 'Will flattening reduce file size?', a: 'It can. By removing interactive elements and rebuilding the structure, the file often becomes smaller.' },
    ],
    ar: [
      { q: 'ماذا يفعل تسطيح PDF؟', a: 'التسطيح يزيل حقول النماذج والتعليقات التوضيحية والطبقات، مما ينتج ملف PDF ثابت غير قابل للتحرير.' },
      { q: 'هل تسطيح PDF مجاني؟', a: 'نعم، مجاني تماماً بدون حدود أو تسجيل.' },
      { q: 'هل سيقلل التسطيح من حجم الملف؟', a: 'يمكن ذلك. بإزالة العناصر التفاعلية وإعادة بناء الهيكل، غالباً ما يصبح الملف أصغر.' },
    ],
    es: [
      { q: '¿Qué hace el aplanamiento de PDF?', a: 'El aplanamiento elimina campos de formulario, anotaciones y capas, produciendo un PDF estático no editable.' },
      { q: '¿Es gratuito el aplanamiento?', a: 'Sí, completamente gratuito sin límites ni registro.' },
      { q: '¿El aplanamiento reduce el tamaño del archivo?', a: 'Puede. Al eliminar elementos interactivos, el archivo a menudo se vuelve más pequeño.' },
    ],
    fr: [
      { q: 'Que fait l\'aplatissement d\'un PDF ?', a: 'L\'aplatissement supprime les champs de formulaire, annotations et couches, produisant un PDF statique.' },
      { q: 'L\'aplatissement est-il gratuit ?', a: 'Oui, entièrement gratuit sans limite ni inscription.' },
      { q: 'L\'aplatissement réduit-il la taille ?', a: 'C\'est possible. En supprimant les éléments interactifs, le fichier devient souvent plus petit.' },
    ],
    de: [
      { q: 'Was bewirkt das Glätten eines PDFs?', a: 'Das Glätten entfernt Formularfelder, Anmerkungen und Ebenen und erzeugt ein statisches, nicht editierbares PDF.' },
      { q: 'Ist PDF-Glätten kostenlos?', a: 'Ja, völlig kostenlos ohne Grenzen oder Registrierung.' },
      { q: 'Reduziert das Glätten die Dateigröße?', a: 'Es kann. Durch das Entfernen interaktiver Elemente wird die Datei oft kleiner.' },
    ],
    zh: [
      { q: 'PDF扁平化有什么作用？', a: '扁平化移除表单字段、注释、图层和交互元素，生成静态的不可编辑PDF。' },
      { q: 'PDF扁平化免费吗？', a: '是的，完全免费，无限制，无需注册。' },
      { q: '扁平化会减小文件大小吗？', a: '可能会。通过移除交互元素并重建结构，文件通常会变小。' },
    ],
  },

  grayscale: {
    en: [
      { q: 'What does converting to grayscale do?', a: 'It rebuilds your PDF without color data, resulting in a black-and-white document that is often smaller in file size.' },
      { q: 'Will this reduce my file size?', a: 'In many cases yes, especially for PDFs with color images or graphics.' },
      { q: 'Is the conversion reversible?', a: 'No. Color information is removed permanently. Keep the original file if you may need color again.' },
    ],
    ar: [
      { q: 'ماذا يفعل التحويل إلى تدرج رمادي؟', a: 'يعيد بناء ملف PDF بدون بيانات الألوان، مما ينتج مستنداً بالأبيض والأسود غالباً ما يكون أصغر حجماً.' },
      { q: 'هل سيقلل هذا من حجم ملفي؟', a: 'في كثير من الحالات نعم، خاصة للملفات التي تحتوي على صور ملونة.' },
      { q: 'هل التحويل قابل للعكس؟', a: 'لا. يتم إزالة معلومات الألوان نهائياً. احتفظ بالملف الأصلي إذا كنت قد تحتاج الألوان مرة أخرى.' },
    ],
    es: [
      { q: '¿Qué hace la conversión a escala de grises?', a: 'Reconstruye tu PDF sin datos de color, resultando en un documento en blanco y negro generalmente más pequeño.' },
      { q: '¿Esto reducirá el tamaño de mi archivo?', a: 'En muchos casos sí, especialmente para PDFs con imágenes o gráficos en color.' },
      { q: '¿La conversión es reversible?', a: 'No. La información de color se elimina permanentemente. Guarda el archivo original si podrías necesitar el color.' },
    ],
    fr: [
      { q: 'Que fait la conversion en niveaux de gris ?', a: 'Elle reconstruit votre PDF sans données de couleur, produisant un document noir et blanc souvent plus petit.' },
      { q: 'Cela réduira-t-il la taille de mon fichier ?', a: 'Dans de nombreux cas oui, surtout pour les PDF avec des images couleur.' },
      { q: 'La conversion est-elle réversible ?', a: 'Non. Les informations de couleur sont supprimées définitivement. Gardez le fichier original.' },
    ],
    de: [
      { q: 'Was bewirkt die Konvertierung in Graustufen?', a: 'Es baut Ihr PDF ohne Farbdaten neu auf, was zu einem kleineren Schwarz-Weiß-Dokument führt.' },
      { q: 'Wird dies meine Dateigröße reduzieren?', a: 'In vielen Fällen ja, besonders bei PDFs mit farbigen Bildern oder Grafiken.' },
      { q: 'Ist die Konvertierung umkehrbar?', a: 'Nein. Farbinformationen werden dauerhaft entfernt. Behalten Sie die Originaldatei.' },
    ],
    zh: [
      { q: '转换为灰度有什么作用？', a: '它会重建您的PDF而不包含颜色数据，生成的黑白文档通常文件更小。' },
      { q: '这会减小文件大小吗？', a: '在很多情况下会，特别是包含彩色图片或图形的PDF。' },
      { q: '转换可以撤销吗？', a: '不能。颜色信息被永久移除。如果可能需要颜色，请保留原始文件。' },
    ],
  },

  pageNumbers: {
    en: [
      { q: 'How do I add page numbers to a PDF?', a: 'Upload your PDF, choose top or bottom position, then click "Add Page Numbers". The tool adds sequential numbers to every page.' },
      { q: 'Is adding page numbers free?', a: 'Yes, completely free with no limits, no watermarks, and no account required.' },
      { q: 'Can I customize the position?', a: 'You can choose between top-center and bottom-center placement.' },
    ],
    ar: [
      { q: 'كيف أضيف أرقام صفحات إلى PDF؟', a: 'ارفع ملف PDF، اختر الموضع (أعلى أو أسفل)، ثم انقر على "إضافة أرقام الصفحات".' },
      { q: 'هل إضافة أرقام الصفحات مجانية؟', a: 'نعم، مجاني تماماً بدون حدود أو علامات مائية أو حساب مطلوب.' },
      { q: 'هل يمكنني تخصيص الموضع؟', a: 'يمكنك الاختيار بين الوسط العلوي والوسط السفلي.' },
    ],
    es: [
      { q: '¿Cómo añado números de página a un PDF?', a: 'Sube tu PDF, elige la posición (arriba o abajo) y haz clic en "Añadir números de página".' },
      { q: '¿Es gratuito añadir números de página?', a: 'Sí, completamente gratuito sin límites, sin marcas de agua, sin cuenta requerida.' },
      { q: '¿Puedo personalizar la posición?', a: 'Puedes elegir entre centro superior y centro inferior.' },
    ],
    fr: [
      { q: 'Comment ajouter des numéros de page ?', a: 'Téléchargez votre PDF, choisissez la position (haut ou bas) et cliquez sur "Ajouter des numéros".' },
      { q: 'L\'ajout de numéros est-il gratuit ?', a: 'Oui, entièrement gratuit sans limites ni filigrane.' },
      { q: 'Puis-je personnaliser la position ?', a: 'Vous pouvez choisir entre le centre supérieur et le centre inférieur.' },
    ],
    de: [
      { q: 'Wie füge ich Seitenzahlen hinzu?', a: 'Laden Sie Ihr PDF hoch, wählen Sie oben oder unten und klicken Sie auf "Seitenzahlen hinzufügen".' },
      { q: 'Ist das Hinzufügen von Seitenzahlen kostenlos?', a: 'Ja, völlig kostenlos ohne Grenzen oder Wasserzeichen.' },
      { q: 'Kann ich die Position anpassen?', a: 'Sie können zwischen oben-mittig und unten-mittig wählen.' },
    ],
    zh: [
      { q: '如何给PDF添加页码？', a: '上传PDF，选择位置（顶部或底部），然后点击"添加页码"。' },
      { q: '添加页码免费吗？', a: '是的，完全免费，无限制，无水印，无需账户。' },
      { q: '可以自定义位置吗？', a: '您可以选择顶部居中或底部居中。' },
    ],
  },

  unlock: {
    en: [
      { q: 'What restrictions can this tool remove?', a: 'It removes print, copy, and edit restrictions (owner password). It cannot bypass open-password protection.' },
      { q: 'Is unlocking PDFs free?', a: 'Yes, completely free. No sign-up or limits.' },
      { q: 'Is this legal?', a: 'Removing restrictions from PDFs you own or have permission to modify is legal. Do not use this tool on documents you don\'t have the right to unlock.' },
    ],
    ar: [
      { q: 'ما القيود التي يمكن لهذه الأداة إزالتها؟', a: 'تزيل قيود الطباعة والنسخ والتحرير. لا يمكنها تجاوز حماية كلمة المرور للفتح.' },
      { q: 'هل فتح ملفات PDF مجاني؟', a: 'نعم، مجاني تماماً. بدون تسجيل أو حدود.' },
      { q: 'هل هذا قانوني؟', a: 'إزالة القيود من ملفات PDF التي تملكها أو لديك إذن بتعديلها أمر قانوني.' },
    ],
    es: [
      { q: '¿Qué restricciones puede eliminar esta herramienta?', a: 'Elimina restricciones de impresión, copia y edición. No puede eludir la protección con contraseña de apertura.' },
      { q: '¿Es gratuito desbloquear PDFs?', a: 'Sí, completamente gratuito. Sin registro ni límites.' },
      { q: '¿Es esto legal?', a: 'Eliminar restricciones de PDFs que posees o tienes permiso para modificar es legal.' },
    ],
    fr: [
      { q: 'Quelles restrictions cet outil peut-il supprimer ?', a: 'Il supprime les restrictions d\'impression, copie et édition. Il ne peut pas contourner la protection par mot de passe d\'ouverture.' },
      { q: 'Le déverrouillage est-il gratuit ?', a: 'Oui, entièrement gratuit. Sans inscription ni limites.' },
      { q: 'Est-ce légal ?', a: 'Supprimer les restrictions des PDF que vous possédez ou avez le droit de modifier est légal.' },
    ],
    de: [
      { q: 'Welche Einschränkungen kann dieses Tool entfernen?', a: 'Es entfernt Druck-, Kopier- und Bearbeitungsbeschränkungen. Es kann keinen Passwortschutz zum Öffnen umgehen.' },
      { q: 'Ist das Entsperren von PDFs kostenlos?', a: 'Ja, völlig kostenlos. Ohne Registrierung oder Grenzen.' },
      { q: 'Ist das legal?', a: 'Das Entfernen von Einschränkungen bei PDFs, die Sie besitzen oder berechtigt sind zu ändern, ist legal.' },
    ],
    zh: [
      { q: '此工具可以移除哪些限制？', a: '它移除打印、复制和编辑限制（所有者密码）。它无法绕过打开密码保护。' },
      { q: '解锁PDF免费吗？', a: '是的，完全免费。无需注册或限制。' },
      { q: '这合法吗？', a: '从您拥有或有权修改的PDF中移除限制是合法的。' },
    ],
  },

  batch: {
    en: [
      { q: 'What batch operations are available?', a: 'You can batch merge (combine all PDFs into one) or batch compress (compress each PDF individually) with progress tracking.' },
      { q: 'How many files can I process at once?', a: 'There is no artificial limit. Process as many files as your browser can handle.' },
      { q: 'Is there a progress indicator?', a: 'Yes! A progress bar shows the status of each file being processed.' },
      { q: 'Are all files processed locally?', a: 'Yes. All batch processing happens in your browser. No files are uploaded to any server.' },
    ],
    ar: [
      { q: 'ما العمليات الدفعية المتاحة؟', a: 'يمكنك الدمج الدفعي أو الضغط الدفعي مع تتبع التقدم.' },
      { q: 'كم عدد الملفات التي يمكنني معالجتها مرة واحدة؟', a: 'لا يوجد حد مصطنع. عالج أي عدد من الملفات يمكن لمتصفحك التعامل معها.' },
      { q: 'هل يوجد مؤشر تقدم؟', a: 'نعم! يعرض شريط التقدم حالة كل ملف يتم معالجته.' },
      { q: 'هل تتم معالجة جميع الملفات محلياً؟', a: 'نعم. كل المعالجة الدفعية تتم في متصفحك. لا يتم رفع أي ملفات.' },
    ],
    es: [
      { q: '¿Qué operaciones por lotes están disponibles?', a: 'Puedes combinar todos los PDFs en uno o comprimir cada PDF individualmente con seguimiento del progreso.' },
      { q: '¿Cuántos archivos puedo procesar a la vez?', a: 'No hay límite artificial. Procesa tantos archivos como tu navegador pueda manejar.' },
      { q: '¿Hay indicador de progreso?', a: '¡Sí! Una barra de progreso muestra el estado de cada archivo.' },
      { q: '¿Todos los archivos se procesan localmente?', a: 'Sí. Todo el procesamiento por lotes ocurre en tu navegador.' },
    ],
    fr: [
      { q: 'Quelles opérations par lots sont disponibles ?', a: 'Vous pouvez fusionner ou compresser par lots avec suivi de progression.' },
      { q: 'Combien de fichiers puis-je traiter ?', a: 'Aucune limite artificielle. Traitez autant de fichiers que votre navigateur peut gérer.' },
      { q: 'Y a-t-il un indicateur de progression ?', a: 'Oui ! Une barre de progression affiche l\'état de chaque fichier.' },
      { q: 'Tous les fichiers sont-ils traités localement ?', a: 'Oui. Tout le traitement par lots se fait dans votre navigateur.' },
    ],
    de: [
      { q: 'Welche Stapeloperationen sind verfügbar?', a: 'Sie können Stapel-Zusammenführung oder Stapel-Komprimierung mit Fortschrittsanzeige durchführen.' },
      { q: 'Wie viele Dateien kann ich gleichzeitig verarbeiten?', a: 'Keine künstliche Begrenzung. Verarbeiten Sie so viele Dateien wie Ihr Browser kann.' },
      { q: 'Gibt es einen Fortschrittsindikator?', a: 'Ja! Ein Fortschrittsbalken zeigt den Status jeder Datei an.' },
      { q: 'Werden alle Dateien lokal verarbeitet?', a: 'Ja. Die gesamte Stapelverarbeitung erfolgt in Ihrem Browser.' },
    ],
    zh: [
      { q: '有哪些批量操作可用？', a: '您可以批量合并（将所有PDF合并为一个）或批量压缩（单独压缩每个PDF），并有进度跟踪。' },
      { q: '一次可以处理多少文件？', a: '没有人为限制。处理您浏览器能处理的任意数量文件。' },
      { q: '有进度指示器吗？', a: '有！进度条显示每个正在处理的文件的状态。' },
      { q: '所有文件都在本地处理吗？', a: '是的。所有批量处理都在您的浏览器中进行。不会上传任何文件。' },
    ],
  },

  formFiller: {
    en: [
      { q: 'How does the PDF form filler work?', a: 'Upload a PDF with form fields, and the tool automatically detects all fillable fields. Enter your values and download the completed PDF.' },
      { q: 'What types of form fields are supported?', a: 'Text fields are fully supported. The tool detects all PDF form field types including text inputs, checkboxes, and dropdowns.' },
      { q: 'Will the form data be embedded in the PDF?', a: 'Yes — the form is flattened after filling, so the data becomes part of the PDF content.' },
      { q: 'What if my PDF has no form fields?', a: 'The tool will let you know if no fillable fields are detected. Only PDFs with interactive form fields will work.' },
    ],
    ar: [
      { q: 'كيف يعمل ملء نماذج PDF؟', a: 'ارفع ملف PDF يحتوي على حقول نماذج، وستكتشف الأداة تلقائياً جميع الحقول القابلة للملء.' },
      { q: 'ما أنواع حقول النماذج المدعومة؟', a: 'الحقول النصية مدعومة بالكامل. الأداة تكتشف جميع أنواع حقول النماذج.' },
      { q: 'هل سيتم تضمين بيانات النموذج في PDF؟', a: 'نعم — يتم تسطيح النموذج بعد الملء، لذا تصبح البيانات جزءاً من محتوى PDF.' },
      { q: 'ماذا لو لم يحتوي PDF على حقول نماذج؟', a: 'ستخبرك الأداة إذا لم يتم اكتشاف حقول قابلة للملء.' },
    ],
    es: [
      { q: '¿Cómo funciona el rellenador de formularios PDF?', a: 'Sube un PDF con campos de formulario y la herramienta detecta automáticamente todos los campos rellenables.' },
      { q: '¿Qué tipos de campos de formulario son compatibles?', a: 'Los campos de texto son totalmente compatibles. La herramienta detecta todos los tipos de campos.' },
      { q: '¿Los datos del formulario se incrustan en el PDF?', a: 'Sí — el formulario se aplana después del llenado, por lo que los datos se integran en el contenido del PDF.' },
      { q: '¿Qué pasa si mi PDF no tiene campos de formulario?', a: 'La herramienta te informará si no se detectan campos rellenables.' },
    ],
    fr: [
      { q: 'Comment fonctionne le remplisseur de formulaires ?', a: 'Téléchargez un PDF avec des champs et l\'outil détecte automatiquement tous les champs à remplir.' },
      { q: 'Quels types de champs sont pris en charge ?', a: 'Les champs texte sont entièrement pris en charge. L\'outil détecte tous les types de champs.' },
      { q: 'Les données seront-elles intégrées au PDF ?', a: 'Oui — le formulaire est aplati après remplissage.' },
      { q: 'Et si mon PDF n\'a pas de champs ?', a: 'L\'outil vous informera si aucun champ remplissable n\'est détecté.' },
    ],
    de: [
      { q: 'Wie funktioniert der PDF-Formular-Ausfüller?', a: 'Laden Sie ein PDF mit Formularfeldern hoch und das Tool erkennt automatisch alle ausfüllbaren Felder.' },
      { q: 'Welche Feldtypen werden unterstützt?', a: 'Textfelder werden voll unterstützt. Das Tool erkennt alle PDF-Formularfeldtypen.' },
      { q: 'Werden die Formulardaten in das PDF eingebettet?', a: 'Ja — das Formular wird nach dem Ausfüllen geglättet.' },
      { q: 'Was wenn mein PDF keine Formularfelder hat?', a: 'Das Tool informiert Sie, wenn keine ausfüllbaren Felder erkannt werden.' },
    ],
    zh: [
      { q: 'PDF表单填写器如何工作？', a: '上传带有表单字段的PDF，工具会自动检测所有可填写字段。输入值后下载完成的PDF。' },
      { q: '支持哪些类型的表单字段？', a: '完全支持文本字段。工具检测所有PDF表单字段类型。' },
      { q: '表单数据会嵌入PDF中吗？', a: '是的——填写后表单会被扁平化，数据成为PDF内容的一部分。' },
      { q: '如果我的PDF没有表单字段怎么办？', a: '如果未检测到可填写字段，工具会通知您。' },
    ],
  },

  redact: {
    en: [
      { q: 'How does PDF redaction work?', a: 'Upload a PDF and draw black rectangles over sensitive areas on each page. The redacted PDF will have those areas permanently blacked out.' },
      { q: 'Is the redaction permanent?', a: 'Yes — black rectangles are drawn directly onto the PDF content. The original text underneath is covered.' },
      { q: 'Can I undo redaction?', a: 'No. Once saved, the redaction is permanent. Always keep a copy of the original file.' },
      { q: 'Is this processed locally?', a: 'Yes. Your PDF never leaves your device. All redaction happens in your browser.' },
    ],
    ar: [
      { q: 'كيف يعمل إخفاء المحتوى في PDF؟', a: 'ارفع ملف PDF وارسم مستطيلات سوداء فوق المناطق الحساسة. سيتم إخفاء تلك المناطق نهائياً.' },
      { q: 'هل الإخفاء دائم؟', a: 'نعم — يتم رسم المستطيلات مباشرة على محتوى PDF.' },
      { q: 'هل يمكنني التراجع عن الإخفاء؟', a: 'لا. بمجرد الحفظ، يكون الإخفاء دائماً. احتفظ دائماً بنسخة من الملف الأصلي.' },
      { q: 'هل تتم المعالجة محلياً؟', a: 'نعم. ملف PDF لا يغادر جهازك أبداً.' },
    ],
    es: [
      { q: '¿Cómo funciona la redacción de PDF?', a: 'Sube un PDF y dibuja rectángulos negros sobre las áreas sensibles. Esas áreas quedarán permanentemente ocultas.' },
      { q: '¿La redacción es permanente?', a: 'Sí — los rectángulos se dibujan directamente sobre el contenido del PDF.' },
      { q: '¿Puedo deshacer la redacción?', a: 'No. Una vez guardada, la redacción es permanente. Siempre guarda una copia del original.' },
      { q: '¿Se procesa localmente?', a: 'Sí. Tu PDF nunca sale de tu dispositivo.' },
    ],
    fr: [
      { q: 'Comment fonctionne la rédaction PDF ?', a: 'Téléchargez un PDF et dessinez des rectangles noirs sur les zones sensibles.' },
      { q: 'La rédaction est-elle permanente ?', a: 'Oui — les rectangles sont dessinés directement sur le contenu du PDF.' },
      { q: 'Puis-je annuler la rédaction ?', a: 'Non. Une fois sauvegardée, la rédaction est permanente. Gardez toujours une copie de l\'original.' },
      { q: 'Le traitement est-il local ?', a: 'Oui. Votre PDF ne quitte jamais votre appareil.' },
    ],
    de: [
      { q: 'Wie funktioniert die PDF-Schwärzung?', a: 'Laden Sie ein PDF hoch und zeichnen Sie schwarze Rechtecke über sensible Bereiche.' },
      { q: 'Ist die Schwärzung dauerhaft?', a: 'Ja — die Rechtecke werden direkt auf den PDF-Inhalt gezeichnet.' },
      { q: 'Kann ich die Schwärzung rückgängig machen?', a: 'Nein. Einmal gespeichert, ist die Schwärzung dauerhaft. Behalten Sie immer eine Kopie des Originals.' },
      { q: 'Wird lokal verarbeitet?', a: 'Ja. Ihr PDF verlässt nie Ihr Gerät.' },
    ],
    zh: [
      { q: 'PDF涂黑如何工作？', a: '上传PDF并在敏感区域上绘制黑色矩形。这些区域将被永久遮盖。' },
      { q: '涂黑是永久的吗？', a: '是的——黑色矩形直接绘制在PDF内容上。' },
      { q: '可以撤销涂黑吗？', a: '不能。保存后涂黑是永久的。请始终保留原始文件的副本。' },
      { q: '在本地处理吗？', a: '是的。您的PDF永远不会离开您的设备。' },
    ],
  },

  pdfToImages: {
    en: [
      { q: 'How do I convert PDF to images?', a: 'Upload a PDF, select the image format (PNG or JPG) and quality, then click Convert. Each page becomes a separate image.' },
      { q: 'What quality settings are available?', a: '1x for standard resolution, 2x for high quality (recommended), and 3x for maximum detail.' },
      { q: 'Can I select specific pages?', a: 'Currently, all pages are converted. You can use our Split tool first to extract specific pages.' },
      { q: 'Are the images high resolution?', a: 'Yes, especially at 2x or 3x quality. The images are rendered at the PDF\'s native resolution multiplied by your chosen scale.' },
    ],
    ar: [
      { q: 'كيف أحول PDF إلى صور؟', a: 'ارفع ملف PDF، اختر تنسيق الصورة (PNG أو JPG) والجودة، ثم انقر على تحويل. كل صفحة تصبح صورة منفصلة.' },
      { q: 'ما إعدادات الجودة المتاحة؟', a: '1x للدقة القياسية، 2x للجودة العالية (موصى به)، و3x لأقصى تفصيل.' },
      { q: 'هل يمكنني تحديد صفحات معينة؟', a: 'حالياً يتم تحويل جميع الصفحات. يمكنك استخدام أداة التقسيم أولاً لاستخراج صفحات محددة.' },
      { q: 'هل الصور عالية الدقة؟', a: 'نعم، خاصة بجودة 2x أو 3x.' },
    ],
    es: [
      { q: '¿Cómo convierto PDF a imágenes?', a: 'Sube un PDF, selecciona el formato de imagen (PNG o JPG) y la calidad, luego haz clic en Convertir.' },
      { q: '¿Qué configuraciones de calidad están disponibles?', a: '1x para resolución estándar, 2x para alta calidad (recomendado), y 3x para máximo detalle.' },
      { q: '¿Puedo seleccionar páginas específicas?', a: 'Actualmente se convierten todas las páginas. Puedes usar la herramienta Dividir primero.' },
      { q: '¿Las imágenes son de alta resolución?', a: 'Sí, especialmente en calidad 2x o 3x.' },
    ],
    fr: [
      { q: 'Comment convertir un PDF en images ?', a: 'Téléchargez un PDF, sélectionnez le format (PNG ou JPG) et la qualité, puis cliquez sur Convertir.' },
      { q: 'Quels paramètres de qualité sont disponibles ?', a: '1x pour la résolution standard, 2x pour haute qualité (recommandé), 3x pour le maximum de détails.' },
      { q: 'Puis-je sélectionner des pages spécifiques ?', a: 'Actuellement, toutes les pages sont converties. Utilisez l\'outil Diviser d\'abord.' },
      { q: 'Les images sont-elles en haute résolution ?', a: 'Oui, surtout en qualité 2x ou 3x.' },
    ],
    de: [
      { q: 'Wie konvertiere ich PDF in Bilder?', a: 'Laden Sie ein PDF hoch, wählen Sie das Bildformat (PNG oder JPG) und die Qualität und klicken Sie auf Konvertieren.' },
      { q: 'Welche Qualitätseinstellungen gibt es?', a: '1x für Standardauflösung, 2x für hohe Qualität (empfohlen), 3x für maximale Details.' },
      { q: 'Kann ich bestimmte Seiten auswählen?', a: 'Derzeit werden alle Seiten konvertiert. Verwenden Sie zuerst das Aufteilen-Tool.' },
      { q: 'Sind die Bilder hochauflösend?', a: 'Ja, besonders bei 2x oder 3x Qualität.' },
    ],
    zh: [
      { q: '如何将PDF转换为图片？', a: '上传PDF，选择图片格式（PNG或JPG）和质量，然后点击转换。每页成为单独的图片。' },
      { q: '有哪些质量设置？', a: '1x标准分辨率，2x高质量（推荐），3x最高细节。' },
      { q: '可以选择特定页面吗？', a: '目前转换所有页面。您可以先使用拆分工具提取特定页面。' },
      { q: '图片是高分辨率的吗？', a: '是的，特别是2x或3x质量。' },
    ],
  },

  mergeImages: {
    en: [
      { q: 'What image formats can I merge into a PDF?', a: 'You can combine JPG, JPEG, PNG, and WEBP images into a single PDF document.' },
      { q: 'Can I reorder the images before merging?', a: 'Yes! Simply drag and drop the image thumbnails to arrange them in your preferred order.' },
      { q: 'Is there a limit on the number of images?', a: 'No artificial limit. Add as many images as your browser can handle.' },
      { q: 'What about image quality?', a: 'Images are embedded at their original resolution. No compression or quality loss is applied.' },
    ],
    ar: [
      { q: 'ما تنسيقات الصور التي يمكنني دمجها في PDF؟', a: 'يمكنك دمج صور JPG و JPEG و PNG و WEBP في مستند PDF واحد.' },
      { q: 'هل يمكنني إعادة ترتيب الصور قبل الدمج؟', a: 'نعم! ما عليك سوى سحب وإفلات الصور المصغرة لترتيبها.' },
      { q: 'هل هناك حد لعدد الصور؟', a: 'لا يوجد حد مصطنع. أضف أي عدد من الصور.' },
      { q: 'ماذا عن جودة الصور؟', a: 'يتم تضمين الصور بدقتها الأصلية. لا يتم تطبيق أي ضغط.' },
    ],
    es: [
      { q: '¿Qué formatos de imagen puedo combinar en un PDF?', a: 'Puedes combinar imágenes JPG, JPEG, PNG y WEBP en un único documento PDF.' },
      { q: '¿Puedo reordenar las imágenes antes de combinar?', a: '¡Sí! Simplemente arrastra y suelta las miniaturas para ordenarlas.' },
      { q: '¿Hay límite de número de imágenes?', a: 'Sin límite artificial. Añade tantas imágenes como tu navegador pueda manejar.' },
      { q: '¿Qué pasa con la calidad de imagen?', a: 'Las imágenes se insertan en su resolución original. No se aplica compresión.' },
    ],
    fr: [
      { q: 'Quels formats d\'image puis-je fusionner ?', a: 'Vous pouvez combiner des images JPG, JPEG, PNG et WEBP en un seul document PDF.' },
      { q: 'Puis-je réorganiser les images ?', a: 'Oui ! Glissez-déposez les miniatures pour les réorganiser.' },
      { q: 'Y a-t-il une limite au nombre d\'images ?', a: 'Aucune limite artificielle.' },
      { q: 'Qu\'en est-il de la qualité d\'image ?', a: 'Les images sont intégrées à leur résolution d\'origine. Aucune compression.' },
    ],
    de: [
      { q: 'Welche Bildformate kann ich zu einem PDF zusammenführen?', a: 'Sie können JPG, JPEG, PNG und WEBP Bilder zu einem einzigen PDF-Dokument kombinieren.' },
      { q: 'Kann ich die Bilder vor dem Zusammenführen neu ordnen?', a: 'Ja! Ziehen Sie die Miniaturansichten einfach per Drag & Drop.' },
      { q: 'Gibt es eine Begrenzung für die Anzahl der Bilder?', a: 'Keine künstliche Begrenzung.' },
      { q: 'Wie steht es um die Bildqualität?', a: 'Bilder werden in ihrer Originalauflösung eingebettet. Keine Komprimierung.' },
    ],
    zh: [
      { q: '可以将哪些图片格式合并为PDF？', a: '您可以将JPG、JPEG、PNG和WEBP图片合并为单个PDF文档。' },
      { q: '合并前可以重新排序图片吗？', a: '可以！只需拖放缩略图即可排列。' },
      { q: '图片数量有限制吗？', a: '没有人为限制。添加您浏览器能处理的任意数量。' },
      { q: '图片质量如何？', a: '图片以原始分辨率嵌入。不会应用压缩或质量损失。' },
    ],
  },

  ocr: {
    en: [
      { q: 'What is OCR?', a: 'OCR (Optical Character Recognition) converts images of text into machine-readable text, making scanned documents searchable and editable.' },
      { q: 'What languages are supported?', a: 'English, Spanish, French, German, Portuguese, Arabic, Chinese (Simplified), Hindi, and Japanese.' },
      { q: 'Is OCR processing done locally?', a: 'Yes! Tesseract.js runs entirely in your browser. Your files never leave your device.' },
      { q: 'How long does OCR take?', a: 'Processing time depends on page count and complexity. Most single-page documents complete in under 10 seconds.' },
      { q: 'Can I OCR a scanned PDF?', a: 'Yes! Upload a scanned PDF and the tool will render each page, then extract text using OCR.' },
    ],
    ar: [
      { q: 'ما هو التعرف الضوئي على الحروف (OCR)؟', a: 'OCR يحول صور النص إلى نص يمكن للآلة قراءته، مما يجعل المستندات الممسوحة ضوئياً قابلة للبحث والتحرير.' },
      { q: 'ما اللغات المدعومة؟', a: 'الإنجليزية، الإسبانية، الفرنسية، الألمانية، البرتغالية، العربية، الصينية المبسطة، الهندية، واليابانية.' },
      { q: 'هل تتم معالجة OCR محلياً؟', a: 'نعم! يعمل Tesseract.js بالكامل في متصفحك. ملفاتك لا تغادر جهازك أبداً.' },
      { q: 'كم يستغرق OCR؟', a: 'يعتمد وقت المعالجة على عدد الصفحات والتعقيد. معظم المستندات ذات الصفحة الواحدة تكتمل في أقل من 10 ثوانٍ.' },
      { q: 'هل يمكنني استخدام OCR على PDF ممسوح ضوئياً؟', a: 'نعم! ارفع PDF ممسوح ضوئياً وستقوم الأداة بعرض كل صفحة ثم استخراج النص.' },
    ],
    es: [
      { q: '¿Qué es OCR?', a: 'OCR (Reconocimiento Óptico de Caracteres) convierte imágenes de texto en texto legible por máquina.' },
      { q: '¿Qué idiomas son compatibles?', a: 'Inglés, español, francés, alemán, portugués, árabe, chino simplificado, hindi y japonés.' },
      { q: '¿El procesamiento OCR es local?', a: '¡Sí! Tesseract.js se ejecuta completamente en tu navegador.' },
      { q: '¿Cuánto tarda el OCR?', a: 'Depende del número de páginas. La mayoría de documentos de una página se completan en menos de 10 segundos.' },
      { q: '¿Puedo usar OCR en un PDF escaneado?', a: '¡Sí! Sube un PDF escaneado y la herramienta extraerá el texto.' },
    ],
    fr: [
      { q: 'Qu\'est-ce que l\'OCR ?', a: 'L\'OCR (Reconnaissance Optique de Caractères) convertit les images de texte en texte lisible par machine.' },
      { q: 'Quelles langues sont prises en charge ?', a: 'Anglais, espagnol, français, allemand, portugais, arabe, chinois simplifié, hindi et japonais.' },
      { q: 'Le traitement OCR est-il local ?', a: 'Oui ! Tesseract.js fonctionne entièrement dans votre navigateur.' },
      { q: 'Combien de temps prend l\'OCR ?', a: 'La plupart des documents d\'une page sont traités en moins de 10 secondes.' },
      { q: 'Puis-je faire de l\'OCR sur un PDF numérisé ?', a: 'Oui ! Téléchargez un PDF numérisé et l\'outil extraira le texte.' },
    ],
    de: [
      { q: 'Was ist OCR?', a: 'OCR (Optische Zeichenerkennung) wandelt Textbilder in maschinenlesbaren Text um.' },
      { q: 'Welche Sprachen werden unterstützt?', a: 'Englisch, Spanisch, Französisch, Deutsch, Portugiesisch, Arabisch, vereinfachtes Chinesisch, Hindi und Japanisch.' },
      { q: 'Wird die OCR-Verarbeitung lokal durchgeführt?', a: 'Ja! Tesseract.js läuft vollständig in Ihrem Browser.' },
      { q: 'Wie lange dauert OCR?', a: 'Die meisten einseitigen Dokumente werden in unter 10 Sekunden verarbeitet.' },
      { q: 'Kann ich OCR auf ein gescanntes PDF anwenden?', a: 'Ja! Laden Sie ein gescanntes PDF hoch und das Tool extrahiert den Text.' },
    ],
    zh: [
      { q: '什么是OCR？', a: 'OCR（光学字符识别）将文字图像转换为机器可读文本，使扫描文档可搜索和编辑。' },
      { q: '支持哪些语言？', a: '英语、西班牙语、法语、德语、葡萄牙语、阿拉伯语、简体中文、印地语和日语。' },
      { q: 'OCR处理是本地完成的吗？', a: '是的！Tesseract.js完全在您的浏览器中运行。' },
      { q: 'OCR需要多长时间？', a: '大多数单页文档在10秒内完成。' },
      { q: '可以对扫描的PDF使用OCR吗？', a: '可以！上传扫描的PDF，工具会渲染每页并提取文本。' },
    ],
  },

  editor: {
    en: [
      { q: 'What can I do with the PDF Editor?', a: 'Add text, highlights, freehand drawings, lines, arrows, rectangles, circles, sticky notes, and images to any PDF page.' },
      { q: 'Is editing done locally?', a: 'Yes! All rendering and editing happens in your browser. Your PDF never leaves your device.' },
      { q: 'Can I undo my changes?', a: 'Yes — use Ctrl+Z to undo and Ctrl+Y to redo. The editor maintains a full undo/redo history.' },
      { q: 'Will my annotations be part of the PDF?', a: 'Yes. When you save, all annotations are permanently embedded into the PDF.' },
      { q: 'Can I edit text already in the PDF?', a: 'The editor focuses on adding annotations. To edit existing text, you may need a desktop tool.' },
    ],
    ar: [
      { q: 'ماذا يمكنني فعله بمحرر PDF؟', a: 'إضافة نصوص، تمييز، رسومات حرة، خطوط، أسهم، مستطيلات، دوائر، ملاحظات لاصقة، وصور إلى أي صفحة PDF.' },
      { q: 'هل يتم التحرير محلياً؟', a: 'نعم! كل العرض والتحرير يتم في متصفحك.' },
      { q: 'هل يمكنني التراجع عن تغييراتي؟', a: 'نعم — استخدم Ctrl+Z للتراجع و Ctrl+Y للإعادة.' },
      { q: 'هل ستكون التعليقات جزءاً من PDF؟', a: 'نعم. عند الحفظ، يتم تضمين جميع التعليقات في PDF بشكل دائم.' },
      { q: 'هل يمكنني تحرير نص موجود في PDF؟', a: 'المحرر يركز على إضافة التعليقات. لتحرير النص الموجود، قد تحتاج إلى أداة سطح مكتب.' },
    ],
    es: [
      { q: '¿Qué puedo hacer con el Editor de PDF?', a: 'Añadir texto, resaltados, dibujos, líneas, flechas, rectángulos, círculos, notas adhesivas e imágenes.' },
      { q: '¿La edición es local?', a: '¡Sí! Todo ocurre en tu navegador. Tu PDF nunca sale de tu dispositivo.' },
      { q: '¿Puedo deshacer mis cambios?', a: 'Sí — usa Ctrl+Z para deshacer y Ctrl+Y para rehacer.' },
      { q: '¿Las anotaciones serán parte del PDF?', a: 'Sí. Al guardar, todas las anotaciones se incrustan permanentemente.' },
      { q: '¿Puedo editar texto existente en el PDF?', a: 'El editor se centra en añadir anotaciones. Para editar texto existente, puedes necesitar una herramienta de escritorio.' },
    ],
    fr: [
      { q: 'Que puis-je faire avec l\'éditeur PDF ?', a: 'Ajouter du texte, des surlignages, des dessins, des lignes, des flèches, des rectangles, des cercles, des notes et des images.' },
      { q: 'L\'édition est-elle locale ?', a: 'Oui ! Tout se passe dans votre navigateur.' },
      { q: 'Puis-je annuler mes modifications ?', a: 'Oui — utilisez Ctrl+Z pour annuler et Ctrl+Y pour rétablir.' },
      { q: 'Mes annotations feront-elles partie du PDF ?', a: 'Oui. Lors de la sauvegarde, toutes les annotations sont intégrées définitivement.' },
      { q: 'Puis-je modifier le texte existant ?', a: 'L\'éditeur se concentre sur l\'ajout d\'annotations. Pour modifier le texte existant, un outil de bureau peut être nécessaire.' },
    ],
    de: [
      { q: 'Was kann ich mit dem PDF-Editor machen?', a: 'Text, Hervorhebungen, Freihandzeichnungen, Linien, Pfeile, Rechtecke, Kreise, Haftnotizen und Bilder hinzufügen.' },
      { q: 'Wird lokal bearbeitet?', a: 'Ja! Alles passiert in Ihrem Browser.' },
      { q: 'Kann ich meine Änderungen rückgängig machen?', a: 'Ja — verwenden Sie Strg+Z zum Rückgängigmachen und Strg+Y zum Wiederherstellen.' },
      { q: 'Werden meine Anmerkungen Teil des PDFs?', a: 'Ja. Beim Speichern werden alle Anmerkungen dauerhaft eingebettet.' },
      { q: 'Kann ich vorhandenen Text bearbeiten?', a: 'Der Editor konzentriert sich auf das Hinzufügen von Anmerkungen.' },
    ],
    zh: [
      { q: '我可以用PDF编辑器做什么？', a: '向任何页面添加文本、高亮、手绘、线条、箭头、矩形、圆形、便签和图片。' },
      { q: '编辑是在本地完成的吗？', a: '是的！所有渲染和编辑都在浏览器中进行。' },
      { q: '可以撤销更改吗？', a: '可以——使用Ctrl+Z撤销，Ctrl+Y重做。' },
      { q: '注释会成为PDF的一部分吗？', a: '是的。保存时，所有注释都会永久嵌入PDF中。' },
      { q: '可以编辑PDF中已有的文本吗？', a: '编辑器专注于添加注释。要编辑现有文本，可能需要桌面工具。' },
    ],
  },

  svgToImage: {
    en: [
      { q: 'What image formats can I convert SVG to?', a: 'You can convert to PNG, JPG, WEBP, and BMP — all processed in your browser.' },
      { q: 'Will I lose quality?', a: 'SVGs are vector-based so they scale perfectly. Choose a higher scale (2x–4x) for crisp output.' },
      { q: 'Is my SVG uploaded to a server?', a: 'No. Everything runs 100% in your browser. Your files never leave your device.' },
      { q: 'Can I convert SVGs with transparency?', a: 'Yes! PNG and WEBP preserve transparency. JPG and BMP will have a white background.' },
    ],
    ar: [
      { q: 'ما تنسيقات الصور التي يمكنني تحويل SVG إليها؟', a: 'يمكنك التحويل إلى PNG و JPG و WEBP و BMP — كل شيء يتم في متصفحك.' },
      { q: 'هل سأفقد الجودة؟', a: 'ملفات SVG متجهية لذا تتغير حجمها بشكل مثالي. اختر مقياساً أعلى للحصول على مخرجات واضحة.' },
      { q: 'هل يتم رفع ملف SVG إلى خادم؟', a: 'لا. كل شيء يعمل 100% في متصفحك.' },
      { q: 'هل يمكنني تحويل SVG مع الشفافية؟', a: 'نعم! PNG و WEBP يحافظان على الشفافية. JPG و BMP سيكون لهما خلفية بيضاء.' },
    ],
    es: [
      { q: '¿A qué formatos puedo convertir SVG?', a: 'Puedes convertir a PNG, JPG, WEBP y BMP — todo procesado en tu navegador.' },
      { q: '¿Perderé calidad?', a: 'Los SVG son vectoriales, por lo que escalan perfectamente. Elige una escala mayor (2x-4x) para mejor resultado.' },
      { q: '¿Se sube mi SVG a un servidor?', a: 'No. Todo se ejecuta 100% en tu navegador.' },
      { q: '¿Puedo convertir SVGs con transparencia?', a: '¡Sí! PNG y WEBP preservan la transparencia. JPG y BMP tendrán fondo blanco.' },
    ],
    fr: [
      { q: 'Vers quels formats puis-je convertir un SVG ?', a: 'Vous pouvez convertir en PNG, JPG, WEBP et BMP — tout dans votre navigateur.' },
      { q: 'Vais-je perdre en qualité ?', a: 'Les SVG sont vectoriels et s\'adaptent parfaitement. Choisissez une échelle plus élevée pour un résultat net.' },
      { q: 'Mon SVG est-il téléversé ?', a: 'Non. Tout fonctionne à 100% dans votre navigateur.' },
      { q: 'Puis-je convertir des SVG avec transparence ?', a: 'Oui ! PNG et WEBP préservent la transparence. JPG et BMP auront un fond blanc.' },
    ],
    de: [
      { q: 'In welche Bildformate kann ich SVG konvertieren?', a: 'Sie können in PNG, JPG, WEBP und BMP konvertieren — alles in Ihrem Browser.' },
      { q: 'Verliere ich an Qualität?', a: 'SVGs sind vektorbasiert und skalieren perfekt. Wählen Sie eine höhere Skalierung für scharfe Ausgabe.' },
      { q: 'Wird mein SVG hochgeladen?', a: 'Nein. Alles läuft 100% in Ihrem Browser.' },
      { q: 'Kann ich SVGs mit Transparenz konvertieren?', a: 'Ja! PNG und WEBP bewahren die Transparenz. JPG und BMP haben einen weißen Hintergrund.' },
    ],
    zh: [
      { q: '可以将SVG转换为哪些图片格式？', a: '可以转换为PNG、JPG、WEBP和BMP——全部在浏览器中处理。' },
      { q: '会损失质量吗？', a: 'SVG是矢量格式，可以完美缩放。选择更高的缩放比例以获得清晰输出。' },
      { q: '我的SVG会上传到服务器吗？', a: '不会。一切100%在您的浏览器中运行。' },
      { q: '可以转换带透明度的SVG吗？', a: '可以！PNG和WEBP保留透明度。JPG和BMP将有白色背景。' },
    ],
  },
  excelToPdf: {
    en: [
      { q: 'What file formats are supported?', a: 'You can convert .xlsx, .xls, and .csv files to PDF.' },
      { q: 'Are my spreadsheets uploaded to a server?', a: 'No. All processing happens 100% in your browser. Your files never leave your device.' },
      { q: 'Does it preserve formatting?', a: 'The converter renders table data with gridlines and headers. Complex Excel formatting like charts may not be preserved.' },
      { q: 'Is there a file size limit?', a: 'No artificial limit — it depends on your browser\'s memory capacity.' },
    ],
    ar: [
      { q: 'ما هي صيغ الملفات المدعومة؟', a: 'يمكنك تحويل ملفات .xlsx و .xls و .csv إلى PDF.' },
      { q: 'هل يتم رفع جداولي إلى خادم؟', a: 'لا. تتم جميع العمليات بنسبة 100% في متصفحك.' },
      { q: 'هل يحافظ على التنسيق؟', a: 'يعرض المحول بيانات الجدول مع خطوط الشبكة والرؤوس.' },
      { q: 'هل هناك حد لحجم الملف؟', a: 'لا حد مصطنع — يعتمد على سعة ذاكرة متصفحك.' },
    ],
    es: [
      { q: '¿Qué formatos de archivo son compatibles?', a: 'Puedes convertir archivos .xlsx, .xls y .csv a PDF.' },
      { q: '¿Se suben mis hojas de cálculo a un servidor?', a: 'No. Todo el procesamiento ocurre 100% en tu navegador.' },
      { q: '¿Preserva el formato?', a: 'El convertidor renderiza datos de tabla con líneas de cuadrícula y encabezados.' },
      { q: '¿Hay un límite de tamaño de archivo?', a: 'No hay límite artificial — depende de la capacidad de memoria de tu navegador.' },
    ],
  },
  pptxToPdf: {
    en: [
      { q: 'What PowerPoint formats are supported?', a: 'Currently .pptx files are supported. Older .ppt files need to be saved as .pptx first.' },
      { q: 'Are my presentations uploaded to a server?', a: 'No. Everything is processed 100% in your browser. Your files never leave your device.' },
      { q: 'Does it preserve images and animations?', a: 'The converter extracts text content and layout. Complex animations and embedded media may not be fully rendered.' },
      { q: 'Do I need to sign up?', a: 'No. This tool is completely free with no sign-up required.' },
    ],
    ar: [
      { q: 'ما صيغ PowerPoint المدعومة؟', a: 'حالياً يتم دعم ملفات .pptx. يجب حفظ ملفات .ppt القديمة كـ .pptx أولاً.' },
      { q: 'هل يتم رفع عروضي التقديمية إلى خادم؟', a: 'لا. يتم معالجة كل شيء بنسبة 100% في متصفحك.' },
      { q: 'هل يحافظ على الصور والرسوم المتحركة؟', a: 'يستخرج المحول محتوى النص والتخطيط.' },
      { q: 'هل أحتاج إلى التسجيل؟', a: 'لا. هذه الأداة مجانية تماماً بدون تسجيل.' },
    ],
    es: [
      { q: '¿Qué formatos de PowerPoint son compatibles?', a: 'Actualmente se admiten archivos .pptx. Los archivos .ppt antiguos deben guardarse como .pptx primero.' },
      { q: '¿Se suben mis presentaciones a un servidor?', a: 'No. Todo se procesa 100% en tu navegador.' },
      { q: '¿Preserva las imágenes y animaciones?', a: 'El convertidor extrae el contenido de texto y el diseño.' },
      { q: '¿Necesito registrarme?', a: 'No. Esta herramienta es completamente gratuita sin registro.' },
    ],
  },
  webpageToPdf: {
    en: [
      { q: 'How do I convert HTML to PDF?', a: 'Paste your HTML code or upload an HTML file, then click "Convert to PDF". The PDF will be generated instantly.' },
      { q: 'Can I convert a live webpage?', a: 'You can save a webpage as HTML (Ctrl+S / Cmd+S) and then upload the file to convert it to PDF.' },
      { q: 'Are my files uploaded to a server?', a: 'No. All processing happens 100% in your browser. Your data never leaves your device.' },
      { q: 'Does it preserve CSS styling?', a: 'The converter extracts structured text content (headings, paragraphs, lists). Complex CSS layouts may be simplified.' },
    ],
    ar: [
      { q: 'كيف أحول HTML إلى PDF؟', a: 'الصق كود HTML أو ارفع ملف HTML ثم انقر "تحويل إلى PDF".' },
      { q: 'هل يمكنني تحويل صفحة ويب مباشرة؟', a: 'يمكنك حفظ صفحة الويب كـ HTML ثم رفع الملف.' },
      { q: 'هل يتم رفع ملفاتي إلى خادم؟', a: 'لا. تتم جميع العمليات بنسبة 100% في متصفحك.' },
      { q: 'هل يحافظ على تنسيق CSS؟', a: 'يستخرج المحول المحتوى النصي المهيكل. قد يتم تبسيط تخطيطات CSS المعقدة.' },
    ],
    es: [
      { q: '¿Cómo convierto HTML a PDF?', a: 'Pega tu código HTML o sube un archivo HTML, luego haz clic en "Convertir a PDF".' },
      { q: '¿Puedo convertir una página web en vivo?', a: 'Puedes guardar una página web como HTML (Ctrl+S) y luego subir el archivo.' },
      { q: '¿Se suben mis archivos a un servidor?', a: 'No. Todo el procesamiento ocurre 100% en tu navegador.' },
      { q: '¿Preserva el estilo CSS?', a: 'El convertidor extrae contenido de texto estructurado. Los diseños CSS complejos pueden simplificarse.' },
    ],
  },
  heicToPdf: {
    en: [
      { q: 'What is HEIC format?', a: 'HEIC (High Efficiency Image Container) is Apple\'s default photo format on iPhone and iPad. It offers better compression than JPEG while maintaining quality.' },
      { q: 'What can I convert HEIC to?', a: 'You can convert HEIC/HEIF images to JPG, PNG, or combine them into a single PDF document.' },
      { q: 'Are my photos uploaded to a server?', a: 'No. All conversion happens 100% in your browser. Your photos never leave your device.' },
      { q: 'Can I convert multiple HEIC files at once?', a: 'Yes! You can select multiple HEIC/HEIF files and convert them all at once.' },
    ],
    ar: [
      { q: 'ما هو تنسيق HEIC؟', a: 'HEIC هو تنسيق الصور الافتراضي من Apple على iPhone و iPad. يوفر ضغطاً أفضل من JPEG.' },
      { q: 'إلى ماذا يمكنني تحويل HEIC؟', a: 'يمكنك تحويل صور HEIC/HEIF إلى JPG أو PNG أو دمجها في مستند PDF واحد.' },
      { q: 'هل يتم رفع صوري إلى خادم؟', a: 'لا. يتم التحويل بنسبة 100% في متصفحك.' },
      { q: 'هل يمكنني تحويل عدة ملفات HEIC مرة واحدة؟', a: 'نعم! يمكنك تحديد عدة ملفات HEIC/HEIF وتحويلها جميعاً مرة واحدة.' },
    ],
    es: [
      { q: '¿Qué es el formato HEIC?', a: 'HEIC es el formato de fotos predeterminado de Apple en iPhone y iPad. Ofrece mejor compresión que JPEG.' },
      { q: '¿A qué puedo convertir HEIC?', a: 'Puedes convertir imágenes HEIC/HEIF a JPG, PNG o combinarlas en un solo documento PDF.' },
      { q: '¿Se suben mis fotos a un servidor?', a: 'No. Toda la conversión ocurre 100% en tu navegador.' },
      { q: '¿Puedo convertir varios archivos HEIC a la vez?', a: '¡Sí! Puedes seleccionar múltiples archivos HEIC/HEIF y convertirlos todos a la vez.' },
    ],
  },
  repairPdf: {
    en: [
      { q: 'What types of PDF damage can be repaired?', a: 'This tool can fix corrupted cross-reference tables, broken page trees, damaged metadata, and re-index pages for a clean structure.' },
      { q: 'Will repairing change my PDF content?', a: 'No. The repair process preserves all existing page content. It only fixes the internal structure and metadata.' },
      { q: 'Are my files uploaded to a server?', a: 'No. All repair processing happens 100% in your browser. Your files never leave your device.' },
      { q: 'What if my PDF is too damaged to repair?', a: 'Severely corrupted files (e.g., truncated or encrypted with unknown passwords) may not be recoverable. The tool will let you know.' },
    ],
    ar: [
      { q: 'ما أنواع تلف PDF التي يمكن إصلاحها؟', a: 'يمكن لهذه الأداة إصلاح جداول المراجع التالفة وأشجار الصفحات المعطلة والبيانات الوصفية التالفة.' },
      { q: 'هل سيغير الإصلاح محتوى PDF؟', a: 'لا. عملية الإصلاح تحافظ على جميع محتويات الصفحات. إنها تصلح فقط الهيكل الداخلي.' },
      { q: 'هل يتم رفع ملفاتي إلى خادم؟', a: 'لا. تتم جميع عمليات الإصلاح بنسبة 100% في متصفحك.' },
      { q: 'ماذا لو كان PDF تالفاً جداً للإصلاح؟', a: 'الملفات التالفة بشدة قد لا تكون قابلة للاسترداد. ستعلمك الأداة بذلك.' },
    ],
    es: [
      { q: '¿Qué tipos de daños de PDF se pueden reparar?', a: 'Esta herramienta puede reparar tablas de referencias cruzadas corruptas, árboles de páginas rotos y metadatos dañados.' },
      { q: '¿Cambiará la reparación el contenido de mi PDF?', a: 'No. El proceso de reparación preserva todo el contenido existente.' },
      { q: '¿Se suben mis archivos a un servidor?', a: 'No. Todo el procesamiento ocurre 100% en tu navegador.' },
      { q: '¿Qué pasa si mi PDF está demasiado dañado?', a: 'Los archivos severamente corruptos pueden no ser recuperables. La herramienta te lo informará.' },
    ],
  },
  pdfBookmarks: {
    en: [
      { q: 'What are PDF bookmarks?', a: 'PDF bookmarks are a table of contents that appears as a sidebar in PDF readers, allowing quick navigation to specific sections or pages.' },
      { q: 'Can I add multiple bookmarks?', a: 'Yes! You can add as many bookmarks as you need, each pointing to a different page in your PDF document.' },
      { q: 'Will this modify my PDF content?', a: 'No. Adding bookmarks only adds navigation metadata — your actual page content remains completely unchanged.' },
      { q: 'Are my files uploaded to a server?', a: 'No. All processing happens 100% in your browser. Your files never leave your device.' },
    ],
    ar: [
      { q: 'ما هي إشارات PDF المرجعية؟', a: 'إشارات PDF المرجعية هي فهرس محتويات يظهر كشريط جانبي في قارئات PDF، مما يسمح بالتنقل السريع.' },
      { q: 'هل يمكنني إضافة عدة إشارات مرجعية؟', a: 'نعم! يمكنك إضافة أي عدد من الإشارات المرجعية، كل منها يشير إلى صفحة مختلفة.' },
      { q: 'هل سيغير هذا محتوى PDF؟', a: 'لا. إضافة الإشارات المرجعية تضيف فقط بيانات التنقل — يبقى محتوى الصفحات بدون تغيير.' },
      { q: 'هل يتم رفع ملفاتي إلى خادم؟', a: 'لا. تتم جميع العمليات بنسبة 100% في متصفحك.' },
    ],
    es: [
      { q: '¿Qué son los marcadores de PDF?', a: 'Los marcadores de PDF son una tabla de contenidos que aparece como barra lateral en los lectores de PDF.' },
      { q: '¿Puedo añadir varios marcadores?', a: '¡Sí! Puedes añadir tantos marcadores como necesites, cada uno apuntando a una página diferente.' },
      { q: '¿Esto modificará el contenido de mi PDF?', a: 'No. Añadir marcadores solo agrega metadatos de navegación.' },
      { q: '¿Se suben mis archivos a un servidor?', a: 'No. Todo el procesamiento ocurre 100% en tu navegador.' },
    ],
  },
  pageSize: {
    en: [
      { q: 'What page sizes are supported?', a: 'We support A4, A3, A5, Letter, Legal, Tabloid, B5, and Executive sizes. Content is automatically scaled and centered.' },
      { q: 'Will resizing distort my content?', a: 'No. Content is proportionally scaled to fit the new page size while maintaining its aspect ratio, then centered on the page.' },
      { q: 'Can I resize individual pages?', a: 'Currently, the tool resizes all pages to the same target size. For individual page sizing, use the Crop tool.' },
      { q: 'Are my files uploaded to a server?', a: 'No. All processing happens 100% in your browser. Your files never leave your device.' },
    ],
    ar: [
      { q: 'ما أحجام الصفحات المدعومة؟', a: 'ندعم A4 و A3 و A5 و Letter و Legal و Tabloid و B5 و Executive. يتم تغيير حجم المحتوى تلقائياً وتوسيطه.' },
      { q: 'هل سيؤدي تغيير الحجم إلى تشويه المحتوى؟', a: 'لا. يتم تغيير حجم المحتوى بشكل متناسب مع الحفاظ على نسبة العرض إلى الارتفاع.' },
      { q: 'هل يمكنني تغيير حجم صفحات فردية؟', a: 'حالياً، تقوم الأداة بتغيير حجم جميع الصفحات إلى نفس الحجم المستهدف.' },
      { q: 'هل يتم رفع ملفاتي إلى خادم؟', a: 'لا. تتم جميع العمليات بنسبة 100% في متصفحك.' },
    ],
    es: [
      { q: '¿Qué tamaños de página se admiten?', a: 'Admitimos A4, A3, A5, Letter, Legal, Tabloid, B5 y Executive. El contenido se escala y centra automáticamente.' },
      { q: '¿Redimensionar distorsionará mi contenido?', a: 'No. El contenido se escala proporcionalmente manteniendo su relación de aspecto.' },
      { q: '¿Puedo redimensionar páginas individuales?', a: 'Actualmente, la herramienta redimensiona todas las páginas al mismo tamaño objetivo.' },
      { q: '¿Se suben mis archivos a un servidor?', a: 'No. Todo el procesamiento ocurre 100% en tu navegador.' },
    ],
  },
};
  pdfToExcel: {
    en: [
      { q: 'How does PDF to Excel extraction work?', a: 'The tool reads each page of your PDF, groups text by position into rows and columns, and exports the structured data as an Excel spreadsheet or CSV file.' },
      { q: 'Will it work with scanned PDFs?', a: 'This tool extracts text-based content. For scanned/image PDFs, use the OCR tool first to make text extractable, then convert to Excel.' },
      { q: 'What formats can I download?', a: 'You can download the extracted data as an .xlsx (Excel) file or a .csv file for maximum compatibility.' },
      { q: 'Are my files uploaded to a server?', a: 'No. All processing happens 100% in your browser. Your files never leave your device.' },
    ],
    ar: [
      { q: 'كيف يعمل استخراج PDF إلى Excel؟', a: 'تقرأ الأداة كل صفحة من PDF وتجمع النص حسب الموقع في صفوف وأعمدة وتصدر البيانات كملف Excel.' },
      { q: 'هل يعمل مع ملفات PDF الممسوحة ضوئياً؟', a: 'تستخرج هذه الأداة المحتوى النصي. للملفات الممسوحة ضوئياً، استخدم أداة OCR أولاً.' },
      { q: 'ما الصيغ المتاحة للتنزيل؟', a: 'يمكنك تنزيل البيانات كملف Excel (.xlsx) أو ملف CSV.' },
      { q: 'هل يتم رفع ملفاتي إلى خادم؟', a: 'لا. تتم جميع العمليات بنسبة 100% في متصفحك.' },
    ],
    es: [
      { q: '¿Cómo funciona la extracción de PDF a Excel?', a: 'La herramienta lee cada página del PDF, agrupa el texto por posición en filas y columnas, y exporta los datos como archivo Excel.' },
      { q: '¿Funciona con PDFs escaneados?', a: 'Esta herramienta extrae contenido basado en texto. Para PDFs escaneados, usa primero la herramienta OCR.' },
      { q: '¿En qué formatos puedo descargar?', a: 'Puedes descargar los datos extraídos como archivo .xlsx (Excel) o .csv.' },
      { q: '¿Se suben mis archivos a un servidor?', a: 'No. Todo el procesamiento ocurre 100% en tu navegador.' },
    ],
  },
};

export function getTranslatedFaqs(toolId: string, lang: string): FaqItem[] {
  const tool = faqData[toolId];
  if (!tool) return [];
  return tool[lang as Lang] || tool.en;
}
