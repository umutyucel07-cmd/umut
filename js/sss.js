(function(){
const { Card, Icon, Button } = window.LexaHukukDesignSystem_93e85e;
const e = React.createElement;

const SSS_GRUPLARI = [
  ['Randevu ve görüşme', [
    ['Randevu nasıl alınır?', 'Web sitesindeki takvimden uygun saati seçebilir, WhatsApp üzerinden yazabilir ya da doğrudan arayabilirsiniz: ' + window.BURO.tel + '.'],
    ['Görüntülü veya sesli görüşme yapılıyor mu?', 'Evet. Ofiste, görüntülü ya da sesli görüşme seçeneklerinden birini tercih edebilirsiniz; randevu adımlarında saat ve süre birlikte belirlenir.'],
  ]],
  ['Vekâlet ve belgeler', [
    ['Vekâletname nasıl çıkarılır?', window.BURO.vekalet],
    ['Belgelerimi nasıl iletebilirim?', 'Sözleşme, ihtarname ve dosyanıza esas belgeleri WhatsApp ya da kayıtlı elektronik posta (KEP) yoluyla iletebilirsiniz. Resmî tebligat gerektiren hâllerde KEP kullanılır: ' + window.BURO.kep + '.'],
  ]],
  ['Ödeme', [
    ['Ödeme nasıl yapılır?', 'Kartla ödeme bağlantımızdan ya da banka hesabımıza havale/EFT ile ödeme yapabilirsiniz. Havale/EFT sonrası dekontun iletilmesi rica olunur.'],
  ]],
  ['Dosya takibi', [
    ['Dosyamın durumunu nasıl görürüm?', 'Tarafınıza verilen erişim koduyla müvekkil portalından dosyanızın aşamasını, yaklaşan duruşma tarihlerini ve tamamlanan işlemleri görüntüleyebilirsiniz.'],
    ['Aldığım yanıt hukuki görüş sayılır mı?', 'Uygulama ve WhatsApp üzerinden verilen ön bilgilendirmeler "Ön Değerlendirme" olarak işaretlenir ve hukuki görüş yerine geçmez; dosyanıza özgü değerlendirme yalnız görüşme sonrası tarafımızca yapılır.'],
  ]],
];

function SSSMadde({ soru, cevap }) {
  const [acik, setAcik] = React.useState(false);
  return e('div', { style: { borderBottom: '1px solid var(--border-hairline)' } },
    e('button', { onClick: () => setAcik(a => !a), style: { width: '100%', display: 'flex', alignItems: 'center', gap: 'var(--space-3)', background: 'none', border: 0, padding: 'var(--space-4) 0', cursor: 'pointer', textAlign: 'left', font: 'inherit' } },
      e('span', { style: { flex: 1, fontSize: 'var(--text-body)', fontWeight: 600, color: 'var(--text-heading)' } }, soru),
      e(Icon, { name: acik ? 'minus' : 'plus', size: 16, color: 'var(--brass-600)', style: { flex: '0 0 auto' } })),
    acik ? e('p', { style: { margin: 0, paddingBottom: 'var(--space-4)', fontSize: 'var(--text-body-sm)', color: 'var(--text-muted)', lineHeight: 'var(--leading-relaxed)', maxWidth: '68ch', textWrap: 'pretty' } }, cevap) : null);
}

function SSSScreen({ go }) {
  return e('main', { style: { maxWidth: 'var(--max-content)', margin: '0 auto', padding: 'var(--space-12) var(--gutter-page-lg) var(--space-20)' } },
    e(SectionHead, { eyebrow: 'SIK SORULANLAR', title: 'Süreç hakkında en çok sorulan sorular', sub: 'Aşağıda yer almayan bir sorunuz varsa doğrudan yazabilir ya da arayabilirsiniz.' }),
    e('div', { style: { display: 'flex', flexDirection: 'column', gap: 'var(--space-8)', marginTop: 'var(--space-10)' } },
      SSS_GRUPLARI.map(([grup, maddeler]) => e('div', { key: grup },
        e('span', { className: 'eyebrow' }, grup.toUpperCase()),
        e(Card, { padding: 'md', style: { marginTop: 'var(--space-3)' } },
          maddeler.map(([s, c]) => e(SSSMadde, { key: s, soru: s, cevap: c })))))),
    e(Card, { tone: 'inverse', padding: 'md', style: { marginTop: 'var(--space-10)', display: 'flex', alignItems: 'center', gap: 'var(--space-5)' } },
      e(Icon, { name: 'message-circle', size: 22, color: 'var(--brass-400)', style: { flex: '0 0 auto' } }),
      e('div', { style: { flex: 1 } },
        e('div', { style: { fontSize: 'var(--text-body)', fontWeight: 600, color: 'var(--paper-1)' } }, 'Sorunuzu bulamadınız mı?'),
        e('div', { style: { fontSize: 'var(--text-body-sm)', color: 'var(--ink-300)', marginTop: 2 } }, 'WhatsApp üzerinden yazın, bir iş günü içinde dönüş yapılır.')),
      e(Button, { as: 'a', href: window.BURO.whatsapp, target: '_blank', rel: 'noopener', variant: 'accent', icon: 'message-circle' }, 'WhatsApp')));
}

Object.assign(window, { SSSScreen });
})();
