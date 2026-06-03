## LearnLab Server

Backend API for a minimal LMS-style product catalog with modules, lectures, reviews, and user progress tracking. Built with Express, TypeScript, and MongoDB.

### Highlights

- JWT auth with role-based access (`admin`, `user`)
- Course (product) catalog with modules and lectures
- Lecture PDF uploads via Cloudinary
- Reviews with average rating aggregation
- User progress tracking per course
- Centralized error handling + Zod validation

### Tech Stack

- Node.js + Express
- TypeScript
- MongoDB + Mongoose
- Zod (request validation)
- Cloudinary + Multer (file uploads)
- JWT (auth)
- Nodemailer (email utility)

### Project Structure (high-level)

- `src/app` - app modules, middleware, utilities
- `src/app/modules` - feature modules (auth, course, lecture, review, user, user-progress)
- `src/app/routes` - API router aggregation
- `src/app/config` - environment and third-party config
- `src/app/DB` - seed helpers

### Getting Started

#### Prerequisites

- Node.js 18+
- MongoDB
- Cloudinary account (for uploads)

#### Install

```bash
yarn install
```

#### Environment Variables

Create a `.env` file in the project root:

```bash
NODE_ENV=development
PORT=5000
DB_URL=mongodb://localhost:27017/learnlab

BCRYPT_SALT_ROUNDS=10
JWT_ACCESS_SECRET=your_access_secret
JWT_ACCESS_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your_refresh_secret
JWT_REFRESH_EXPIRES_IN=365d
JWT_OTP_SECRET=your_otp_secret
JWT_PASS_RESET_SECRET=your_reset_secret
JWT_PASS_RESET_EXPIRES_IN=15m

ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=admin123
ADMIN_PROFILE_PHOTO=https://example.com/admin.png
ADMIN_MOBILE_NUMBER=01000000000

CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_cloud_key
CLOUDINARY_API_SECRET=your_cloud_secret

SENDER_EMAIL=youremail@gmail.com
SENDER_APP_PASS=your_app_password

# SSLCommerz (optional)
STORE_NAME=learnlab
PAYMENT_API=https://sandbox.sslcommerz.com/gwprocess/v4/api.php
VALIDATION_API=https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php
STORE_ID=your_store_id
STORE_PASSWORD=your_store_password
VALIDATION_URL=https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php
SUCCESS_URL=https://your-domain.com/payment/success
FAILED_URL=https://your-domain.com/payment/failed
CANCEL_URL=https://your-domain.com/payment/cancel
```

#### Run

```bash
yarn dev
```

### Scripts

- `yarn dev` - start in dev mode (ts-node-dev)
- `yarn build` - compile TypeScript
- `yarn start` - run compiled output
- `yarn create-module <name>` - scaffold a new module

### API Base

All endpoints are prefixed with `/api/v1`.

### Authentication

- Login returns an `accessToken` and sets a `refreshToken` cookie.
- Refresh uses the `Authorization` header with the refresh token.

### API Endpoints

#### Auth

- `POST /api/v1/auth/login`
  - Body: `{ email, password }`
- `POST /api/v1/auth/refresh-token`
  - Header: `Authorization: <refreshToken>`

#### Users

- `POST /api/v1/user`
  - Body: `{ name, email, password, phoneNumber, role }`
  - Client info is injected from request headers.

#### Courses (Products)

- `GET /api/v1/product`
  - Query: `searchTerm`, `sort`, `page`, `limit`, `fields`
- `GET /api/v1/product/:productId`
- `GET /api/v1/product/:productId/modules`
- `POST /api/v1/product` (admin)
  - `multipart/form-data`
  - File field: `thumbnail`
  - JSON field: `data` (stringified JSON)
- `PATCH /api/v1/product/:productId` (admin)
  - `multipart/form-data` with optional `thumbnail` and `data`
- `PATCH /api/v1/product/:productId/delete` (admin)
  - Body: `{ isDeleted: "true" }`

#### Course Modules

- `POST /api/v1/module/create-module` (admin)
  - Body: `{ moduleTitle, course, moduleNumber? }`
- `GET /api/v1/module/:courseId`
- `PATCH /api/v1/module/:moduleId` (admin)
- `PATCH /api/v1/module/:moduleId/delete` (admin)
  - Body: `{ isDeleted: "true" }`

#### Lectures

- `GET /api/v1/lecture`
  - Query: `moduleId`, `moduleTitle`, `courseTitle`, plus pagination fields
- `POST /api/v1/lecture/create-lecture` (admin)
  - `multipart/form-data`
  - File field: `pdfs` (one or many)
  - JSON field: `data` (stringified JSON)
- `PATCH /api/v1/lecture/:lectureId` (admin)
  - `multipart/form-data` with `pdfs` and `data`
- `PATCH /api/v1/lecture/:lectureId/delete` (admin)
  - Body: `{ isDeleted: "true" }`

#### Reviews

- `GET /api/v1/review` (admin)
- `POST /api/v1/review` (user)
  - Body: `{ product, review, rating }`

#### User Progress

- `POST /api/v1/user-progress/create`
  - Body: `{ userId, courseId, completedLectures?, unlockedLectures? }`
- `GET /api/v1/user-progress/by-course?userId=<id>&courseId=<id>`
- `GET /api/v1/user-progress`
  - Query: `userId`, `courseId`, plus pagination fields
- `PATCH /api/v1/user-progress/update`
  - Body: `{ userId, courseId, currentLecture, nextLecture?, totalLectures }`

#### Customer (not mounted)

Customer routes exist but are not wired into the main router yet.

### Query Parameters

Most list endpoints accept:

- `searchTerm`: fuzzy search (only where enabled)
- `sort`: comma-separated fields (default `-createdAt`)
- `page`, `limit`
- `fields`: comma-separated projection

### Error Response Format

```json
{
  "success": false,
  "message": "Validation Error",
  "errorSources": [{ "path": "email", "message": "Invalid email address" }],
  "err": {},
  "stack": null
}
```

### File Uploads

- Course thumbnails: Cloudinary via `multer-storage-cloudinary`
- Lecture PDFs: uploaded via Cloudinary, stored in `pdfUrls`

### Seeding

An admin seed helper exists (`src/app/DB/seed.ts`) but is not called by default. You can import and call it during bootstrap if needed.

### Notes

- CORS is configured for `http://localhost:3000` by default.
- `refreshToken` validation is expected in the `Authorization` header.

### License

MIT
