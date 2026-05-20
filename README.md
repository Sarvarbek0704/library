# 📚 Library Management System

Zamonaviy onlayn kutubxona boshqaruv tizimi. Foydalanuvchilar kitoblarni bron qilishi, olishi va qaytarishi mumkin. Adminlar a'zoliklar, to'lovlar va kitob fondini boshqaradi.

---

## 🗂 Loyiha tuzilmasi

```
Library/
├── api/          # NestJS backend (REST API)
└── web/          # React frontend (Vite + TypeScript)
```

---

## ⚙️ Texnologiyalar

### Backend (`/api`)
| Texnologiya | Maqsad |
|-------------|--------|
| **NestJS** | Asosiy framework |
| **Prisma ORM** | Ma'lumotlar bazasi bilan ishlash |
| **PostgreSQL** | Ma'lumotlar bazasi |
| **JWT** | Autentifikatsiya (Access Token) |
| **bcrypt** | Parolni xeshlash |
| **Multer** | Fayl yuklash (lokal, Render uchun Cloudinary tavsiya etiladi) |
| **Swagger** | API dokumentatsiya |
| **Winston** | Logging |
| **@nestjs/schedule** | Cron vazifalar (muddati o'tgan bronlar, bildirishnomalar) |

### Frontend (`/web`)
| Texnologiya | Maqsad |
|-------------|--------|
| **React 18** | UI framework |
| **Vite** | Build tool |
| **TypeScript** | Tip xavfsizligi |
| **Redux Toolkit** | Global state (foydalanuvchi) |
| **TanStack Query** | Server state, kesh, refetch |
| **React Router v6** | Sahifalar yo'nalishi |
| **Tailwind CSS** | Stillash |
| **Radix UI** | Accessible komponentlar |
| **Lucide React** | Ikonlar |
| **React Hook Form** | Forma boshqaruvi |
| **React Hot Toast** | Bildirishnomalar |
| **Recharts** | Grafik va statistika |

---

## 🚀 O'rnatish va ishga tushirish

### Talablar
- Node.js 18+
- PostgreSQL 14+
- npm yoki yarn

---

### 1. Repozitoriyani klonlash

```bash
git clone https://github.com/your-username/library.git
cd library
```

---

### 2. Backend sozlash (`/api`)

```bash
cd api
npm install
```

**`.env` fayl yaratish:**

```env
# Ma'lumotlar bazasi
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/library_db?schema=public"

# JWT
ACCESS_TOKEN_KEY=your_super_secret_jwt_key_here
ACCESS_TOKEN_TIME=25m

# API manzili (rasmlar URL uchun)
API_URL=http://localhost:3000

# Server port
PORT=3000

# Super admin (birinchi ishga tushirishda avtomatik yaratiladi)
SUPER_ADMIN_PHONE=+998901234567
SUPER_ADMIN_SECRET=your_superadmin_password

# Haqiqiy admin (agar kerak bo'lsa)
REAL_ADMIN_PHONE=+998977654321
REAL_ADMIN_SECRET=your_admin_password

# SMS xizmati (ixtiyoriy — yo'q bo'lsa devOtp UI da ko'rinadi)
SMS_TOKEN=
SMS_PSROL=
SMS_SENDER=
SMS_SERVICE_URL=
```

**Ma'lumotlar bazasini sozlash:**

```bash
# Migratsiyalarni ishga tushirish
npx prisma migrate deploy

# Boshlang'ich ma'lumotlar (demo foydalanuvchilar, kitoblar, a'zoliklar)
npx prisma db seed

# Prisma Studio (ixtiyoriy — vizual DB editor)
npx prisma studio
```

**Serverni ishga tushirish:**

```bash
# Development (hot reload)
npm run start:dev

# Production
npm run build
npm run start:prod
```

API ishlaydi: `http://localhost:3000/api`  
Swagger docs: `http://localhost:3000/docs`

---

### 3. Frontend sozlash (`/web`)

```bash
cd web
npm install
```

**`.env` fayl yaratish:**

```env
VITE_API_URL=http://localhost:3000
```

**Ishga tushirish:**

```bash
# Development
npm run dev

# Production build
npm run build
npm run preview
```

Ilova ishlaydi: `http://localhost:5173`

---

## 🗄 Ma'lumotlar bazasi sxemasi

```
User ──────────────── Member ──────── Membership
  │                     │
  ├── Payment           ├── MemberState (kitob olish/bron)
  ├── SavedBook         └── ReturnRequest
  ├── Review
  ├── Notification
  └── Waitlist

Book ──── Author
  └────── Category
  └────── Library
  └────── Image (polymorphic: BOOK | AUTHOR | USER)
```

### Asosiy modellar

| Model | Tavsif |
|-------|--------|
| `User` | Foydalanuvchilar (USER / ADMIN / SUPER_ADMIN) |
| `Membership` | A'zolik rejalari (ELITE, PRO, PREMIUM) |
| `Member` | Foydalanuvchining faol a'zoligi |
| `MemberState` | Har bir kitob olish/bron holati |
| `Book` | Kutubxona fondi |
| `Payment` | To'lovlar tarixi |
| `ReturnRequest` | Kitob qaytarish so'rovlari |
| `SavedBook` | Saqlangan kitoblar (wishlist) |
| `Notification` | Tizim bildirishnomalari |
| `Waitlist` | Kitob navbati |
| `Review` | Kitob reytingi va sharhlari |
| `Image` | Rasmlar (kitob, muallif, foydalanuvchi) |

---

## 🔐 Autentifikatsiya

OTP orqali ro'yxatdan o'tish (SMS xizmati ulanganda):

```
1. POST /api/auth/register  →  telefon + ism + parol yuborish
2. SMS orqali 6 xonali OTP keladi
3. POST /api/auth/verify-otp  →  OTP tasdiqlash → JWT token
4. Barcha so'rovlarda: Authorization: Bearer <token>
```

**SMS ulanganda:** `devOtp` response'dan olib tashlanadi.  
**SMS ulanmaganda (dev/demo rejim):** `devOtp` UI da sariq box ichida ko'rinadi, bir klik bilan nusxalanadi.

---

## 👥 Foydalanuvchi rollari

| Rol | Huquqlar |
|-----|----------|
| `USER` | Kitoblarni ko'rish, bron qilish, saqlash, qaytarish so'rovi, profil |
| `ADMIN` | Kitoblar, mualliflar, a'zoliklar, to'lovlar, qaytarish so'rovlarini boshqarish |
| `SUPER_ADMIN` | Admin huquqlariga qo'shimcha: admin yaratish, tizim sozlamalari |

---

## 📡 API Endpointlar

### Autentifikatsiya
```
POST   /api/auth/register          Ro'yxatdan o'tish + OTP yuborish
POST   /api/auth/verify-otp        OTP tasdiqlash + auto-login
POST   /api/auth/login             Parol bilan kirish
POST   /api/auth/change-pass       Parol o'zgartirish (OTP yuboradi)
POST   /api/auth/change-password/verify-otp  OTP tasdiqlash
POST   /api/auth/new-password      Yangi parol o'rnatish
```

### Foydalanuvchilar
```
GET    /api/user                   Ro'yxat (Admin)
GET    /api/user/me                O'zim haqida
GET    /api/user/:id               Bir foydalanuvchi
PATCH  /api/user/:id               Tahrirlash
DELETE /api/user/:id               O'chirish (SuperAdmin)
```

### Kitoblar
```
GET    /api/book                   Ro'yxat (filter: search, categoryId, authorId, status)
GET    /api/book/:id               Batafsil
POST   /api/book                   Qo'shish (Admin) — multipart/form-data
PATCH  /api/book/:id               Tahrirlash (Admin) — multipart/form-data
DELETE /api/book/:id               O'chirish (Admin)
```

### A'zolik
```
GET    /api/membership             Barcha rejalar
GET    /api/membership/:id         Bir reja
POST   /api/membership             Yaratish (Admin)
PATCH  /api/membership/:id         Tahrirlash (Admin)
DELETE /api/membership/:id         O'chirish (Admin)
```

### A'zolik holati
```
GET    /api/member                 Ro'yxat (Admin)
GET    /api/member/my              O'zimning faol a'zoligim
GET    /api/member/:id             Bir a'zo (Admin)
POST   /api/member                 A'zolik yaratish (Admin to'lovni tasdiqlaganda)
PATCH  /api/member/:id             Tahrirlash (Admin)
```

### Kitob olish holati
```
GET    /api/member-stats           Ro'yxat (Admin)
GET    /api/member-stats/current   O'zimning hozirgi kitoblarim
POST   /api/member-stats           Kitob berish (Admin)
PATCH  /api/member-stats/:id       Holat o'zgartirish (Admin)
```

### To'lovlar
```
GET    /api/payment                Barcha to'lovlar (Admin)
GET    /api/payment/my             O'zimning to'lovlarim
GET    /api/payment/:id            Bir to'lov
POST   /api/payment                To'lov yaratish (foydalanuvchi)
PATCH  /api/payment/:id            Holat o'zgartirish (Admin: PENDING→SUCCESS→FAILED)
```

### Qaytarish so'rovlari
```
GET    /api/return-request         Ro'yxat (Admin)
POST   /api/return-request         Qaytarish so'rovi (foydalanuvchi)
PATCH  /api/return-request/:id     Tasdiqlash/rad etish (Admin)
```

### Saqlangan kitoblar
```
GET    /api/saved-books/my         O'zimning saqlangan kitoblarim
POST   /api/saved-books            Toggle (saqlash / olib tashlash)
```

### Bildirishnomalar
```
GET    /api/notification           O'zimning bildirishnomalarim
PATCH  /api/notification/:id/read  O'qildi deb belgilash
PATCH  /api/notification/read-all  Hammasini o'qildi
DELETE /api/notification           Hammasini o'chirish
```

### Boshqalar
```
GET    /api/author                 Mualliflar ro'yxati
GET    /api/category               Kategoriyalar
GET    /api/library                Kutubxonalar
GET    /api/review/book/:bookId    Kitob sharhlari
POST   /api/review                 Sharh qo'shish
POST   /api/waitlist               Navbatga turish
DELETE /api/waitlist/:bookId       Navbatdan chiqish
GET    /api/analytics/summary      Statistika (Admin)
```

---

## 🖥 Frontend sahifalari

### Ommaviy sahifalar
| Yo'l | Sahifa |
|------|--------|
| `/` | Bosh sahifa — yangi kitoblar, kategoriyalar, statistika |
| `/books` | Kitoblar katalogi (qidiruv, filter) |
| `/books/:id` | Kitob batafsil sahifasi |
| `/login` | Kirish |
| `/register` | Ro'yxatdan o'tish |
| `/otp` | OTP tasdiqlash |

### Foydalanuvchi sahifalari (login kerak)
| Yo'l | Sahifa |
|------|--------|
| `/reading_history` | O'qish tarixi — hozirgi va qaytarilgan kitoblar |
| `/saved_books` | Saqlangan kitoblar |
| `/membership` | A'zolik rejalari va to'lov |
| `/profile` | Profil, statistika, to'lovlar tarixi |
| `/notifications` | Bildirishnomalar |

### Admin sahifalari (`/admin`)
| Yo'l | Sahifa |
|------|--------|
| `/admin` | Dashboard — umumiy statistika |
| `/admin/books` | Kitoblarni boshqarish (CRUD + rasm) |
| `/admin/authors` | Mualliflarni boshqarish |
| `/admin/categories` | Kategoriyalarni boshqarish |
| `/admin/libraries` | Kutubxonalarni boshqarish |
| `/admin/users` | Foydalanuvchilarni boshqarish |
| `/admin/members` | A'zoliklarni boshqarish |
| `/admin/memberships` | A'zolik rejalarini boshqarish |
| `/admin/payments` | To'lovlarni tasdiqlash |
| `/admin/member-stats` | Kitob berish / qaytarish |
| `/admin/return_requests` | Qaytarish so'rovlarini ko'rish |

### SuperAdmin sahifalari (`/superadmin`)
Admin sahifalariga qo'shimcha:
| Yo'l | Sahifa |
|------|--------|
| `/superadmin/admin` | Adminlarni boshqarish |

---

## 🔄 Asosiy biznes jarayonlari

### 1. Ro'yxatdan o'tish
```
Foydalanuvchi → /register (ism, telefon, parol)
→ Backend OTP yaratadi (SMS yoki devOtp)
→ /otp sahifasida kodni kiritish
→ Tasdiqlash → JWT token → Bosh sahifa
```

### 2. A'zolik olish va to'lov
```
Foydalanuvchi → /membership → reja tanlash
→ To'lov yaratiladi (PENDING)
→ Pul o'tkazilgach admin /admin/payments → holat SUCCESS
→ Avtomatik: Member yaratiladi (ACTIVE)
→ Foydalanuvchi kitob ola boshlaydi
```

### 3. Kitob olish (Admin tomonidan)
```
Admin → /admin/member-stats → foydalanuvchi + kitob tanlash
→ MemberState yaratiladi (BOOKED yoki BORROWED)
→ Foydalanuvchi /reading_history da ko'radi
```

### 4. Kitob qaytarish
```
Foydalanuvchi → /reading_history → "Qaytarish" tugmasi
→ ReturnRequest yaratiladi (PENDING)
→ Admin → /admin/return_requests → ACCEPTED
→ MemberState holati RETURNED ga o'tadi
→ Foydalanuvchiga bildirishnoma ketadi
```

### 5. Navbat (Waitlist)
```
Kitob NOTAVAILABLE bo'lsa → "Navbatga turish" tugmasi
→ Kitob bo'sh bo'lganda avtomatik bildirishnoma
→ Foydalanuvchi 24 soat ichida bron qilishi kerak
```

---

## 🤖 Cron vazifalar (avtomatik)

| Vaqt | Vazifa |
|------|--------|
| Har kecha 00:00 | Muddati o'tgan bronlarni NOTAVAILABLE ga o'tkazish |
| Har kecha 08:00 | Qaytarish muddati 3 kun qolgan kitoblar uchun bildirishnoma |
| Har kecha 09:00 | A'zolik muddati 5 kun qolganlar uchun ogohlantirish |

---

## 🗝 Demo hisoblar

```
👤 Foydalanuvchi:   +998900000003  /  demo1234
👨‍💼 Admin:           +998900000002  /  demo1234
🌱 Zulfiya (USER):  +998901234501  /  pass123456
```

> Seed faylida barcha demo foydalanuvchilar (+998901234501–510) `pass123456` paroliga ega.

---

## 📦 Fayl yuklash

Hozirgi holat: fayllar `./uploads/` papkasiga saqlanadi (lokal disk).

**⚠️ Render.com da muammo:** Render'ning bepul tarifi ephemeral filesystem ishlatadi — server restart bo'lganda barcha yuklangan rasmlar o'chib ketadi.

### Yechim: Cloudinary (bepul 25GB)

1. [cloudinary.com](https://cloudinary.com) da hisob oching
2. `.env` ga qo'shing:
   ```env
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   ```
3. `npm install cloudinary`
4. `multerConfig` ni `memoryStorage` ga o'zgartiring, `CloudinaryService` yozing

---

## 🌐 Deployment

### Backend → Render.com
1. Render'da yangi **Web Service** yarating
2. Repository ulang
3. `Root Directory`: `api`
4. `Build Command`: `npm install && npx prisma generate && npm run build`
5. `Start Command`: `npm run start:prod`
6. Environment variables'larni kiriting (`.env` dagi barcha qiymatlar)
7. PostgreSQL uchun Render'ning bepul DB xizmatidan yoki [Neon.tech](https://neon.tech) dan foydalaning

### Frontend → Vercel / Netlify
```bash
cd web
npm run build
# dist/ papkasini deploy qiling
```

**Vercel:**
1. Vercel'da import qiling
2. `Root Directory`: `web`
3. `VITE_API_URL` = backend URL (masalan: `https://library-api.onrender.com`)

---

## 🔧 Muhim environment variables

### Backend (`.env`)
```env
DATABASE_URL=           # PostgreSQL connection string (majburiy)
ACCESS_TOKEN_KEY=       # JWT secret, kamida 32 ta belgili (majburiy)
ACCESS_TOKEN_TIME=25m   # Token amal qilish vaqti
API_URL=                # Backend URL (rasmlar uchun)
PORT=3000

SUPER_ADMIN_PHONE=      # Birinchi super admin telefon
SUPER_ADMIN_SECRET=     # Birinchi super admin parol

# SMS (ixtiyoriy — yo'q bo'lsa devOtp ishlatiladi)
SMS_TOKEN=
SMS_PSROL=
SMS_SENDER=
SMS_SERVICE_URL=

# Cloudinary (rasmlar uchun, Render da kerak)
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Frontend (`.env`)
```env
VITE_API_URL=http://localhost:3000   # Backend URL
```

---

## 📝 Qo'shimcha buyruqlar

```bash
# Prisma sxemasini o'zgartirish
npx prisma migrate dev --name migration_name

# Prisma client regeneratsiya
npx prisma generate

# Barcha ma'lumotlarni tozalab qayta seed
npx prisma migrate reset

# TypeScript xatolarini tekshirish (API)
cd api && npx tsc --noEmit

# TypeScript xatolarini tekshirish (web)
cd web && npx tsc --noEmit
```

---

## 🤝 Hissa qo'shish

1. Fork qiling
2. Branch yarating: `git checkout -b feature/yangi-funksiya`
3. O'zgartirishlarni kiriting: `git commit -m 'feat: yangi funksiya qo'shildi'`
4. Push qiling: `git push origin feature/yangi-funksiya`
5. Pull Request oching

---

## 📄 Litsenziya

MIT License — batafsil [LICENSE](./LICENSE) faylida.
