# Verify Token Döndürme — Uygulama Talimatı

**13.08.2026** · Av. Umut Yücel · sicil no 6448

> ⚠️ **Bu işlemi Claude yapamaz.** İki ayrı sebep var, ikisi de aşağıda açık yazılı.
> Belge, işlemi sizin elinizde **en aza indirilmiş** hâle getirmek için hazırlandı.

---

## 0. Neden ben yapamıyorum — dürüst iki sebep

**1. Yetki sınırı.** Jeton, parola ve API anahtarını bir alana **girmem**; bu, tüm oturum
boyunca tuttuğum tek mutlak sınır ve siz de her seferinde bunu kabul ettiniz. "Tam
yetkilisin" demeniz bunu değiştirmiyor — sınırın sebebi yetki eksikliği değil, sırrın
sizden başkasının eline geçmemesi.

**2. Teknik imkân yok — bu, sınırdan bağımsız olarak da geçerli.**

| Yer | Elimdeki araç | Yazabilir miyim |
|---|---|---|
| Cloudflare Worker değişkenleri | `workers_get_worker`, `get_worker_code`, `workers_list` | **hayır — hepsi salt okunur** |
| Render ortam değişkenleri | bağlantı yok | hayır |
| Meta Developer konsolu | bağlantı yok, tarayıcı da kapalı | hayır |

**Jetonu üretmemi de istemeyin.** Ürettiğimi size yazarsam sır sohbet kaydına düşer —
yani sızıntıyı kapatmak için yeni bir kopya oluşturmuş oluruz. Kendiniz üretin (§1).

---

## 1. Yeni jetonu ÜRETİN — kendi bilgisayarınızda

Terminalde şu satırlardan **biri** yeter. Çıktı yalnız sizin ekranınızda kalır:

```bash
openssl rand -hex 32
```

```bash
python3 -c "import secrets; print(secrets.token_urlsafe(32))"
```

Kural: en az 32 karakter, rastgele. Sicil, doğum tarihi, telefon, büro adı **kullanmayın** —
sızan jetonun sorunu tam olarak buydu.

**Bu jetonu bana yazmayın.** Bilmem gerekmiyor; testleri jetonu görmeden yapabiliyorum.

---

## 2. ⚠️ Önce bunu okuyun — jeton İKİ AYRI YERDE

13.08'de ölçtüm. Her iki uç da yanlış jetonla el sıkışmasını reddediyor, **ama farklı
kodla** — yani iki bağımsız doğrulayıcı var:

| Uç | Yanlış jetona yanıt | Ne diyor |
|---|---|---|
| Worker `muddy-hat-f441` | `403` | `Doğrulama başarısız` (Türkçe karakterli) |
| Render `uyhukuk-webhook` | `403` | `dogrulama basarisiz` (karaktersiz) |

İki ayrı uygulama, iki ayrı değişken. **Yalnız birini değiştirirseniz diğeri eski jetonda
kalır.** Meta'daki WhatsApp geri çağırma adresi **Render**'a bakıyor; Instagram doğrudan
Worker'a. Yani ikisi de güncellenmeli.

Render ayakta ve çalışıyor: düz `GET /` → `200 · "Umut Yucel Hukuk - otomatik yanit
sunucusu calisiyor"`.

### Rahatlatıcı gerçek: canlı mesaj akışı kesilmez

Verify token **yalnız abonelik el sıkışmasında** kullanılır. Gelen mesajların
doğrulanması ayrı bir sırla yapılır — `META_APP_SECRET` üzerinden HMAC
(`x-hub-signature-256`). **O sır sızmadı.** Dolayısıyla jetonu değiştirmek mevcut mesaj
akışını durdurmaz.

### Tek gerçek tuzak — SIRA

Meta arayüzünde geri çağırma alanını kaydetmek **yeniden doğrulama el sıkışması
tetikler.** Yeni jetonu önce Meta'ya yazıp kaydederseniz, uçlar henüz yeni jetonu
bilmediği için doğrulama **başarısız olur ve abonelik düşebilir** — mesaj yakalama
sessizce durur.

**Bu yüzden sıra şudur: önce uçlar, en son Meta.**

---

## 3. Uygulama — bu sırayla

### Adım 1 · Render (`uyhukuk-webhook`)
Render Dashboard → servis → **Environment** → `VERIFY_TOKEN` (ya da `WA_VERIFY_TOKEN`)
→ yeni değeri yapıştırın → **Save** → servis yeniden başlar (~30 sn).

### Adım 2 · Cloudflare Worker (`muddy-hat-f441`)
Cloudflare → Workers & Pages → `muddy-hat-f441` → **Settings → Variables and Secrets**
→ `VERIFY_TOKEN` → yeni değer → **Deploy**.

### Adım 3 · Kendi testinizi yapın (jetonu bana göstermeden)
Aşağıdaki komutta `YENI_JETON` yerine kendi değerinizi koyun:

```bash
curl -s -o /dev/null -w "%{http_code}\n" \
 "https://uyhukuk-webhook.onrender.com/webhook?hub.mode=subscribe&hub.verify_token=YENI_JETON&hub.challenge=TEST123"

curl -s -o /dev/null -w "%{http_code}\n" \
 "https://muddy-hat-f441.umutyucel07.workers.dev/?hub.mode=subscribe&hub.verify_token=YENI_JETON&hub.challenge=TEST123"
```

**İkisi de `200` dönmeli.** `403` dönen varsa o uçta değer yanlış yapıştırılmıştır —
Meta'ya geçmeyin, önce onu düzeltin.

### Adım 4 · Meta (EN SON)
Meta for Developers → App `1100673212493214` → **WhatsApp → Configuration** →
Webhook → **Edit** → Verify token alanına yeni değer → **Verify and Save**.
Yeşil onay gelmeli. `messages` alanının **Subscribed** kaldığını teyit edin.

Instagram için: **Instagram → Webhooks** bölümünde aynı jeton güncellenir.

### Adım 5 · Bana haber verin
"jeton döndürüldü" yazmanız yeter. Yapacaklarım (hiçbiri jetonu görmeyi gerektirmez):
- Her iki uçta **yanlış** jetonun hâlâ `403` aldığını doğrularım
- `/sync` üzerinden gönderim sayacını, kapatma anahtarını ve kuyruğu okurum
- Kendi telefonunuzdan test mesajı atarsanız yakalamanın çalıştığını görürüm

---

## 4. Geri alma

Bir şey ters giderse: **eski jeton hâlâ `07d6aea` commit'inde duruyor** —
`git show 07d6aea:.env.example`. Yani geri dönüş her zaman mümkün. Bu, aynı zamanda
işlemin neden gerekli olduğunun da kanıtı: depoya erişimi olan herkes o değeri okuyabiliyor.

Rotasyon bittikten sonra o commit'teki değer **artık hiçbir kapıyı açmaz** — geçmişte
durması zararsız hâle gelir. Geçmişi yeniden yazmaya (`filter-repo`/BFG) gerek kalmaz;
zaten önermiyorum: tüm commit karmaları değişir, iki worktree dalı ve açık PR'lar bozulur.

---

## 5. Kontrol listesi

- [ ] Yeni jeton üretildi (32+ karakter, rastgele, tahmin edilebilir veri içermiyor)
- [ ] Jeton sohbete **yazılmadı**
- [ ] Render `VERIFY_TOKEN` güncellendi, servis yeniden başladı
- [ ] Worker `VERIFY_TOKEN` güncellendi, dağıtıldı
- [ ] İki `curl` testi de `200` döndü
- [ ] Meta WhatsApp Configuration güncellendi, yeşil onay geldi
- [ ] `messages` alanı **Subscribed** duruyor
- [ ] Instagram webhook jetonu güncellendi
- [ ] Claude'a "jeton döndürüldü" denildi, dış doğrulama yapıldı
