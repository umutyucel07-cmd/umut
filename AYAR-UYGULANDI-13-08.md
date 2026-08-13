# Cloudflare derleme ayarı — UYGULANDI ve ölçüldü

**13.08.2026 · 06:20–07:25 UTC · Av. Umut Yücel**
Bu belge, üç bekleyen ayardan **birincisinin kapandığını** ve nasıl doğrulandığını kayda geçirir.
Kalan ikisi (jeton rotasyonu · `WA_TOKEN`) yalnız Av. Umut Yücel tarafından yapılabilir — gerekçe aşağıda.

---

## 1 · Ne yapıldı

| Adım | Değer | Durum |
|---|---|---|
| Build command | `bash tools/yayin-hazirla.sh` | ✅ yerinde |
| Build output directory | `_site` | ✅ yerinde |
| Production dağıtımı yenilendi | `main b4afd22` → `8455aba8` | ✅ başarılı (16 sn) |
| Kenar önbelleği temizlendi | Caching → Purge Everything | ✅ |
| `WA_PHONE_ID` ortam değişkeni | `109650188830111` (Plain text) | ✅ eklendi |

### Kritik ayrım: ayarı yazmak yetmiyor

Ayar **zaten yazılmıştı** ama sızıntı devam ediyordu. Sebep:

> **Cloudflare Pages'te derleme ayarı yalnız YENİ dağıtımlara uygulanır.**
> Ayarı kaydettikten sonra mevcut Production dağıtımı eski kurallarla üretilmiş
> haliyle yayında kalır. Ayar + **Retry deployment** birlikte olmadan hiçbir şey değişmez.

Ondan sonra bile canlı alan adı bir süre eski gövdeyi döndürdü; `Purge Everything` gerekti.

Sıra: **Ayar → Retry deployment → Purge Everything → ölç.**

---

## 2 · Önce önizlemede denendi

Production'a dokunmadan önce `cf-01-asistan` önizleme dağıtımı yeni ayarla yeniden derlendi
(`4aff4140.avumutyucelhukuk.pages.dev`). Derleme günlüğü:

```
Executing user command: bash tools/yayin-hazirla.sh
✓ bağımlılık denetimi: 28 yolun tamamı yayın dizininde
✅ yayın dizini hazır: _site   ·   dosya sayısı: 46   ·   boyut: 1.2M
Found Functions directory at /functions. Uploading.
✨ Compiled Worker successfully
Success: Your site was deployed!
```

Önizlemede 33/33 kapalı, varlıklar sağlam, `/api/kod-talebi` JSON döndü.
**Ancak o zaman Production'a geçildi.** Canlı sitede körlemesine ayar değiştirilmedi.

`Found Functions directory at /functions` satırı bir varsayımı da kanıtladı:
Pages, `functions/` klasörünü **depo kökünde** arıyor, yayın dizininin içinde değil.
Yani yayın dizinini değiştirmek `/api/kod-talebi` ucunu bozmuyor.

---

## 3 · Ölçüm sonucu (canlı site)

```
$ bash tools/yayin-dogrula.sh
kapalı: 33/33   sızan: 0
✅ /api/kod-talebi Function olarak çalışıyor
✅ Sızıntı yok, site sağlam.
```

Kapanan belgeler arasında: `COPILOT-YAYIN.md`, `COPILOT-GOREV-PAKETI-13-08.md`,
`PORTAL-KURULUM.md`, `CLAUDE.md`, `JETON-DONDURME-TALIMATI.md`, `tools/` altındaki
yedi script, `.env.example`, `.gitignore`, `.github/` altındaki üç dosya ve
`functions/` kaynak kodu.

Site sağlığı: `styles.css`, `manifest.webmanifest`, `sw.js`, dört PWA ikonu,
`js/oturum.js`, `js/buro.js`, `robots.txt`, `sitemap.xml` — hepsi gerçek içerikle
sunuluyor. Ana sayfa 4075 bayt, `<noscript>` · JSON-LD `"Person"` · `vendor/` yerinde,
`unpkg` yok.

---

## 4 · Ölçüm sırasında bulunan iki tuzak — denetim scriptine işlendi

Bu ikisi yüzünden **"ayar çalışmadı" diye yanlış rapor yazılmasına ramak kaldı.**
`tools/yayin-dogrula.sh` v2 ikisini de kalıcı olarak kapatıyor.

### Tuzak 1 · Durum kodu yalan söylüyor

`_redirects` içindeki `/* /index.html 200` kuralı yüzünden **olmayan her yol 200 döner.**
"404 bekle" diye kurulmuş her denetim bu sitede yanlış sonuç verir.

**Doğru ölçüt `content-type`:**

| Dönen | Anlamı |
|---|---|
| `text/html` (4075 B) | dosya YOK — tek sayfa yedeği döndü → **kapalı** |
| `application/x-sh` · `text/markdown` · `application/octet-stream` | dosya VAR → **sızıyor** |

### Tuzak 2 · Önbellek yalan söylüyor

Dağıtım yenilendikten sonra bile eski gövde dönmeye devam etti; `age` başlığı
artarken `cf-cache-status: DYNAMIC` görüldü ve `Purge Everything` bile bazı yolları
temizlemedi. Aradaki vekil sunucu da önbellekleyebiliyor.

**Çözüm:** her isteğe tekil bir sorgu dizesi (`?cb=<tekil>`). Sorgu dizesi varlık
eşleşmesini değiştirmez ama önbelleği atlar. Aynı yol, aynı anda, sorgu dizesiyle
`text/html`, sorgu dizesiz `application/x-sh` döndü — fark ölçümle görüldü.

---

## 5 · Sırada ne var — ve neden bende değil

| # | İş | Kim | Neden |
|---|---|---|---|
| 1 | Derleme ayarı | ✅ **yapıldı** | Sır değil, panel ayarı |
| 2 | `WA_PHONE_ID` | ✅ **yapıldı** | Gizli değil, açıkça belgelenmiş kimlik |
| 3 | Verify token rotasyonu | **Yalnız Av. Umut Yücel** | Kimlik bilgisi — üretilmesi ve üç panele girilmesi devredilemez |
| 4 | `WA_TOKEN` | **Yalnız Av. Umut Yücel** | Kalıcı erişim jetonu |
| 5 | `KODLAR` | **Gerekmeyebilir** | 472 müvekkilin kişisel verisi. Kod yenileme tasarımı seçilirse bu değişken hiç oluşturulmaz — bkz. `COPILOT-UC-AYAR.md` §3 |

### 3 numara için sıra tuzağı (tekrar)

Render ve Worker **ayrı** verify token doğrulaması yapıyor. Yalnız biri değiştirilirse
diğeri eski jetonda kalır. Meta arayüzünde kaydetmek yeniden doğrulama tetikler;
uçlar yeni jetonu bilmiyorsa abonelik düşer ve mesaj yakalama **sessizce** durur.

**Sıra: önce Render → sonra Worker → en son Meta.** Ayrıntı `JETON-DONDURME-TALIMATI.md`.

Rahatlatıcı: verify token yalnız el sıkışmasında kullanılır. Gelen mesaj doğrulaması
`META_APP_SECRET` HMAC ile yapılır ve o sır hiçbir yerde sızmadı.

---

## 6 · Bir daha bozulursa

```bash
bash tools/yayin-dogrula.sh          # 33/33 bekleniyor, exit 0
```

`exit 1` dönerse sırayla:

1. Pages → Settings → Build → komut ve çıktı dizini yerinde mi
2. Deployments → son Production → Manage deployment → **Retry deployment**
3. Caching → Configuration → **Purge Everything**
4. Ölçümü tekrarla

Ayarı değiştirip dağıtımı yenilemeden ölçmek **her zaman** eski sonucu verir.
