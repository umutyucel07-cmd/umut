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
| **main ruleset (dal koruması)** | ✅ **KURULDU** | 13.08.2026 · depo public yapıldı |
| Ajan yalnız PR ile yazar | ✅ **Zorlayıcı** | Doğrudan push GitHub tarafından reddediliyor |

---

## ✅ main dal koruması — kuruldu

**13.08.2026:** Depo public yapıldı, ruleset `main-koruma` (id 20775557)
kuruldu ve **canlı test edildi.**

Yürürlükteki kurallar:

| Kural | Durum |
|---|---|
| Restrict deletions | ✅ |
| Block force pushes | ✅ |
| Require a pull request — **1 onay** | ✅ |
| Dismiss stale approvals on push | ✅ |
| Require review from Code Owners | ✅ |
| Require status check — `Butunluk ve imza denetimi` | ✅ |
| Require conversation resolution | ✅ |
| **Bypass list** | ✅ **boş** (`current_user_can_bypass: never`) |

Test: `main`e doğrudan push denendi, GitHub reddetti —

```
- Changes must be made through a pull request.
- Required status check "Butunluk ve imza denetimi" is expected.
```

> Bypass listesi boş olduğu için **avukat da dahil hiç kimse** `main`e
> doğrudan yazamaz. Bu kasıtlı: yayına çıkan her satır PR'den geçer.

---

## ⚠️ Depo public — bunun anlamı

Ruleset'i açmak için depo public yapıldı. Bu, **tüm geçmişin de dünyaya
açık olduğu** anlamına gelir; silinen dosyalar dahil.

13.08.2026 tarihinde tam geçmiş taraması yapıldı (20 commit):

| Tarama | Sonuç |
|---|---|
| Gerçek API anahtarı deseni | ✅ yok (`EAA...` eşleşmeleri base64 görüntü verisiydi) |
| `functions/` sabit kodlanmış sır | ✅ yok |
| Müvekkil kimlik verisi | ✅ yok (`KODLAR` örnekleri uydurma, portföyde yoklar) |
| **`.env.example` dolu değer** | ❌ **bulundu — aşağıya bakınız** |


---

## ❌ Bulunan sızıntı: webhook doğrulama token'ı

`.env.example` dosyası bir **örnek** dosya olmasına rağmen iki alanda gerçek
değer taşıyordu:

```
WA_VERIFY_TOKEN=avumutyucel-2026-webhook
VERIFY_TOKEN=avumutyucel-2026-webhook
```

Depo public yapıldığı anda bu değer dünyaya açıldı. Dosya temizlendi, ancak:

> **Dosyayı temizlemek yeterli DEĞİLDİR.** Değer git geçmişinde duruyor ve
> public depoda geçmiş de okunabilir. Ayrıca GitHub'ın önbelleği ve olası
> fork/klonlar temizlenemez.

### Yapılması gereken — token yenilenmeli

Bu token, Meta'nın webhook uç noktasını doğrularken kullandığı paylaşılan
sırdır. Bilen biri doğrudan mesaj okuyamaz veya gönderemez; asıl risk,
webhook doğrulama el sıkışmasının taklit edilebilmesidir.

**Adımlar (yalnız avukat yapabilir):**

1. Yeni bir doğrulama token'ı üretin (tahmin edilemez olsun — tarih veya
   isim içermesin).
2. Meta for Developers → uygulamanız → WhatsApp → Configuration →
   Webhook → **Verify token** alanını yenisiyle güncelleyin.
3. Cloudflare Pages → proje → Settings → Environment variables →
   `WA_VERIFY_TOKEN` ve `VERIFY_TOKEN` değerlerini yenisiyle güncelleyin.
4. Webhook'u yeniden doğrulatın ve test mesajıyla çalıştığını teyit edin.

Bu adımlar tamamlanana kadar eski token geçerlidir.

### Neden geçmiş temizlenmedi

Geçmişi yeniden yazmak (`filter-repo`, `BFG`) tüm commit karmalarını
değiştirir, klonları bozar ve zaten yayılmış olan değeri geri getirmez.
Bu ölçekteki bir sır için doğru çözüm **yenilemektir**, geçmişi silmek
değil.

### Kalıcı önlem

`.env.example` dosyasının başına uyarı eklendi: bu depo public'tir, örnek
dosyaya hiçbir gerçek değer yazılmaz. Gerçek değerler yalnız Cloudflare
Pages panosunda tanımlanır.

`KODLAR` satırındaki isimler (Elif Şahin, Murat Kaya) müvekkil portföyüne
karşı kontrol edildi — **uydurma örneklerdir**, gerçek müvekkil değildir.

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
| 13.08.2026 | Depo public yapıldı; ruleset `main-koruma` kuruldu ve test edildi |
| 13.08.2026 | Public geçmiş taraması: `.env.example` içinde webhook token'ı bulundu, temizlendi — **yenilenmesi gerekiyor** |
| 13.08.2026 | `.fuse_hidden*` artıkları temizlendi, `.gitignore`'a eklendi |

Yetki verildiğinde ve geri alındığında ortak hafızadaki "Haftalık nabız"
bölümüne tek satır tarihli not düşülür.
