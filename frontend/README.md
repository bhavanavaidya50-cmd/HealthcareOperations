# Healthcare Appointment Capacity & Queue Management Platform (Frontend)

A clean, responsive, modern healthcare operations web application built with **React**, **Vite**, **Tailwind CSS**, **Axios**, and **Recharts**.

---

## 1. Technology Stack
- **Core**: React 18, Vite 6, JavaScript (ES Modules)
- **Routing**: React Router DOM (v6) with Protected Role Guards
- **Styling**: Tailwind CSS (Medical Teal/Cyan/Slate Theme)
- **Icons**: Lucide React
- **Analytics & Charts**: Recharts (Responsive Container, BarChart, PieChart)
- **HTTP Client**: Axios with Centralized Request/Response Interceptors

---

## 2. Frontend Folder Structure
```
frontend/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── ErrorMessage.jsx       # Standardized error alerts with retry
│   │   ├── Layout.jsx             # Unified shell (Sidebar + Navbar + Content)
│   │   ├── Loading.jsx            # Medical pulse loader
│   │   ├── Modal.jsx              # Backdrop blur modal dialog
│   │   ├── Navbar.jsx             # Header, user badge & quick demo role switcher
│   │   ├── ProtectedRoute.jsx     # Session & role-based route guard
│   │   ├── Sidebar.jsx            # Role-filtered medical navigation
│   │   └── StatusBadge.jsx        # Standardized color-coded status badges
│   │
│   ├── pages/
│   │   ├── AppointmentHistory.jsx # Completed, Cancelled, Missed records
│   │   ├── Appointments.jsx       # Complete booking workflow & smart slots
│   │   ├── AuditLogs.jsx          # Security & compliance event trails
│   │   ├── Availability.jsx       # Doctor shifts, working days & leave calendar
│   │   ├── Dashboard.jsx          # Role-adaptive KPI dashboard & Recharts
│   │   ├── Departments.jsx        # Hospital wings & daily capacity limits
│   │   ├── Doctors.jsx            # Physician roster & consultation durations
│   │   ├── Login.jsx              # Authentication page with demo quick logins
│   │   ├── Patients.jsx           # UHID registry, search & patient registration
│   │   ├── Queue.jsx              # Live queue board, patient token view & triage
│   │   └── Reports.jsx            # Capacity reports & cancellation root cause analysis
│   │
│   ├── services/
│   │   ├── api.js                 # Centralized Axios instance with JWT interceptor
│   │   ├── appointmentService.js  # Booking, rescheduling, cancellation, slots
│   │   ├── auditService.js        # Audit logging service
│   │   ├── authService.js         # Spring Boot login & session management
│   │   ├── availabilityService.js # Physician shift & leave service
│   │   ├── dashboardService.js    # KPIs, utilization & workload analytics
│   │   ├── departmentService.js   # Department listing & creation
│   │   ├── doctorService.js       # Doctor roster service
│   │   ├── mockData.js            # Initial realistic mock fallback store
│   │   ├── patientService.js      # Patient UHID CRUD service
│   │   └── queueService.js        # Live queue token & waiting time calculations
│   │
│   ├── context/
│   │   └── AuthContext.jsx        # Global auth state & academic demo role switcher
│   │
│   ├── App.jsx                    # Routing table with role-level guards
│   ├── main.jsx                   # React root mount
│   └── index.css                  # Tailwind styles, custom scrollbar & fonts
│
├── .env                           # Environment configuration
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

---

## 3. Spring Boot REST API Endpoints Used

| Module | HTTP Method | Target Backend Endpoint | Description |
|---|---|---|---|
| **Auth** | `POST` | `/api/v1/auth/login` | Username/password login & JWT token return |
| **Patients** | `GET` | `/api/v1/patients` | Search & list registered patients |
| **Patients** | `POST` | `/api/v1/patients` | Register new patient (UHID) |
| **Patients** | `PUT` | `/api/v1/patients/{id}` | Update patient medical record |
| **Departments** | `GET` | `/api/v1/departments` | List hospital departments & capacities |
| **Departments** | `POST` | `/api/v1/departments` | Create new department |
| **Doctors** | `GET` | `/api/v1/doctors` | List doctors (filter by department) |
| **Doctors** | `POST` | `/api/v1/doctors` | Add new consulting physician |
| **Availability** | `GET` | `/api/v1/doctors/{id}/availability` | Fetch working hours, shifts & leaves |
| **Availability** | `PUT` | `/api/v1/doctors/{id}/availability` | Update working days, shift start/end & breaks |
| **Availability** | `POST` | `/api/v1/doctors/{id}/leaves` | Schedule physician leave |
| **Appointments** | `GET` | `/api/v1/appointments` | Filter appointments by date/status/doctor |
| **Appointments** | `GET` | `/api/v1/appointments/recommended-slots` | Smart recommended capacity slots |
| **Appointments** | `POST` | `/api/v1/appointments` | Confirm and book appointment |
| **Appointments** | `PUT` | `/api/v1/appointments/{id}/cancel` | Cancel booking and release capacity |
| **Appointments** | `PUT` | `/api/v1/appointments/{id}/reschedule` | Reschedule booking to new slot |
| **Appointments** | `GET` | `/api/v1/appointments/history` | Historical archive records |
| **Queue** | `GET` | `/api/v1/queue` | Live active queue tokens |
| **Queue** | `PUT` | `/api/v1/queue/{id}/call` | Call patient into consultation |
| **Queue** | `PUT` | `/api/v1/queue/{id}/complete` | Mark consultation completed |
| **Queue** | `PUT` | `/api/v1/queue/{id}/priority` | Triage priority escalation (Emergency/Senior) |
| **Queue** | `POST` | `/api/v1/queue/generate-token` | Generate queue token upon check-in |
| **Analytics** | `GET` | `/api/v1/analytics/dashboard` | Key hospital operational KPI counts |
| **Analytics** | `GET` | `/api/v1/analytics/doctor-utilisation` | Physician utilization rates |
| **Analytics** | `GET` | `/api/v1/analytics/department-workload` | Department patient vs capacity limit |
| **Analytics** | `GET` | `/api/v1/analytics/cancellations` | Root-cause cancellation statistics |
| **Audit** | `GET` | `/api/v1/audit-logs` | Retrieve chronological audit trail |

> **Graceful Fallback**: If the Spring Boot backend or MySQL database is not currently running, every service automatically falls back to an interactive local state store, logging the endpoint integration point in the browser console. This ensures zero downtime during academic viva or grading.

---

## 4. Role-Based Navigation & Demo Credentials

| Role | Username | Password | Permitted Navigation |
|---|---|---|---|
| **ADMIN** | `admin` | `password123` | Dashboard, Patients, Doctors, Departments, Availability, Appointments, Queue, Reports, Audit Logs |
| **RECEPTIONIST** | `receptionist` | `password123` | Dashboard, Patients, Appointments, Queue |
| **DOCTOR** | `doctor` | `password123` | Dashboard, My Appointments, My Queue, Appointment History, Availability |
| **MANAGER** | `manager` | `password123` | Dashboard, Appointments, Queue, Reports, Audit Logs |

*Tip: You can use the **Switch Role** pill in the top navbar anytime for instant testing across roles!*

---

## 5. How to Run Frontend

### Step 1: Install Dependencies
```bash
cd frontend
npm install
```

### Step 2: Configure Backend URL
Create or edit `.env` in the `frontend/` directory:
```env
VITE_API_BASE_URL=http://localhost:8080/api/v1
```

### Step 3: Start Vite Dev Server
```bash
npm run dev
```
Open your browser at: `http://localhost:3000` (or the port Vite outputs).

### Step 4: Build for Production
```bash
npm run build
```

---

## 6. Primary Demonstration Flow (Viva Checklist)
1. **Login**: Sign in as `admin` or use one of the one-click demo buttons.
2. **Dashboard**: Observe real-time KPI counters, Doctor Utilisation bar chart, Department Workload distribution, and today's status breakdown.
3. **Patient Registry**: Search existing patients or click **Register New Patient** (creates a new UHID).
4. **Physician Availability**: Switch to **Availability** &rarr; modify consultation hours, shifts, and view the doctor's approved leave calendar.
5. **Appointments & Smart Slots**: Click **Book New Consultation** &rarr; select Patient, Department, Doctor, Date &rarr; view **Backend Smart Recommended Slots** (marked with ⭐ Top Pick, duration, and capacity status) &rarr; Confirm booking.
6. **Queue Check-In**: Check in the scheduled appointment to generate a queue token.
7. **Queue Management**:
   - Inspect the **Patient Live Queue View** banner (*Your Token: CARD-101 | Patients Ahead: 0 | Estimated Waiting Time: 5 min (ESTIMATE)*).
   - Test **Call Next** &rarr; status transitions to *In Consultation*.
   - Test **Priority Override** &rarr; escalate a normal patient to *Emergency (P1)* and see immediate queue reordering.
   - Complete consultation.
8. **Cancellation & Rescheduling**: Open an appointment &rarr; test the **Cancel Appointment** modal with justification; test the **Reschedule** modal with new slot selection.
9. **Reports & Audit**: View root-cause cancellation analytics in **Reports**; inspect immutable operational events in **Audit Logs**.
