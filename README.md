# Healthcare Appointment Capacity & Queue Management Platform

**MedQueue PRO** — A full-stack healthcare operations management system for managing appointments, patient queues, doctor scheduling, and hospital analytics.

---

## Project Purpose

This platform digitizes and automates core hospital workflows:
- Patient registration and appointment booking
- Doctor availability and shift management
- Real-time queue management with token-based check-in
- Capacity analytics and reporting
- Role-based access control (RBAC) for hospital staff

---

## Main Features

| Feature | Description |
|:--------|:------------|
| JWT Authentication | Secure login with role-based access |
| Patient Management | CRUD for patient records |
| Doctor Management | Doctor profiles, specializations, departments |
| Department Management | Hospital departments with operating hours |
| Doctor Availability | Shift scheduling, break management, leave requests |
| Appointment Booking | Time-slot selection, conflict detection, priority levels |
| Appointment Lifecycle | Book → Check-in → In Consultation → Complete/Cancel/Reschedule |
| Queue Management | Token-based live queue with wait time estimation |
| Priority Categories | EMERGENCY, SENIOR_CITIZEN, SCHEDULED_STANDARD, WALK_IN |
| Capacity Analytics | Doctor utilization, department load, queue statistics |
| Reports | Real-data reports with Print, PDF export, Excel export |
| Audit Logs | Full activity trail for all system actions |
| Role-Based Navigation | Sidebar adapts based on authenticated user role |

---

## Technology Stack

### Backend
| Technology | Version | Purpose |
|:-----------|:--------|:--------|
| Java | 21 | Runtime |
| Spring Boot | 3.x | REST API framework |
| Spring Security | 6.x | JWT authentication & RBAC |
| Hibernate/JPA | 6.x | ORM for MySQL |
| JDBC | — | Raw SQL analytics queries |
| MySQL | 8.x | Primary database |
| HikariCP | — | Connection pooling |
| Maven | 3.x | Build tool |

### Frontend
| Technology | Version | Purpose |
|:-----------|:--------|:--------|
| React | 18.3.1 | UI framework |
| Vite | 6.0.3 | Build tool / dev server |
| React Router | 6.28 | Client-side routing |
| Axios | 1.7.9 | HTTP client |
| Tailwind CSS | 3.4.16 | Utility-first styling |
| Recharts | 2.15.0 | Charts and analytics |
| Lucide React | 0.468 | Icon library |
| jsPDF | 4.2.1 | PDF export |
| jspdf-autotable | 5.0.8 | PDF table rendering |
| ExcelJS | 4.4.0 | Excel (.xlsx) export |

---

## System Architecture

```
Browser (React/Vite — port 3000)
         │
         │  HTTP REST (Axios + JWT Bearer)
         ▼
Spring Boot REST API (port 8081)
         │
         ├── Spring Security (JWT Filter)
         ├── Controllers → Services → Repositories
         ├── Hibernate/JPA (Entity mapping)
         └── JDBC (Analytics raw SQL)
                  │
                  ▼
           MySQL Database (port 3306)
           health_care_operations_db
```

---

## Folder Structure

```
HealthcareOperations/
├── backend/
│   └── health_care_operations/           ← Spring Boot Maven project
│       ├── pom.xml
│       └── src/main/
│           ├── java/com/healthcare/
│           │   ├── HealthCareOperationsApplication.java  ← Main class
│           │   ├── controller/                           ← REST controllers
│           │   ├── service/                              ← Business logic
│           │   ├── repository/                           ← JPA + JDBC repos
│           │   ├── entity/                               ← Hibernate entities
│           │   ├── dto/                                  ← Request/Response DTOs
│           │   └── security/                             ← JWT + SecurityConfig
│           └── resources/
│               ├── application.properties                ← DB + JWT config
│               ├── schema-h2.sql                         ← H2 schema (reference)
│               └── data-h2.sql                           ← Seed data (reference)
│
└── frontend/                             ← React/Vite project
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── .env                              ← VITE_API_BASE_URL
    └── src/
        ├── App.jsx                       ← Router + ProtectedRoute setup
        ├── main.jsx                      ← React entry point
        ├── index.css                     ← Global styles
        ├── components/                   ← Reusable UI components
        │   ├── Layout.jsx
        │   ├── Navbar.jsx
        │   ├── Sidebar.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── Modal.jsx
        │   ├── Loading.jsx
        │   ├── ErrorMessage.jsx
        │   └── StatusBadge.jsx
        ├── context/
        │   └── AuthContext.jsx           ← Global auth state
        ├── pages/                        ← Application pages
        │   ├── Login.jsx
        │   ├── Dashboard.jsx
        │   ├── Patients.jsx
        │   ├── Doctors.jsx
        │   ├── Departments.jsx
        │   ├── Availability.jsx
        │   ├── Appointments.jsx
        │   ├── AppointmentHistory.jsx
        │   ├── Queue.jsx
        │   ├── Reports.jsx
        │   └── AuditLogs.jsx
        ├── services/                     ← Axios API service layer
        │   ├── api.js                    ← Axios instance + interceptors
        │   ├── authService.js
        │   ├── patientService.js
        │   ├── doctorService.js
        │   ├── departmentService.js
        │   ├── availabilityService.js
        │   ├── appointmentService.js
        │   ├── queueService.js
        │   ├── dashboardService.js
        │   ├── auditService.js
        │   └── reportsService.js
        └── utils/
            └── reportExportUtils.js      ← PDF & Excel generators
```

---

## Database

- **Server:** localhost
- **Port:** 3306
- **Database Name:** `health_care_operations_db`
- **Username:** `root`
- **Password:** *(contact project owner — not documented here)*

### Database Tables

| Table | Purpose |
|:------|:--------|
| `roles` | User role definitions (ADMIN, RECEPTIONIST, DOCTOR, MANAGER) |
| `users` | Staff login accounts with BCrypt passwords |
| `departments` | Hospital departments with operating hours |
| `doctors` | Doctor profiles linked to users and departments |
| `doctor_availability` | Weekly availability and shift schedules |
| `doctor_leave` | Leave applications (dates, sessions, reasons) |
| `patients` | Patient demographic records |
| `appointment_types` | Consultation types with duration and fees |
| `priority_rules` | Priority weights for queue ordering |
| `appointments` | Appointment bookings |
| `appointment_history` | Status change history for each appointment |
| `queue_entries` | Live queue with tokens, positions, wait times |
| `audit_logs` | System-wide action audit trail |

---

## Backend Setup

### Prerequisites
- Java 21 (JDK)
- Maven 3.6+
- MySQL 8.x running on port 3306
- Database `health_care_operations_db` created and seeded

### Steps
```powershell
# Navigate to backend project
cd backend\health_care_operations

# Run Spring Boot
mvn spring-boot:run
```

Backend starts on: `http://localhost:8081`
API base URL: `http://localhost:8081/api/v1`

---

## Frontend Setup

### Prerequisites
- Node.js 18+
- npm 9+

### Steps
```powershell
# Navigate to frontend
cd frontend

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev
```

Frontend runs on: `http://localhost:3000`

---

## Authentication

- Type: **JWT Bearer Token**
- Login endpoint: `POST /api/v1/auth/login`
- Token lifetime: **24 hours**
- Token storage: `localStorage` key `medqueue_token`
- User info storage: `localStorage` key `medqueue_user`

### Login Request
```json
{
  "username": "admin",
  "password": "admin123"
}
```

### Login Response
```json
{
  "token": "eyJhbGci...",
  "type": "Bearer",
  "userId": 1,
  "username": "admin",
  "fullName": "System Administrator",
  "email": "admin@hospital.org",
  "role": "ADMIN",
  "doctorId": null
}
```

---

## Available User Roles

| Role | Description |
|:-----|:------------|
| `ADMIN` | Full system access |
| `RECEPTIONIST` | Patient and appointment management |
| `DOCTOR` | Own appointments, queue, availability |
| `MANAGER` | Reports, analytics, audit logs |

---

## Test Accounts

| Username | Password | Role |
|:---------|:---------|:-----|
| admin | admin123 | ADMIN |
| receptionist1 | receptionist123 | RECEPTIONIST |
| dr.smith | doctor123 | DOCTOR (Cardiology) |
| dr.clark | doctor123 | DOCTOR (Orthopedics) |
| manager1 | manager123 | MANAGER |

> See `TEST_ACCOUNTS.md` for full details.

---

## API Base URL

```
http://localhost:8081/api/v1
```

All endpoints are prefixed with this base URL.
See `API_DOCUMENTATION.md` for full endpoint list.

---

## Reports & Export

The Reports page (Admin/Manager only) provides:

### Available Report Sections
- KPI Summary Cards (Total, Completed, Cancelled, Queue, Utilization)
- Appointment Status Distribution (Pie Chart)
- Department Workload (Bar Chart)
- Doctor Utilization Ledger (Table)
- Live Queue & Waiting Statistics
- Cancellation Log

### Filters
- Current Month
- Previous Month
- Today
- Custom Date Range

### Export Options
| Format | Library | Output |
|:-------|:--------|:-------|
| Print | Browser `window.print()` | A4-formatted printout |
| PDF | jsPDF + jspdf-autotable | Multi-section PDF report |
| Excel | ExcelJS | 6-worksheet .xlsx file |

---

## Troubleshooting

### Backend won't start
- Ensure MySQL is running on port 3306
- Verify database `health_care_operations_db` exists
- Check `application.properties` has correct MySQL password
- Check port 8081 is not occupied (see `START_PROJECT.md`)

### Frontend API calls fail (CORS / 401)
- Confirm backend is running on port 8081
- Check `.env` has `VITE_API_BASE_URL=http://localhost:8081/api/v1`
- Re-login if JWT token has expired (24h)

### Port 8080 conflict
- Backend is configured on port **8081** (8080 may be occupied by Oracle TNS)
- Frontend proxy in `vite.config.js` points to port 8081

### MySQL root password
- Not documented in this README
- Found in `backend/health_care_operations/src/main/resources/application.properties`
- Ask the project owner for the value

---

## Testing Checklist

See `TESTING_GUIDE.md` for complete step-by-step test cases.

Quick smoke test:
- [ ] MySQL running and database populated
- [ ] Backend starts on port 8081
- [ ] Frontend starts on port 3000
- [ ] Login works with `admin / admin123`
- [ ] Dashboard loads with real data
- [ ] Patients page shows patient list
- [ ] Appointments page shows bookings
- [ ] Queue page shows live queue
- [ ] Reports page loads and exports PDF/Excel

---

## Important Files

| File | Location | Purpose |
|:-----|:---------|:--------|
| `application.properties` | `backend/.../resources/` | DB + JWT config |
| `.env` | `frontend/` | API base URL |
| `API_DOCUMENTATION.md` | Project root | API endpoint reference |
| `DATABASE_DOCUMENTATION.md` | Project root | DB schema reference |
| `TESTING_GUIDE.md` | Project root | QA test cases |
| `TEST_ACCOUNTS.md` | Project root | Login credentials |
| `START_PROJECT.md` | Project root | Startup commands |
| `BUG_REPORT.md` | Project root | Bug report template |
