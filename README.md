# ShopSphere

React, TypeScript, Node.js, Express ve PostgreSQL ile geliştirilen e-ticaret öğrenme projesi. Ürünler Neon PostgreSQL'den gelir; üyelik, kullanıcıya özel sepet ve favoriler backend API'leri üzerinden çalışır.

## Özellikler

- Ürün listeleme, kategori ve detay sayfaları
- E-posta/şifre ile kayıt ve giriş
- Access token ve httpOnly refresh cookie ile oturum yönetimi
- Kullanıcıya özel sepet ve favoriler
- Hesap sayfasında profil düzenleme ve adres yönetimi
- Sipariş geçmişi için veritabanı temeli ve listeleme ekranı
- Süreli, işlem bağlantısı içeren toast bildirimleri
- Admin login, rol bazlı API koruması ve dashboard
- Admin ürün CRUD: ekleme, listeleme, düzenleme ve silme
- Admin panelinde kullanıcı ve sipariş listeleri
- `/cupboard` adresinde dijital dolap sayfası taslağı

## Teknolojiler

| Katman | Teknolojiler |
| --- | --- |
| Frontend | React, TypeScript, Vite, Tailwind CSS |
| Form ve doğrulama | React Hook Form, Zod |
| İstemci durumu | Redux Toolkit |
| Backend | Node.js, Express |
| Veritabanı | PostgreSQL (Neon) |
| Oturum | JWT access token, httpOnly refresh cookie |

## Proje yapısı

```text
shopsphere/
├── backend/
│   ├── config/              # PostgreSQL bağlantısı
│   ├── controllers/         # API işlemleri
│   ├── database/schema.sql  # Başlangıç şeması ve ek tablolar
│   ├── middlewares/         # Kullanıcı ve admin yetki kontrolü
│   ├── routes/              # API rotaları
│   ├── schemas/             # Backend Zod şemaları
│   └── scripts/seed.js       # Ürün verisi aktarımı
└── frontend/
    └── src/
        ├── components/      # Ortak ve admin bileşenleri
        ├── pages/            # Mağaza, hesap ve admin ekranları
        ├── redux/            # Redux Toolkit store ve slice'lar
        ├── schemas/          # Frontend Zod şemaları
        └── services/         # Backend API istekleri
```

## Gereksinimler

- Node.js 20 veya üzeri
- Neon PostgreSQL projesi

## Kurulum

### 1. Veritabanını hazırla

Neon Console'da kullanacağın branch'i seç, SQL Editor'ü aç ve [`backend/database/schema.sql`](backend/database/schema.sql) dosyasının tamamını çalıştır. Bu dosya ürün/kullanıcı temel tablolarını, oturum tablolarını, adres ve sipariş tablolarını, ayrıca admin rolü ve ürün yönetimi için gerekli değişiklikleri içerir.

Tabloları oluşturmak ürünleri otomatik eklemez. Seed komutu DummyJSON'dan ürünleri okuyup Neon'a yazar.

### 2. Backend ortam değişkenleri

`backend/.env.example` dosyasını `backend/.env` olarak kopyalayıp Neon bağlantı bilgilerini ve uzun, gizli bir JWT anahtarını doldur:

```env
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DATABASE?sslmode=require
JWT_ACCESS_SECRET=uzun-ve-tahmin-edilemez-bir-gizli-deger
PORT=5555
FRONTEND_URL=http://localhost:5173
```

PowerShell'de proje kökünden:

```powershell
Copy-Item backend/.env.example backend/.env
```

`.env` dosyalarını GitHub'a gönderme; bunlar `.gitignore` ile dışarıda bırakılır.

### 3. Frontend ortam değişkeni

`frontend/.env.example` dosyasını `frontend/.env` olarak kopyala ve API adresini ayarla:

```env
VITE_BASE_URL=http://localhost:5555/api
```

PowerShell:

```powershell
Copy-Item frontend/.env.example frontend/.env
```

### 4. Paketleri yükle

İki klasörde de ayrı ayrı `npm install` çalıştır:

```powershell
cd backend
npm install
cd ../frontend
npm install
```

### 5. Ürünleri ekle ve uygulamayı başlat

Ürün seed komutu internetten DummyJSON ürünlerini alıp veritabanına ekler:

```powershell
cd backend
npm run seed
```

İki terminal aç. İlkinde backend:

```powershell
cd backend
npm run dev
```

İkincisinde frontend:

```powershell
cd frontend
npm run dev
```

Vite adresi genellikle `http://localhost:5173` olur.

## Admin panelini hazırlama

1. Mağazadan normal kullanıcı hesabı oluştur.
2. Neon SQL Editor'de uygulamanın bağlı olduğu **aynı branch**'i seç.
3. Aşağıdaki sorguda e-postayı kendi hesabınla değiştirip çalıştır:

   ```sql
   UPDATE users
   SET role = 'admin'
   WHERE email = 'senin@emailadresin.com';
   ```

4. Yetkiyi kontrol et:

   ```sql
   SELECT email, role
   FROM users
   WHERE email = 'senin@emailadresin.com';
   ```

   Sonuçta `role` değeri `admin` olmalı.

5. `http://localhost:5173/admin/login` sayfasından aynı hesapla giriş yap.

Admin endpoint'leri her istekte kullanıcının `role` alanını veritabanından kontrol eder. Frontend'de admin sayfasına ulaşmak tek başına yetki vermez.

## Önemli API rotaları

| İşlem | Metot ve yol |
| --- | --- |
| Ürünleri getir | `GET /api/products` |
| Ürün detayını getir | `GET /api/products/:id` |
| Kayıt / giriş | `POST /api/register`, `POST /api/auth/login` |
| Oturumu yenile / kapat | `POST /api/auth/refresh`, `POST /api/auth/logout` |
| Kullanıcı sepeti | `/api/cart` |
| Kullanıcı favorileri | `/api/favorites` |
| Hesap profili ve adresleri | `/api/account/profile`, `/api/account/addresses` |
| Kullanıcı siparişleri | `GET /api/account/orders` |
| Admin girişi | `POST /api/admin/login` |
| Admin dashboard ve ürün CRUD | `/api/admin/dashboard`, `/api/admin/products` |

Kullanıcıya özel ve admin rotaları `Authorization: Bearer <accessToken>` başlığı ister. Admin rotaları ayrıca veritabanındaki admin rolünü doğrular.

## Şu anki kapsam

Sipariş tabloları ve sipariş geçmişi ekranı hazır; ödeme ve sipariş oluşturma akışı henüz eklenmedi. Cupboard sayfası şu an arayüz taslağıdır, dolaba ürün kaydetme işlevi henüz yoktur. Admin kullanıcı ve sipariş ekranları listeleme amaçlıdır; ürünler için tam CRUD işlemleri bulunur.
