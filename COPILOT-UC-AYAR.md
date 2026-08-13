# Üç Ayar — Talimat ve Kod

**13.08.2026** · Av. Umut Yücel · sicil no 6448

> **Üçü de dashboard işidir; Copilot'un tıklayabileceği bir arayüz yok.**
> Copilot'un gerçekten yapabileceği şey **doğrulama** ve **hazırlık** — ikisi de
> aşağıda çalışır kod olarak var. Ayarların kendisi Av. Umut Yücel'de kalır.

| Ayar | Kim yapar | Copilot ne yapar |
|---|---|---|
| 1 · Yayın dizini | Kullanıcı (2 alan) | `tools/yayin-dogrula.sh` ile sonucu ölçer |
| 2 · Jeton rotasyonu | Kullanıcı (3 yer) | `tools/jeton-dogrula.sh` ile el sıkışmayı ölçer |
| 3 · Ortam değişkenleri | Kullanıcı (3 sır) | **Önce §3'teki tasarım kararını uygular** |

---

## AYAR 1 — Yayın dizini (en öncelikli)

Belge sızıntısını kapatan **tek** şey. `_redirects` yaklaşımı ölçüldü ve çalışmıyor:
Cloudflare Pages önce statik varlığa bakıyor, yönlendirme var olan dosyanın üzerini örtemiyor.

### Kullanıcı — iki alan

```
Cloudflare → Workers & Pages → proje → Settings → Builds & deployments
  Build command            : bash tools/yayin-hazirla.sh
  Build output directory   : _site
```

Kaydedin, sonra **Deployments → Retry deployment**.

### Copilot — doğrulama (sır gerektirmez)

```bash
bash tools/yayin-dogrula.sh
```

19 iç yolu tek tek ölçer; sızan varsa `❌ SIZIYOR` yazar ve `exit 1` verir.
Ayrıca ana sayfada `noscript`, `Person`, `vendor/` duruyor mu ve `unpkg` belirdi mi
kontrol eder — kapatma işlemi siteyi bozmamalı.

**Referans (ayar öncesi ölçüm):** 13/13 belge `200` ile açıktı;
`/COPILOT-YAYIN.md` 17.393 bayt, `/PORTAL-KURULUM.md` 8.016 bayt.
Ayar sonrası **sızan 0** olmalı.

### Alternatif — API ile (jeton gerektirir)

Dashboard yerine API tercih edilirse:

```bash
curl -X PATCH \
 "https://api.cloudflare.com/client/v4/accounts/$HESAP_ID/pages/projects/$PROJE" \
 -H "Authorization: Bearer $CF_API_TOKEN" -H "Content-Type: application/json" \
 -d '{"build_config":{"build_command":"bash tools/yayin-hazirla.sh","destination_dir":"_site"}}'
```

`CF_API_TOKEN` bir sırdır; Copilot bunu **üretmez ve görmez**. İki alanı elle doldurmak
daha hızlı ve daha az riskli.

---

## AYAR 2 — Verify token rotasyonu

Tam gerekçe ve sıra: **`JETON-DONDURME-TALIMATI.md`**. Özet:

1. Jetonu **kendi bilgisayarınızda** üretin: `openssl rand -hex 32`
2. **Render** → `uyhukuk-webhook` → Environment → `VERIFY_TOKEN` → Save
3. **Worker** → `muddy-hat-f441` → Variables and Secrets → `VERIFY_TOKEN` → Deploy
4. Test edin (aşağıda)
5. **En son Meta.** Meta'da kaydetmek yeniden doğrulama tetikler; uçlar hazır değilse
   abonelik düşebilir ve mesaj yakalama sessizce durur.

### Copilot — doğrulama

**Jetonsuz kip** (herkes çalıştırabilir) — yanlış jeton reddediliyor mu:

```bash
bash tools/jeton-dogrula.sh
```

**Jetonlu kip** (yalnız avukat, rotasyondan sonra) — doğru jeton kabul ediliyor mu:

```bash
bash tools/jeton-dogrula.sh "YENI_JETON"
```

Jeton ekrana **yazılmaz**; yalnız sonuç gösterilir. İki uç da `200` dönmeli **ve**
meydan okuma dizgesini aynen yansıtmalı. Biri ❌ ise **Meta'ya geçmeyin.**

> ⚠️ İkisi **ayrı** doğrulayıcı: Render `dogrulama basarisiz`, Worker
> `Doğrulama başarısız` (Türkçe karakterli) döndürüyor. Farklı kod, ayrı değişken.
> Yalnız birini değiştirmek yetmez.

---

## AYAR 3 — Ortam değişkenleri + **önce bir tasarım kararı**

### ⚠️ Copilot BUNU önce okumalı

`portal-kv-seed.json` ve `portal-kv-bulk.json` incelendi (472 kayıt).
Anahtarlar: `ad · kod_ozeti · tc_son4 · tel_son4 · tur`.

**Kodların açık hâli hiçbir veri dosyasında yok — yalnız SHA-256 özeti var.**
Bu bilinçli bir tasarım: portal kodu düz metin olarak hiçbir yerde durmasın.

Ama `/api/kod-talebi`'nin bugünkü hâli kodu **göndermek** için düz metin istiyor
(`KODLAR` içindeki `kod` alanı). Yani `KODLAR`'ı doldurmak, karma ile kaçınılan şeyi
geri getirir: 472 kod tekrar düz metin olarak bir yerde durur.

### İki seçenek

**A · Hızlı** — 472 kodu `MUVEKKIL-KOD-DAGITIM.html`'den çıkarıp `KODLAR`'a koymak.
Dağıtılmış fişlerle uyumlu kalır. Ama düz metin kodlar bir ortam değişkeninde birikir.

**B · Doğru (önerilen)** — *kod hatırlatma* yerine **kod yenileme**.
Müvekkil talep ettiğinde uç:
1. **yeni** bir kod üretir,
2. SHA-256 özetini KV'ye yazar (`portal:<özet>`),
3. yeni kodu WhatsApp'tan gönderir,
4. eski kodu geçersiz kılar.

Düz metin **hiçbir yerde durmaz**; `KODLAR` değişkenine de gerek kalmaz —
yalnız `WA_TOKEN` ve `WA_PHONE_ID` yeter. Eşleştirme için `KODLAR` yerine
zaten var olan `portal-kv-seed.json` alanları kullanılır (`ad` + `tel_son4`).

Yan etki: o müvekkilin elindeki eski fiş geçersiz olur. **Sorun değil** — zaten
kodunu bilmediği için talep ediyor.

**Kararı Av. Umut Yücel verir.** B seçilirse `functions/api/kod-talebi.js` içindeki
liste eşleştirmesi yerine üretim+karma+gönderim akışı gelir (~30 satır) ve
`KODLAR` sırrı hiç oluşturulmaz.

### Kullanıcı — girilecekler (B seçilirse ikisi yeter)

```
Cloudflare → proje → Settings → Environment variables
  WA_PHONE_ID   109650188830111                Plain (gizli değil)
  WA_TOKEN      <WhatsApp Cloud API jetonu>    Secret
  KODLAR        <yalnız A seçilirse>           Secret
```

İsteğe bağlı: `KOD_KV` binding → IP başına dakikada 3 istek sınırı **ve** talebin
kalıcı kaydı devreye girer. Şu an bir talep geldiğinde **hiçbir yerde kalıcı iz
kalmıyor** — yalnız o tarayıcının `localStorage`'ında 20 kayıt.

### Copilot — doğrulama (sır gerektirmez)

```bash
curl -s https://avumutyucelhukuk.com/api/kod-talebi
# beklenen: {"ok":true,"service":"kod-talebi"}
```

Değişkenler girildikten sonra eşleşen bir müvekkil için `durum` alanı
`"kuyruk"` yerine `"gonderildi"` döner. Dönmüyorsa değişken adı yanlış yazılmıştır.

---

## Sıra

1. **Ayar 1** — sızıntı açıkken diğerlerini konuşmak anlamsız.
2. **Ayar 2** — sızmış sır ortadan kalkar.
3. **§3 tasarım kararı** (A mı B mi) → sonra Ayar 3.
4. Sonra Worker yamaları: `COPILOT-KOD-YAMALARI.md` 1–3, tek dağıtımda.

Her adımdan sonra ilgili doğrulama script'i çalıştırılır. **Ölçülmeden "oldu" denmez** —
bu oturumda `_redirects` tam olarak bu yüzden yanlış varsayıldı ve ölçümle yakalandı.
