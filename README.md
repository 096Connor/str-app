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
- 🎬 **Odtwarzacz wideo** — własny player z kontrolkami
- 📋 **My List** — dodawanie filmów do listy ulubionych
- 📜 **Historia oglądania** — "Continue Watching" z możliwością czyszczenia
- ✅ **Oznaczanie jako obejrzane** — ręcznie lub automatycznie po zakończeniu filmu
- 🤖 **Rekomendacje** — algorytm oparty na historii oglądania i gatunkach
- 💳 **Subskrypcja Premium** — integracja ze Stripe (29.99 PLN/miesiąc)
- 🔒 **Filmy Premium** — blokada dla użytkowników bez subskrypcji
- 🔍 **SSR dla SEO** — strona szczegółów z meta tagami Open Graph

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
- Stripe CLI — https://stripe.com/docs/stripe-cli (zakładka Windows)

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

Utwórz plik `backend/.env` z następującą zawartością:

````env
DATABASE_URL="postgresql://netflix:netflix@localhost:5432/netflix_db?schema=public"
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"
PORT=3001
NODE_ENV=development
STRIPE_SECRET_KEY=<skontaktuj sie z autorem projektu po klucz>
STRIPE_WEBHOOK_SECRET=whsec_WYGENERUJ_WŁASNY_PATSTRIPE_SECRET_KEY=sk_test_51TLSOEB63vT3f0zcHCELCoL4uDygXsfqyJBm2C5z8IEoih77D5bVAZ84l8voDRWY85ZBEuHijp1pvSpYs7Ymlhjs004FRaxbg4
️ `STRIPE_WEBHOOK_SECRET` musisz wygenerować sam — patrz krok 5.

```bash
npm install
npx prisma migrate dev
npx prisma generate
npm run start:dev
````

### 4. Konfiguracja frontendu

```bash
cd frontend
```

Utwórz plik `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

```bash
npm install
npm run dev
```

### 5. Uruchomienie webhooków Stripe

Webhooks są potrzebne do aktywacji subskrypcji po płatności.

1. Pobierz Stripe CLI ze https://stripe.com/docs/stripe-cli (zakładka Windows)
2. Wypakuj i uruchom w nowym terminalu:

```bash
stripe login
stripe listen --forward-to http://localhost:3001/payments/webhook
```

3. Skopiuj wyświetlony `whsec_...` i wklej do `backend/.env` jako `STRIPE_WEBHOOK_SECRET`
4. Zrestartuj backend

### Adresy po uruchomieniu

| Serwis      | Adres                 |
| ----------- | --------------------- |
| Frontend    | http://localhost:3000 |
| Backend API | http://localhost:3001 |
| Baza danych | localhost:5432        |

---

## 💳 Testowanie płatności

Użyj karty testowej Stripe (nie pobiera prawdziwych pieniędzy):

- **Numer:** `4242 4242 4242 4242`
- **Data:** dowolna przyszła (np. `12/28`)
- **CVC:** dowolne 3 cyfry (np. `123`)
- **Imię/adres:** cokolwiek

---

## 🗄️ Schemat bazy danych

| Tabela          | Opis                                   |
| --------------- | -------------------------------------- |
| `users`         | Użytkownicy z danymi subskrypcji       |
| `movies`        | Filmy z flagą `isPremium`              |
| `watchlist`     | Lista ulubionych filmów                |
| `watch_history` | Historia oglądania z flagą `completed` |

---

## 📡 API Endpoints

### Auth

| Metoda | Endpoint         | Opis               |
| ------ | ---------------- | ------------------ |
| POST   | `/auth/register` | Rejestracja        |
| POST   | `/auth/login`    | Logowanie          |
| GET    | `/auth/me`       | Profil użytkownika |

### Movies

| Metoda | Endpoint                  | Opis                            |
| ------ | ------------------------- | ------------------------------- |
| GET    | `/movies`                 | Lista filmów                    |
| GET    | `/movies/:id`             | Szczegóły filmu                 |
| GET    | `/movies/recommendations` | Rekomendacje                    |
| GET    | `/movies/seed`            | Seedowanie przykładowych filmów |

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

| Metoda | Endpoint             | Opis                          |
| ------ | -------------------- | ----------------------------- |
| POST   | `/payments/checkout` | Utwórz sesję płatności Stripe |
| GET    | `/payments/status`   | Status subskrypcji            |
| POST   | `/payments/webhook`  | Webhook Stripe                |

---

## 👨‍💻 Autor

Projekt wykonany jako zadanie szkolne nr 7 — Klon Netflix w JavaScript.
