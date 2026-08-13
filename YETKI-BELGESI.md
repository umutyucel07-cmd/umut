# Yetki Belgesi — Depo Koruma Düzeni

**Depo:** `umutyucel07-cmd/umut` · **Yetkiyi veren:** Av. Umut Yücel
**Kurulum:** 13.08.2026 · **Kapsam:** yalnız bu depo

---

## Amaç

Yapay zekâ ajanları (Claude, Copilot) bu depoda dosya yazabilsin ve dal açıp
PR gönderebilsin; ancak `main` dalına **tek başına** hiçbir değişiklik
geçiremesin. Yayına çıkan her satır avukat onayından geçer.

---

## Kurulum durumu — dürüst tablo

| Madde | Durum | Not |
|---|---|---|
| Secrets boş | ✅ **Tamam** | Depoda 0 secret var, doğrulandı |
| `.github/CODEOWNERS` | ✅ **Eklendi** | Tüm dosyalar için inceleyici avukat |
| `.github/workflows/imza-dogrulama.yml` | ✅ **Eklendi** | Her PR'de çalışır |
| Yerel yayın kapısı | ✅ **Zaten vardı** | `pre-commit` + `pre-push` hook |
| **main ruleset (dal koruması)** | ❌ **KURULAMADI** | Aşağıya bakınız |
| Ajan yalnız PR ile yazar | ⚠️ **Usulî** | Ruleset olmadığı için zorlayıcı değil |

---

## ❌ Kurulamayan: main dal koruması

**Sebep:** Bu depo **private** ve hesap **ücretsiz plandadır**. GitHub,
private depolarda dal koruma kurallarını (ruleset / branch protection)
yalnız **Pro** ve üzeri planlarda açar.

API yanıtı:

```
403 — Upgrade to GitHub Pro or make this repository public
      to enable this feature.
```

**Bu ne demek:** "Require a pull request", "Required approvals: 1",
"Require review from Code Owners", "Block force pushes", "Require status
checks" kurallarının **hiçbiri** şu anda yürürlüğe konamaz. `main` dalı
teknik olarak korumasızdır — yetkisi olan biri doğrudan push edebilir.

### Üç seçenek

1. **GitHub Pro'ya yükseltmek** (aylık ücretli) — belgedeki düzen aynen kurulur.
2. **Depoyu public yapmak** — ruleset ücretsiz açılır. **Önerilmez:**
   depoda müvekkil portalı uç noktaları ve büro yapılandırması var.
3. **Usulî disiplinle devam etmek** (şu anki durum) — koruma GitHub
   tarafından zorlanmaz, kurala uyulmasıyla sağlanır. Yerel `pre-push`
   kapısı ve CI denetimi yine çalışır.

> Seçim yapılana kadar `main` korumasızdır. Bu belge onu gizlemez.

---

## Yürürlükteki koruma katmanları

Ruleset olmasa da üç katman çalışıyor:

**1. Yerel yayın kapısı** (`.git/hooks/pre-commit`, `pre-push`)
Her commit ve push öncesi çalışır: `index.html` bütünlüğü (Person JSON-LD,
noscript, dış origin, defer'li script), künye eşitliği (5 dosya arasında).
Bulgu varsa commit/push durur.

**2. CI denetimi** (`.github/workflows/imza-dogrulama.yml`)
Her PR'de sunucuda çalışır. Yerel kapı `--no-verify` ile atlanmış olsa bile
burada yakalanır.

**3. CODEOWNERS** (`.github/CODEOWNERS`)
Her dosyanın inceleyicisi avukattır. Ruleset açıldığı gün otomatik
zorlayıcı olur; şimdilik yalnız inceleyici ataması yapar.

---

## Ajanın yetki sınırı

**Yapabilir:** dal açmak, dosya eklemek/değiştirmek, PR açmak, PR'de yorum
yazmak, kendi PR'ında yeni commit atmak.

**Yapamaz:** `main`e doğrudan push, PR birleştirmek, dal veya depo silmek,
ruleset/ayar değiştirmek, secret okumak, yayın (deploy) tetiklemek, üçüncü
taraf servise bağlanmak, yeni depo ya da webhook oluşturmak.

> Ruleset kurulamadığı için bu sınır şu anda **teknik olarak değil, kurala
> uyularak** korunuyor. Ajan `main`e push edebilir durumda — etmiyor.

---

## Sır ve anahtar

- Ajana **hiçbir** secret tanımlanmaz: Cloudflare API token'ı, Meta/WhatsApp
  anahtarı, posta hesabı parolası, 2FA kodu. Bunlar yalnız avukatın kendi
  oturumundadır.
- Depo secrets listesi **boş** (13.08.2026 doğrulandı).
- Ajan bir anahtara ihtiyaç duyduğunu söylerse görev **durur** ve avukata
  bildirilir; yer tutucu adı yazılır, değer yazılmaz.

---

## Yetkiyi geri alma

Bir ajanın yetkisini kaldırmak için:

- **Copilot:** Settings → Copilot → Coding agent → kapat.
- **Claude:** GitHub token'ının `repo` yetkisi kaldırılır ya da
  `gh auth logout` çalıştırılır.

Şüpheli bir durumda önce ajanı durdurun, sonra `main` üzerindeki son
commit'leri inceleyin:

```bash
cd ~/Documents/GitHub/umut
git fetch origin
git log --oneline -20 origin/main
git diff HEAD~5..HEAD
```

---

## Kurulum kaydı

| Tarih | İşlem |
|---|---|
| 13.08.2026 | CODEOWNERS, imza-dogrulama.yml, bu belge eklendi (PR ile) |
| 13.08.2026 | Secrets listesi doğrulandı — boş |
| 13.08.2026 | Ruleset denendi — plan yetersizliği nedeniyle kurulamadı |
| 13.08.2026 | `.fuse_hidden*` artıkları temizlendi, `.gitignore`'a eklendi |

Yetki verildiğinde ve geri alındığında ortak hafızadaki "Haftalık nabız"
bölümüne tek satır tarihli not düşülür.
