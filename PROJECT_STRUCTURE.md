# Project Structure — Healthcare Operations Platform

Complete annotated folder structure for the MedQueue PRO Healthcare Operations system.

---

## Root Layout

```
HealthcareOperations/
├── README.md                  ← Project overview and setup guide
├── START_PROJECT.md           ← Exact startup commands (Windows PowerShell)
├── TESTING_GUIDE.md           ← Step-by-step QA test cases
├── TEST_ACCOUNTS.md           ← All test login credentials
├── API_DOCUMENTATION.md       ← Full REST API reference
├── DATABASE_DOCUMENTATION.md  ← MySQL schema and table reference
├── PROJECT_STRUCTURE.md       ← This file
├── PROJECT_HANDOVER.md        ← Project handover summary
├── BUG_REPORT.md              ← Bug report template
│
├── backend/
│   └── health_care_operations/   ← Spring Boot Maven project
│
└── frontend/                     ← React + Vite project
```

---

## Backend Structure

```
backend/
└── health_care_operations/
    ├── pom.xml                    ← Maven dependencies (Spring Boot, JPA, MySQL, JWT)
    │
    └── src/
        └── main/
            ├── java/com/healthcare/
            │   │
            │   ├── HealthCareOperationsApplication.java
            │   │     ← Spring Boot entry point (@SpringBootApplication)
            │   │
            │   ├── controller/              ← REST API controllers (@RestController)
            │   │   ├── AuthController.java       POST /auth/login
            │   │   ├── PatientController.java    CRUD /patients
            │   │   ├── DoctorController.java     CRUD /doctors
            │   │   ├── DepartmentController.java CRUD /departments
            │   │   ├── AppointmentController.java CRUD + lifecycle /appointments
            │   │   ├── QueueController.java      /queue operations
            │   │   ├── AnalyticsController.java  /analytics/* reporting endpoints
            │   │   ├── AuditController.java      /audit-logs
            │   │   └── GlobalExceptionHandler.java  ← Centralized error responses
            │   │
            │   ├── service/                 ← Business logic layer (@Service)
            │   │   ├── AuthService.java          Login, JWT generation
            │   │   ├── PatientManagementService.java  Patient CRUD logic
            │   │   ├── DoctorManagementService.java   Doctor management
            │   │   ├── DepartmentService.java         Department management
            │   │   ├── AppointmentService.java        Booking, cancellation, reschedule
            │   │   ├── SlotRecommendationService.java Time-slot availability engine
            │   │   ├── QueueAndPriorityService.java   Queue + priority scoring
            │   │   ├── AnalyticsService.java          Analytics aggregation
            │   │   └── AuditService.java              Audit log recording
            │   │
            │   ├── repository/              ← Data access layer
            │   │   ├── UserRepository.java           Spring Data JPA
            │   │   ├── PatientRepository.java        Spring Data JPA
            │   │   ├── DoctorRepository.java         Spring Data JPA
            │   │   ├── DepartmentRepository.java     Spring Data JPA
            │   │   ├── AppointmentRepository.java    Spring Data JPA
            │   │   ├── AppointmentHistoryRepository.java  Spring Data JPA
            │   │   ├── AppointmentTypeRepository.java     Spring Data JPA
            │   │   ├── DoctorAvailabilityRepository.java  Spring Data JPA
            │   │   ├── DoctorLeaveRepository.java    Spring Data JPA
            │   │   ├── QueueEntryRepository.java     Spring Data JPA
            │   │   ├── AuditLogRepository.java       Spring Data JPA
            │   │   ├── PriorityRuleRepository.java   Spring Data JPA
            │   │   ├── RoleRepository.java           Spring Data JPA
            │   │   └── AnalyticsJdbcRepository.java  ← Raw JDBC for analytics queries
            │   │
            │   ├── entity/                  ← Hibernate JPA entities (@Entity)
            │   │   ├── User.java                Users table
            │   │   ├── Role.java                Roles table
            │   │   ├── Patient.java             Patients table
            │   │   ├── Doctor.java              Doctors table
            │   │   ├── Department.java          Departments table
            │   │   ├── DoctorAvailability.java  Doctor_availability table
            │   │   ├── DoctorLeave.java         Doctor_leave table
            │   │   ├── Appointment.java         Appointments table
            │   │   ├── AppointmentHistory.java  Appointment_history table
            │   │   ├── AppointmentType.java     Appointment_types table
            │   │   ├── QueueEntry.java          Queue_entries table
            │   │   ├── AuditLog.java            Audit_logs table
            │   │   └── PriorityRule.java        Priority_rules table
            │   │
            │   ├── dto/                     ← Data Transfer Objects
            │   │   ├── ApiResponse.java          Generic {success, message, data} wrapper
            │   │   ├── AuthRequest.java           {username, password}
            │   │   ├── AuthResponse.java          {token, userId, username, role, doctorId}
            │   │   ├── PatientDto.java            Patient request/response fields
            │   │   ├── DoctorDto.java             Doctor response fields
            │   │   ├── DepartmentDto.java         Department fields
            │   │   ├── DoctorAvailabilityDto.java Availability fields
            │   │   ├── DoctorLeaveDto.java        Leave request fields
            │   │   ├── AppointmentBookingRequest.java   Booking request body
            │   │   ├── AppointmentRescheduleRequest.java Reschedule request body
            │   │   ├── AppointmentResponseDto.java      Appointment response
            │   │   ├── SlotResponseDto.java        Available slot fields
            │   │   ├── QueueCheckInRequest.java    Queue check-in body
            │   │   └── QueueEntryResponseDto.java  Queue entry response
            │   │
            │   └── security/                ← Spring Security + JWT
            │       ├── SecurityConfig.java        ← RBAC rules, JWT filter setup
            │       ├── JwtTokenProvider.java      ← JWT sign, validate, parse
            │       ├── JwtAuthenticationFilter.java ← Extracts JWT from requests
            │       └── CustomUserDetailsService.java ← Loads user from DB
            │
            └── resources/
                ├── application.properties        ← Main config (DB, JWT, Hibernate)
                ├── application-h2.properties     ← H2 in-memory profile (testing)
                ├── schema-h2.sql                 ← DDL schema (reference/H2)
                └── data-h2.sql                   ← Seed data (reference/H2)
```

---

## Frontend Structure

```
frontend/
├── package.json               ← npm dependencies (React, Axios, jsPDF, ExcelJS...)
├── vite.config.js             ← Vite build config (proxy to port 8081)
├── tailwind.config.js         ← Tailwind CSS config
├── postcss.config.js          ← PostCSS (autoprefixer)
├── index.html                 ← HTML entry point
├── .env                       ← VITE_API_BASE_URL=http://localhost:8081/api/v1
│
└── src/
    ├── main.jsx               ← React app mount point (ReactDOM.render)
    ├── App.jsx                ← Router + ProtectedRoute + page routes
    ├── index.css              ← Global Tailwind + custom CSS
    │
    ├── context/
    │   └── AuthContext.jsx    ← Global auth state (login, logout, user, role)
    │                            Provides: user, role, token, login(), logout()
    │
    ├── components/            ← Reusable UI components
    │   ├── Layout.jsx         ← Page wrapper (Sidebar + Navbar + Outlet)
    │   ├── Navbar.jsx         ← Top navigation bar (user info, logout)
    │   ├── Sidebar.jsx        ← Role-based navigation menu
    │   ├── ProtectedRoute.jsx ← Route guard (checks login + allowedRoles)
    │   ├── Modal.jsx          ← Reusable modal dialog wrapper
    │   ├── Loading.jsx        ← Loading spinner component
    │   ├── ErrorMessage.jsx   ← Error display with retry button
    │   └── StatusBadge.jsx    ← Colored status badge (SCHEDULED, COMPLETED, etc.)
    │
    ├── pages/                 ← Full application pages
    │   ├── Login.jsx          ← Login form (calls authService.login)
    │   ├── Dashboard.jsx      ← KPI cards + utilization charts (Admin/All roles)
    │   ├── Patients.jsx       ← Patient CRUD table + search (Admin, Receptionist)
    │   ├── Doctors.jsx        ← Doctor list + add/edit (Admin only)
    │   ├── Departments.jsx    ← Department list + add (Admin only)
    │   ├── Availability.jsx   ← Doctor availability + leave management (Admin, Doctor)
    │   ├── Appointments.jsx   ← Book/cancel/reschedule appointments (All roles)
    │   ├── AppointmentHistory.jsx ← Historical appointment records (Doctor, Admin, Manager)
    │   ├── Queue.jsx          ← Live queue with check-in + call-next (All roles)
    │   ├── Reports.jsx        ← Analytics dashboard + PDF/Excel export (Admin, Manager)
    │   └── AuditLogs.jsx      ← System audit trail (Admin, Manager)
    │
    ├── services/              ← Axios API service layer (all backend calls here)
    │   ├── api.js             ← Axios instance with JWT interceptor + error handler
    │   ├── authService.js     ← login(), getCurrentUser(), logout()
    │   ├── patientService.js  ← getAllPatients, getById, create, update, getAppointments
    │   ├── doctorService.js   ← getAllDoctors, getById, getByDept, create, update
    │   ├── departmentService.js ← getAllDepartments, getById, create
    │   ├── availabilityService.js ← getDoctorAvailability, addDoctorLeave
    │   ├── appointmentService.js  ← getAll, getById, getSlots, create, cancel, reschedule, history
    │   ├── queueService.js    ← getQueue, callNext, complete, skip, generateToken(checkIn)
    │   ├── dashboardService.js ← getDashboardStats, getDoctorUtilisation, getDepartmentWorkload
    │   ├── auditService.js    ← getAuditLogs, logAction
    │   ├── reportsService.js  ← getReportData (aggregates 7+ endpoints)
    │   └── mockData.js        ← Legacy reference file (not used in production)
    │
    └── utils/
        └── reportExportUtils.js  ← generatePDFReport(), generateExcelReport()
                                     Uses jsPDF + jspdf-autotable + ExcelJS
```

---

## Key Configuration Files

### `frontend/.env`
```
VITE_API_BASE_URL=http://localhost:8081/api/v1
```
This tells Axios where to send all API requests. Change this if the backend port changes.

### `frontend/vite.config.js`
Vite development server config. Includes proxy settings and port 3000.

### `backend/.../application.properties`
```
server.port=8081
server.servlet.context-path=/api/v1
spring.datasource.url=jdbc:mysql://localhost:3306/health_care_operations_db
spring.jpa.hibernate.ddl-auto=update
app.jwt.secret=...
app.jwt.expiration-ms=86400000
```

### `backend/.../pom.xml`
Maven build descriptor. Contains all Java dependencies: Spring Boot, Spring Security,
Hibernate, MySQL Connector, JWT libraries, Lombok.

---

## Data Flow

```
User action in Browser
      ↓
React Page component
      ↓
Service file (e.g., appointmentService.js)
      ↓
api.js (Axios + JWT header injected automatically)
      ↓
Spring Boot Controller (@RestController)
      ↓
Service layer (business logic)
      ↓
Repository (JPA or JDBC)
      ↓
MySQL database
      ↓
Response flows back up the same chain
```

---

## Authentication Flow

```
Login form (Login.jsx)
      ↓
authService.login(username, password)
      ↓
POST /api/v1/auth/login
      ↓
Spring Security validates credentials
      ↓
JwtTokenProvider generates JWT
      ↓
Token stored in localStorage (medqueue_token)
User stored in localStorage (medqueue_user)
      ↓
AuthContext updates global state
      ↓
App redirects to /dashboard
      ↓
All subsequent API calls include: Authorization: Bearer <token>
```
