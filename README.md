# 🛒 TrendLama – E-Commerce Microservices Platform

A **production-grade, cloud-native E-Commerce platform** built with **modern microservices architecture** and a **Turborepo-based monorepo**. The system consists of **6 independently deployable services**, designed for **scalability, resilience, and real-world SaaS deployments**.

This project demonstrates **full‑stack, DevOps, and cloud engineering best practices**, including CI/CD, Docker, Kubernetes (k3s), AWS ECR, Kafka-based eventing, and domain-based routing via NGINX.

---

## 🌐 Live Applications

* **Client (Storefront):** [http://trendlama-client.duckdns.org/](http://trendlama-client.duckdns.org/)
* **Admin Dashboard:** [http://trendlama-admin.duckdns.org/](http://trendlama-admin.duckdns.org/)

---

## 🚀 Key Highlights

* **Microservices Architecture (6 Services)**
* **Monorepo with Turborepo (Apps + Packages)**
* **API-first design (REST)**
* **Event-driven communication with Kafka**
* **Dockerized services with per-service Dockerfiles**
* **Automated CI/CD using GitHub Actions**
* **AWS ECR image builds on every service change**
* **Kubernetes (k3s) deployment on EC2**
* **NGINX reverse proxy with custom domains**
* **Secure authentication via Clerk**

---

## 🧱 Architecture Overview

```
Users (Browser)
   │
   ├── Client (Next.js)
   ├── Admin (Next.js)
   │
NGINX Reverse Proxy
   │
-------------------------------------------------
| Auth | Product | Order | Payment (Microservices)
-------------------------------------------------
   │
Databases + Kafka Event Bus
```

Each service:

* Owns its **own database**
* Is **independently deployable & scalable**
* Communicates via **REST + Kafka events**

---

## 🧩 Services Breakdown (6 Services)

### 1️⃣ Client Application (Storefront)

**Description:**
Customer-facing E-Commerce web application.

**Tech Stack:**

* Next.js 16
* React 19
* Clerk Authentication
* Stripe Client SDK
* Zustand (State Management)
* Tailwind CSS

**Responsibilities:**

* Product browsing
* Cart & checkout
* Secure user authentication

---

### 2️⃣ Admin Application

**Description:**
Internal admin dashboard for managing the platform.

**Tech Stack:**

* Next.js 16
* React 19
* React Query & Tables
* Radix UI
* Clerk Authentication

**Responsibilities:**

* Product management
* Order monitoring
* Business analytics

---

### 3️⃣ Authentication Service

**Description:**
Central authentication & identity service.

**Tech Stack:**

* Node.js
* Express
* Clerk (Auth Provider)
* Kafka (Event Publishing)

**Responsibilities:**

* Authentication middleware
* Token validation
* User identity propagation

---

### 4️⃣ Product Service

**Description:**
Handles product catalog and inventory management.

**Tech Stack:**

* Node.js
* Express
* Prisma
* PostgreSQL
* Kafka

**Responsibilities:**

* Product CRUD
* Inventory tracking
* Product-related events

---

### 5️⃣ Order Service

**Description:**
Manages order lifecycle and order history.

**Tech Stack:**

* Node.js
* Fastify
* MongoDB Atlas
* Kafka

**Responsibilities:**

* Order creation
* Order status tracking
* Order events (created, paid, completed)

---

### 6️⃣ Payment Service

**Description:**
Secure payment processing and transaction handling.

**Tech Stack:**

* Node.js
* Hono
* Stripe
* Kafka

**Responsibilities:**

* Payment intent creation
* Payment verification
* Payment confirmation events

---

## 🗂️ Monorepo Structure

```
trendlama/
│
├── apps/
│   ├── client
│   ├── admin
│   ├── auth-service
│   ├── product-service
│   ├── order-service
│   └── payment-service
│
├── packages/
│   ├── kafka
│   ├── product-database
│   └── order-db
│
├── .github/workflows/
├── docker/
├── k8s/
└── README.md
```

---

## ⚙️ Local Development

### Prerequisites

* Node.js >= 18
* Docker & Docker Compose
* Git

### Install Dependencies

```bash
npm install
```

### Run All Services

```bash
npm run dev
```

---

## 🐳 Docker & CI/CD

* Each service has its **own Dockerfile**
* GitHub Actions pipeline:

  * Builds Docker images per service
  * Pushes images to **AWS ECR**
  * Tags images per commit

---

## ☸️ Kubernetes Deployment (k3s)

* Hosted on **AWS EC2**
* Lightweight **k3s Kubernetes cluster**
* Deployment flow:

  1. CI builds & pushes image to ECR
  2. Image URL updated in Kubernetes manifests
  3. Manifests applied to k3s cluster

---

## 🌐 Networking & Domains

* **NGINX Reverse Proxy**
* Domain-based routing:

  * `trendlama-client.duckdns.org` → Client App
  * `trendlama-admin.duckdns.org` → Admin App

---

## 🔐 Security Best Practices

* Clerk-based authentication
* JWT verification at service level
* Environment-based secrets
* Service isolation

---

## 📈 Scalability & Reliability

* Stateless microservices
* Horizontal pod scaling
* Kafka-based async communication
* Database per service pattern

---

## 🧪 Testing

* API testing with Postman
* Service-level validation
* CI checks via Turborepo

---

## 📌 Future Enhancements

* Observability (Prometheus + Grafana)
* Distributed tracing
* Dead-letter queues (Kafka)
* Autoscaling with HPA

---

## 👨‍💻 Author

**Faisal Raza**
Full Stack Cloud & DevOps Engineer

* GitHub: [https://github.com/FaisalRaza19](https://github.com/FaisalRaza19)
* LinkedIn: [https://linkedin.com/in/heyfaisalraza](https://linkedin.com/in/heyfaisalraza)

---

## ⭐ Show Your Support

If you like this project, give it a ⭐ on GitHub!

---

## 📄 License

MIT License
