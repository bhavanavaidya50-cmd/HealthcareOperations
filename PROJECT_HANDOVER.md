# Project Handover — Healthcare Operations Platform

**MedQueue PRO** — Healthcare Appointment Capacity & Queue Management

Date: 2025
Status: Development Complete — Ready for End-to-End Testing

---

## Project Overview

MedQueue PRO is a full-stack web application for hospital appointment and queue management.

It provides:
- JWT-authenticated login for 4 staff roles (Admin, Receptionist, Doctor, Manager)
- Patient registration and appointment booking
- Doctor availability and shift scheduling
- Real-time queue management with token-based check-in and priority ordering
- Live capacity analytics, utilization reports, PDF and Excel exports
- Full audit log of all system operations

---

## THE APPLICATION IS DEVELOPMENT-COMPLETE.
## THE REMAINING TASK IS END-TO-END TESTING AND BUG VERIFICATION.

---

## Technology Stack

| Layer | Technology |
|:------|:-----------|
| Frontend | React 18 + Vite 6 |
| Styling | Tailwind CSS 3 |
| HTTP Client | Axios |
| Charts | Recharts |
| PDF Export | jsPDF + jspdf-autotable |
| Excel Export | ExcelJS |
| Routing | React Router v6 |
| Backend | Spring Boot 3 (Java 21) |
| Security | Spring Security + JWT |
| ORM | Hibernate/JPA |
| Raw SQL | JDBC (AnalyticsJdbcRepository) |
| Database | MySQL 8 |
| Build | Maven |

---

## How to Run the Project

### 1. Start MySQL
Ensure MySQL is running on port 3306 with database `health_care_operations_db`.

### 2. Start Backend
```powershell
cd backend\health_care_operations
mvn spring-boot:run
```
Backend: http://localhost:8081

### 3. Start Frontend
```powershell
cd frontend
npm install
npm run dev
```
Frontend: http://localhost:3000

See `START_PROJECT.md` for full details and troubleshooting.

---

## URLs

| Service | URL |
|:--------|:----|
| Frontend | http://localhost:3000 |
| API Base | http://localhost:8081/api/v1 |
| MySQL | localhost:3306 |
| Database | health_care_operations_db |

---

## Test Credentials

| Username | Password | Role |
|:---------|:---------|:-----|
| admin | admin123 | ADMIN |
| receptionist1 | receptionist123 | RECEPTIONIST |
| dr.smith | doctor123 | DOCTOR (Cardiology) |
| dr.clark | doctor123 | DOCTOR (Orthopedics) |
| manager1 | manager123 | MANAGER |

See `TEST_ACCOUNTS.md` for full role access matrix.

---

## Database Setup

Database `health_care_operations_db` is already:
- Created in MySQL
- Schema deployed (Hibernate DDL auto=update manages it)
- Seed data loaded (5 departments, 5 users, 2 doctors, 3 patients, appointments)

Do NOT drop or recreate the database before testing.

---

## What Is Already Completed

### Backend (Spring Boot)
- JWT authentication system (login, token validation, role extraction)
- Spring Security RBAC (per-endpoint role enforcement)
- All REST controllers and service layers
- Hibernate/JPA entity mapping for all 13 tables
- JDBC analytics repository for utilization/queue queries
- Slot recommendation engine (conflict detection, capacity enforcement)
- Priority queue engine (EMERGENCY > SENIOR > STANDARD > WALK_IN)
- Appointment lifecycle (Book → Check-in → Consult → Complete/Cancel/Reschedule)
- Audit logging on all major operations

### Frontend (React)
- Role-based login with JWT token management
- Protected routing with role enforcement
- Dashboard with real KPIs and charts
- Patients CRUD (add, edit, view, search)
- Doctors management (list, add, edit by department)
- Departments management (list, add)
- Doctor availability (shift view, leave request)
- Appointment booking with available slot picker
- Appointment management (cancel, reschedule)
- Live queue (check-in, call-next, complete, skip)
- Appointment history for doctors
- Reports page with real data (KPIs, charts, tables)
- Print functionality (A4 CSS print media)
- PDF export (jsPDF + autotable, multi-section)
- Excel export (ExcelJS, 6 worksheets)
- Audit logs (filterable table)

---

## What Needs Testing

Your job is to run end-to-end functional tests on all modules.

Priority test areas:
1. Login with all 4 roles — verify role-based navigation
2. Patient CRUD — add, edit, view, search
3. Doctor management — add, view doctors with departments
4. Appointment booking — select patient, doctor, date, available slot
5. Appointment cancel and reschedule workflows
6. Queue check-in → call-next → complete/skip
7. Reports — verify data loads, print, PDF, Excel
8. Unauthorized access — verify role restrictions
9. Invalid login — verify error message
10. Dashboard metrics — verify KPIs reflect real database data

See `TESTING_GUIDE.md` for complete test cases with expected results.

---

## Important Configuration Files

| File | Location | Contains |
|:-----|:---------|:--------|
| `application.properties` | `backend/.../resources/` | MySQL credentials, JWT secret, port |
| `.env` | `frontend/` | API base URL |
| `vite.config.js` | `frontend/` | Dev server port and proxy |

### ⚠️ Secrets NOT to Share Publicly

The following files contain sensitive values. Do NOT push to public repositories:

| File | Contains |
|:-----|:--------|
| `backend/.../application.properties` | MySQL root password, JWT secret key |
| `frontend/.env` | API base URL (low sensitivity, but keep local) |

An `.env.example` file with placeholder values has been created in the frontend folder.

---

## How Reports / Export Work

The Reports page is visible to ADMIN and MANAGER roles only.

It aggregates data from 7 backend endpoints:
- `/appointments` — appointment list for date filtering
- `/analytics/status-summary` — status counts
- `/analytics/live-queue-summary` — queue KPIs
- `/analytics/doctor-utilization` — physician capacity
- `/analytics/department-load` — department workload
- `/departments` — fallback enrichment
- `/doctors` — fallback enrichment

Exports:
- **Print:** Browser window.print() with A4 print CSS (hides UI chrome)
- **PDF:** jsPDF generates multi-page A4 PDF with tables
- **Excel:** ExcelJS generates 6-worksheet .xlsx workbook

---

## Build Verification

Last verified build results:

**Frontend (npm run build):**
- Exit code: 0 (success)
- Modules: 2,539 transformed
- Output: dist/ folder (~2.18 MB bundle)
- Errors: 0

**Backend (mvn test):**
- Note: Backend has H2 in-memory test profile (application-h2.properties)
- Test results: verify with `mvn test` after setup

---

## Known Limitations

1. **Reports date filter:** Custom date range filtering works on the frontend but depends on all appointments being returned from the backend. Very large datasets may need pagination.

2. **Queue aggregation:** When no doctorId filter is applied, the frontend calls queue for all known doctor IDs. Adding many doctors may increase load time.

3. **No password change UI:** There is no user-facing password change form. Password changes must be done directly in MySQL.

4. **Doctor user creation:** Creating a new doctor requires the user account to already exist in the `users` table. There is no combined "create doctor + user" form.

5. **Excel chunk size:** ExcelJS produces large files for very large appointment datasets. This is a known ExcelJS behavior.

---

## Where to Report Bugs

Use the `BUG_REPORT.md` template to document any issues found during testing.

Fill in:
- Bug ID (sequential: BUG-001, BUG-002, ...)
- Module affected
- Steps to reproduce
- Expected vs actual result
- Browser and console errors
- Severity level (Critical / Major / Minor / Cosmetic)

---

## Key Files Quick Reference

| File | Purpose |
|:-----|:--------|
| `README.md` | Complete project documentation |
| `START_PROJECT.md` | Exact PowerShell startup commands |
| `TESTING_GUIDE.md` | 26 test categories, step-by-step |
| `TEST_ACCOUNTS.md` | All login credentials |
| `API_DOCUMENTATION.md` | All REST endpoints documented |
| `DATABASE_DOCUMENTATION.md` | All 13 tables documented |
| `PROJECT_STRUCTURE.md` | Annotated folder structure |
| `BUG_REPORT.md` | Bug reporting template |
| `frontend/.env` | API base URL config |
| `backend/.../application.properties` | MySQL + JWT config |

---

## Contact

Backend developer: [your friend who built Spring Boot + MySQL]
Frontend developer: [you — built React + Vite + Axios + reports]
