# 🎬 Netflix Clone

Fullstackowy klon Netflixa zbudowany w technologii JavaScript/TypeScript. Projekt szkolny realizowany w ramach technikum informatycznego.

---

## 🛠️ Technologie

### Frontend

- **Next.js 15** — framework React z SSR/CSR
- **React 19** — biblioteka UI
- **TypeScript** — typowanie statyczne
- **Tailwind CSS 4** — stylowanie
- **TanStack React Query** — zarządzanie stanem i cache
- **Axios** — klient HTTP
- **cookies-next** — obsługa cookies (SSR)

### Backend

- **NestJS** — framework Node.js
- **Prisma 7** — ORM do bazy danych
- **PostgreSQL** — relacyjna baza danych
- **JWT** — autoryzacja tokenem
- **Passport.js** — strategia autoryzacji
- **Stripe** — integracja płatności

### Infrastruktura

- **Docker** — konteneryzacja bazy danych
- **Docker Compose** — orkiestracja kontenerów

---

## ✨ Funkcjonalności

- 🔐 **Rejestracja i logowanie** — autoryzacja JWT
- 🎥 **Katalog filmów** — przeglądanie, filtrowanie po gatunkach, wyszukiwanie
- 🎬 **Odtwarzacz wideo** — własny player z kontrolkami (play/pause, seek, głośność, fullscreen)
- 📋 **My List** — dodawanie filmów do listy ulubionych
- 📜 **Historia oglądania** — "Continue Watching" z możliwością czyszczenia
- ✅ **Oznaczanie jako obejrzane** — ręcznie lub automatycznie po zakończeniu filmu
- 🤖 **Rekomendacje** — algorytm oparty na historii oglądania i gatunkach
- 💳 **Subskrypcja Premium** — integracja ze Stripe (29.99 PLN/miesiąc)
- 🔒 **Filmy Premium** — blokada dla użytkowników bez subskrypcji
- 🔍 **SSR dla SEO** — strona szczegółów renderowana po stronie serwera z meta tagami Open Graph

---

## 📁 Struktura projektu

```
str-app/
├── backend/                 # NestJS API
│   ├── src/
│   │   ├── auth/            # Autoryzacja JWT
│   │   ├── movies/          # Zarządzanie filmami
│   │   ├── watchlist/       # Lista ulubionych
│   │   ├── history/         # Historia oglądania
│   │   ├── payments/        # Integracja Stripe
│   │   └── prisma/          # Serwis bazy danych
│   └── prisma/
│       └── schema.prisma    # Schemat bazy danych
│
├── frontend/                # Next.js aplikacja
│   ├── app/
│   │   ├── dashboard/       # Panel użytkownika
│   │   ├── movies/          # Lista i szczegóły filmów
│   │   ├── watch/           # Odtwarzacz wideo
│   │   ├── subscribe/       # Strona subskrypcji
│   │   ├── login/           # Logowanie
│   │   └── register/        # Rejestracja
│   ├── components/          # Komponenty React
│   └── lib/                 # Utilities (api, auth)
│
└── docker-compose.yml       # Konfiguracja Docker
```

---

## 🚀 Uruchomienie projektu

### Wymagania

- Node.js v22+
- Docker Desktop
- Konto Stripe (tryb sandbox)

### 1. Klonowanie repozytorium

```bash
git clone <url-repozytorium>
cd str-app
```

### 2. Uruchomienie bazy danych

```bash
docker-compose up -d
```

### 3. Konfiguracja backendu

```bash
cd backend
```

Utwórz plik `.env`:

```env
DATABASE_URL="postgresql://netflix:netflix@localhost:5432/netflix_db?schema=public"
JWT_SECRET="twoj-sekret-jwt"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ID=price_...
```

```bash
npm install
npx prisma migrate dev
npx prisma generate
npm run start:dev
```

### 4. Konfiguracja frontendu

```bash
cd frontend
```

Utwórz plik `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

```bash
npm install
npm run dev
```

### 5. Stripe webhooks (do testowania płatności)

```bash
stripe listen --forward-to http://localhost:3001/payments/webhook
```

### Adresy

| Serwis        | Adres                 |
| ------------- | --------------------- |
| Frontend      | http://localhost:3000 |
| Backend API   | http://localhost:3001 |
| Baza danych   | localhost:5432        |
| Prisma Studio | http://localhost:5555 |

---

## 🗄️ Schemat bazy danych

| Tabela          | Opis                                   |
| --------------- | -------------------------------------- |
| `users`         | Użytkownicy z danymi subskrypcji       |
| `movies`        | Filmy z flagą `isPremium`              |
| `watchlist`     | Lista ulubionych filmów                |
| `watch_history` | Historia oglądania z flagą `completed` |

---

## 💳 Testowanie płatności

Karta testowa Stripe:

- **Numer:** `4242 4242 4242 4242`
- **Data:** dowolna przyszła (np. `12/28`)
- **CVC:** dowolne 3 cyfry (np. `123`)

---

## 📡 API Endpoints

### Auth

| Metoda | Endpoint         | Opis               |
| ------ | ---------------- | ------------------ |
| POST   | `/auth/register` | Rejestracja        |
| POST   | `/auth/login`    | Logowanie          |
| GET    | `/auth/me`       | Profil użytkownika |

### Movies

| Metoda | Endpoint                  | Opis            |
| ------ | ------------------------- | --------------- |
| GET    | `/movies`                 | Lista filmów    |
| GET    | `/movies/:id`             | Szczegóły filmu |
| GET    | `/movies/recommendations` | Rekomendacje    |
| GET    | `/movies/seed`            | Seedowanie bazy |

### Watchlist

| Metoda | Endpoint              | Opis          |
| ------ | --------------------- | ------------- |
| GET    | `/watchlist`          | Pobierz listę |
| POST   | `/watchlist`          | Dodaj film    |
| DELETE | `/watchlist/:movieId` | Usuń film     |

### History

| Metoda | Endpoint                     | Opis                  |
| ------ | ---------------------------- | --------------------- |
| GET    | `/history`                   | Historia oglądania    |
| GET    | `/history/completed`         | Obejrzane filmy       |
| POST   | `/history`                   | Dodaj do historii     |
| PATCH  | `/history/:movieId/complete` | Oznacz jako obejrzany |
| DELETE | `/history`                   | Wyczyść historię      |

### Payments

| Metoda | Endpoint             | Opis                   |
| ------ | -------------------- | ---------------------- |
| POST   | `/payments/checkout` | Utwórz sesję płatności |
| GET    | `/payments/status`   | Status subskrypcji     |
| POST   | `/payments/webhook`  | Webhook Stripe         |

---

## 👨‍💻 Autor

Bartosz Jędrychowski
