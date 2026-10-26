#  Piyush Funde — Full-Stack Portfolio & Custom CMS


A modern, high-performance personal portfolio connected to a **custom-built Java Spring Boot 3.x Headless CMS** and an **interactive Admin Control Dashboard**.
**Live Website:** [https://piyushfunde-portfolio.vercel.app/](https://piyushfunde-portfolio.vercel.app/)

---

## System Architecture

This project is engineered with a **fully decoupled full-stack architecture**:

```mermaid
flowchart TD

subgraph group_portfolio["Portfolio frontend"]
  node_portfolio_app["Portfolio routes<br/>[App.jsx]"]
  node_portfolio_api["Portfolio API client<br/>[api.js]"]
  node_portfolio_content["Portfolio pages"]
  node_portfolio_contact["Contact page<br/>[Contact.jsx]"]
end

subgraph group_admin["Admin dashboard"]
  node_admin_app["Admin routes<br/>[App.jsx]"]
  node_admin_api["Admin API client<br/>[api.js]"]
  node_admin_content["Content editors"]
  node_admin_resume["Resume manager<br/>[ResumeManager.jsx]"]
  node_admin_inbox["Messages inbox"]
end

subgraph group_backend["CMS backend"]
  node_public_controller["Public endpoints"]
  node_admin_controller["Admin endpoints"]
  node_auth_controller["Authentication endpoint"]
  node_media_controller["Media endpoint"]
  node_content_service["Content service"]
  node_file_storage["File storage"]
  node_security["JWT security"]
end

subgraph group_data["Persistence and integrations"]
  node_models["Content models"]
  node_repositories["JPA repositories"]
  node_database[("Relational database")]
  node_email_service["EmailJS"]
  node_media_store[("Uploaded files")]
end

node_visitor(("Visitor"))
node_admin_user(("Administrator"))

node_visitor -->|"browses"| node_portfolio_app
node_portfolio_app -->|"routes to"| node_portfolio_content
node_portfolio_content -.->|"loads content"| node_portfolio_api
node_visitor -.->|"submits inquiry"| node_portfolio_contact
node_portfolio_contact -.->|"posts inquiry"| node_portfolio_api
node_portfolio_contact -.->|"dispatches email"| node_email_service
node_portfolio_api -.->|"requests public API"| node_public_controller
node_admin_user -->|"manages content"| node_admin_app
node_admin_app -->|"routes to"| node_admin_content
node_admin_app -->|"routes to"| node_admin_resume
node_admin_app -->|"routes to"| node_admin_inbox
node_admin_app -->|"refreshes messages"| node_admin_api
node_admin_content -.->|"manages content"| node_admin_api
node_admin_resume -.->|"uploads and saves"| node_admin_api
node_admin_inbox -.->|"manages inquiries"| node_admin_api
node_admin_api -.->|"authenticates"| node_auth_controller
node_admin_api -.->|"calls protected API"| node_admin_controller
node_admin_api -.->|"uploads media"| node_media_controller
node_auth_controller -.->|"uses JWT security"| node_security
node_admin_controller -->|"delegates content work"| node_content_service
node_public_controller -->|"delegates content work"| node_content_service
node_content_service -->|"reads and writes"| node_repositories
node_media_controller -.->|"stores uploads"| node_file_storage
node_file_storage -->|"saves media metadata"| node_repositories
node_repositories -.->|"persists records"| node_database
node_file_storage -->|"writes files"| node_media_store
node_content_service -->|"handles content records"| node_models

click node_portfolio_app "https://github.com/piyushfunde/piyush-portfolio/blob/main/src/App.jsx"
click node_portfolio_api "https://github.com/piyushfunde/piyush-portfolio/blob/main/src/api.js"
click node_portfolio_content "https://github.com/piyushfunde/piyush-portfolio/tree/main/src/pages"
click node_portfolio_contact "https://github.com/piyushfunde/piyush-portfolio/blob/main/src/pages/Contact.jsx"
click node_admin_app "https://github.com/piyushfunde/piyush-portfolio/blob/main/admin-cms-frontend/src/App.jsx"
click node_admin_api "https://github.com/piyushfunde/piyush-portfolio/blob/main/admin-cms-frontend/src/api.js"
click node_admin_content "https://github.com/piyushfunde/piyush-portfolio/tree/main/admin-cms-frontend/src/pages"
click node_admin_resume "https://github.com/piyushfunde/piyush-portfolio/blob/main/admin-cms-frontend/src/pages/ResumeManager.jsx"
click node_admin_inbox "https://github.com/piyushfunde/piyush-portfolio/blob/main/admin-cms-frontend/src/pages/MessagesManager.jsx"
click node_public_controller "https://github.com/piyushfunde/piyush-portfolio/blob/main/backend-cms/src/main/java/com/piyush/cms/controller/PublicContentController.java"
click node_admin_controller "https://github.com/piyushfunde/piyush-portfolio/blob/main/backend-cms/src/main/java/com/piyush/cms/controller/AdminCMSController.java"
click node_auth_controller "https://github.com/piyushfunde/piyush-portfolio/blob/main/backend-cms/src/main/java/com/piyush/cms/controller/AuthController.java"
click node_media_controller "https://github.com/piyushfunde/piyush-portfolio/blob/main/backend-cms/src/main/java/com/piyush/cms/controller/MediaController.java"
click node_content_service "https://github.com/piyushfunde/piyush-portfolio/blob/main/backend-cms/src/main/java/com/piyush/cms/service/ContentService.java"
click node_file_storage "https://github.com/piyushfunde/piyush-portfolio/blob/main/backend-cms/src/main/java/com/piyush/cms/service/FileStorageService.java"
click node_security "https://github.com/piyushfunde/piyush-portfolio/tree/main/backend-cms/src/main/java/com/piyush/cms/security"
click node_models "https://github.com/piyushfunde/piyush-portfolio/tree/main/backend-cms/src/main/java/com/piyush/cms/model"
click node_repositories "https://github.com/piyushfunde/piyush-portfolio/tree/main/backend-cms/src/main/java/com/piyush/cms/repository"

classDef toneNeutral fill:#f8fafc,stroke:#334155,stroke-width:1.5px,color:#0f172a
classDef toneBlue fill:#dbeafe,stroke:#2563eb,stroke-width:1.5px,color:#172554
classDef toneAmber fill:#fef3c7,stroke:#d97706,stroke-width:1.5px,color:#78350f
classDef toneMint fill:#dcfce7,stroke:#16a34a,stroke-width:1.5px,color:#14532d
classDef toneRose fill:#ffe4e6,stroke:#e11d48,stroke-width:1.5px,color:#881337
classDef toneIndigo fill:#e0e7ff,stroke:#4f46e5,stroke-width:1.5px,color:#312e81
classDef toneTeal fill:#ccfbf1,stroke:#0f766e,stroke-width:1.5px,color:#134e4a
class node_portfolio_app,node_portfolio_api,node_portfolio_content,node_portfolio_contact toneBlue
class node_admin_app,node_admin_api,node_admin_content,node_admin_resume,node_admin_inbox toneAmber
class node_public_controller,node_admin_controller,node_auth_controller,node_media_controller,node_content_service,node_file_storage,node_security toneMint
class node_models,node_repositories,node_database,node_email_service,node_media_store toneRose
class node_visitor,node_admin_user toneIndigo
```

---

##  Key Features & Upgrades

### 1. Dynamic Portfolio Frontend
- **Decoupled API Integration**: Dynamically loads projects, skills, timeline, certifications, and blogs via `src/api.js` with zero-downtime offline fallback.
- **Modern Dark Aesthetics**: 28px dot-grid texture, ambient drifting mesh gradient blobs, and glassmorphic cards with subtle inset highlights.
- **Smooth Micro-Interactions**: Framer Motion entrance animations, floating social badges, and interactive project showcases.
- **Dual-Channel Contact System**: Contact form submissions are dispatched via **EmailJS** and persistently logged into the CMS database.

### 2. Custom Spring Boot 3.x CMS Backend
- **100% Custom-Coded Headless CMS**: Built from scratch without third-party CMS platforms (Strapi, Sanity, Contentful), providing full schema control and native data ownership.
- **Spring Security & Rate Limiting**: Stateless token authentication (`HMAC-SHA256`) with brute-force rate limiting and 15-minute lockout protection on auth endpoints.
- **Relational Persistence**: PostgreSQL for production deployments (with connection pooling) and H2 in-memory mode for isolated unit testing.
- **Media Upload Service**: Native multipart file storage with Cloudinary/S3 integration support to prevent ephemeral disk loss.

###  3. CMS Admin Control Center
- **Dedicated Dashboard**: Real-time content metrics, dynamic `/health` engine checks, and rapid publishing shortcuts.
- **Practical Admin Utilities**: Live inquiries inbox with read/unread flags, pending drafts manager, and visual CRUD tables.

---

## Technology Stack

| Tier | Technologies |
| :--- | :--- |
| **Portfolio Frontend** | React 18, Vite, Framer Motion, Lucide Icons, Vanilla CSS |
| **Admin CMS Panel** | React 18, Vite, Lucide React, Glassmorphic Theme |
| **Backend CMS** | Java 17, Spring Boot 3.2.5, Spring Data JPA, Spring Security |
| **Security** | JJWT (io.jsonwebtoken), BCrypt Password Hashing |
| **Database** | PostgreSQL / H2 Database Engine |
| **Email Service** | EmailJS & Spring Mail Notification Service |

---

##  REST API Specifications

### Public Endpoints
- `GET /api/v1/public/about` — Fetch bio, profile details, and social links
- `GET /api/v1/public/projects` — List all projects (`?featured=true` for highlighted work)
- `GET /api/v1/public/skills` — Retrieve categorized skills with proficiency levels
- `GET /api/v1/public/experience` — Career and internship timeline
- `GET /api/v1/public/certificates` — Professional badges and verified credentials
- `GET /api/v1/public/blogs` — Published engineering articles and dev notes
- `POST /api/v1/public/contact` — Submit contact form inquiry

### Admin CMS Endpoints (Protected by JWT)
- `POST /api/v1/auth/login` — Authenticate admin user
- `GET /api/v1/admin/stats` — Retrieve CMS dashboard analytics
- `POST / PUT / DELETE /api/v1/admin/projects` — Manage portfolio projects
- `POST / PUT / DELETE /api/v1/admin/skills` — Manage technical skill sets
- `POST /api/v1/admin/media/upload` — Upload multipart image files
- `GET /api/v1/admin/messages` — Inbox for contact submissions

---

##  Local Development Setup

### 1. Run the Portfolio Frontend
```bash
cd piyush-portfolio
npm install
npm run dev
```
Portfolio runs at: `http://localhost:5173/`

### 2. Run the Custom CMS Admin Panel
```bash
cd admin-cms-frontend
npm install
npm run dev
```
Admin Dashboard runs at: `http://localhost:5174/`  
*Default Dev Credentials:* `admin` / `admin123`

### 3. Run the Spring Boot CMS Backend
```bash
cd backend-cms
# Run with your favorite Java IDE or Maven
mvn spring-boot:run
```
Backend API runs at: `http://localhost:8080/api/v1`  
H2 Database Console: `http://localhost:8080/h2-console`

---
## 📄 License

This project is licensed under the **MIT License** — feel free to fork, customize, and build upon it!

> *"Crafting resilient distributed systems, intelligent workflows, and modern web experiences."*
