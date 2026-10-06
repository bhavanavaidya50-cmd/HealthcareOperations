# Database Documentation — Healthcare Operations Platform

Database: `health_care_operations_db`
Server: localhost:3306
Engine: MySQL 8.x
ORM: Hibernate/JPA (Spring Boot)

---

## Entity Relationship Overview

```
roles ──────────────────────────── users
                                      │
                       ┌──────────────┘
                       │
               ┌───── doctors ──────── doctor_availability
               │           │
               │           └────────── doctor_leave
               │
departments ───┘
     │
     └─── appointments ─────── patients
               │
               ├─── appointment_types
               ├─── appointment_history
               └─── queue_entries ─── priority_rules

audit_logs (system-wide, linked to users)
```

---

## Table Reference

---

### Table: `roles`

Defines the four user roles in the system.

| Column | Type | Constraints | Description |
|:-------|:-----|:------------|:------------|
| id | BIGINT | PK, AUTO_INCREMENT | Role ID |
| role_name | VARCHAR(50) | NOT NULL, UNIQUE | Role name |

**Seed Data:**
| id | role_name |
|:---|:----------|
| 1 | ADMIN |
| 2 | RECEPTIONIST |
| 3 | DOCTOR |
| 4 | MANAGER |

---

### Table: `users`

Hospital staff accounts (login credentials + role assignment).

| Column | Type | Constraints | Description |
|:-------|:-----|:------------|:------------|
| id | BIGINT | PK, AUTO_INCREMENT | User ID |
| username | VARCHAR(100) | NOT NULL, UNIQUE | Login username |
| password_hash | VARCHAR(255) | NOT NULL | BCrypt hashed password |
| role_id | BIGINT | FK → roles.id | Assigned role |
| full_name | VARCHAR(150) | NOT NULL | Display name |
| email | VARCHAR(150) | NOT NULL, UNIQUE | Email address |
| phone | VARCHAR(25) | — | Contact phone |
| is_active | BOOLEAN | DEFAULT TRUE | Account active flag |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Account creation time |

**Foreign Keys:**
- `role_id` → `roles.id`

---

### Table: `departments`

Hospital departments with operating schedules.

| Column | Type | Constraints | Description |
|:-------|:-----|:------------|:------------|
| id | BIGINT | PK, AUTO_INCREMENT | Department ID |
| name | VARCHAR(100) | NOT NULL, UNIQUE | Department name |
| description | TEXT | — | Department description |
| operating_hours_start | TIME | NOT NULL, DEFAULT '08:00:00' | Daily opening time |
| operating_hours_end | TIME | NOT NULL, DEFAULT '20:00:00' | Daily closing time |
| is_active | BOOLEAN | DEFAULT TRUE | Department active flag |

**Seeded departments:**
- Cardiology (08:00–18:00)
- Orthopedics (08:30–17:30)
- General Medicine (08:00–20:00)
- Pediatrics (09:00–17:00)
- Dermatology (09:00–16:00)

---

### Table: `doctors`

Doctor profiles linked to user accounts and departments.

| Column | Type | Constraints | Description |
|:-------|:-----|:------------|:------------|
| id | BIGINT | PK, AUTO_INCREMENT | Doctor ID |
| user_id | BIGINT | FK → users.id, UNIQUE | Linked user account |
| department_id | BIGINT | FK → departments.id | Assigned department |
| specialization | VARCHAR(150) | NOT NULL | Medical specialization |
| consultation_fee | DECIMAL(10,2) | DEFAULT 50.00 | Fee per consultation |
| status | VARCHAR(30) | DEFAULT 'ACTIVE' | ACTIVE or INACTIVE |

**Foreign Keys:**
- `user_id` → `users.id` ON DELETE CASCADE
- `department_id` → `departments.id`

---

### Table: `doctor_availability`

Weekly shift schedule for each doctor.

| Column | Type | Constraints | Description |
|:-------|:-----|:------------|:------------|
| id | BIGINT | PK, AUTO_INCREMENT | Availability record ID |
| doctor_id | BIGINT | FK → doctors.id | Doctor reference |
| day_of_week | VARCHAR(15) | NOT NULL | MONDAY, TUESDAY, etc. |
| start_time | TIME | NOT NULL | Shift start |
| end_time | TIME | NOT NULL | Shift end |
| break_start_time | TIME | — | Break start |
| break_end_time | TIME | — | Break end |
| max_capacity_per_day | INT | DEFAULT 20 | Max appointments per day |

**Foreign Keys:**
- `doctor_id` → `doctors.id` ON DELETE CASCADE

---

### Table: `doctor_leave`

Leave requests and approved absences for doctors.

| Column | Type | Constraints | Description |
|:-------|:-----|:------------|:------------|
| id | BIGINT | PK, AUTO_INCREMENT | Leave ID |
| doctor_id | BIGINT | FK → doctors.id | Doctor reference |
| leave_date | DATE | NOT NULL | Date of leave |
| session_type | VARCHAR(30) | DEFAULT 'FULL_DAY' | FULL_DAY, MORNING, AFTERNOON |
| reason | VARCHAR(255) | — | Reason for leave |
| status | VARCHAR(30) | DEFAULT 'APPROVED' | PENDING, APPROVED, REJECTED |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | When request was created |

**Foreign Keys:**
- `doctor_id` → `doctors.id` ON DELETE CASCADE

---

### Table: `patients`

Patient demographic records.

| Column | Type | Constraints | Description |
|:-------|:-----|:------------|:------------|
| id | BIGINT | PK, AUTO_INCREMENT | Patient ID |
| patient_code | VARCHAR(50) | NOT NULL, UNIQUE | Patient code (e.g., PAT-001) |
| first_name | VARCHAR(100) | NOT NULL | First name |
| last_name | VARCHAR(100) | NOT NULL | Last name |
| gender | VARCHAR(15) | NOT NULL | MALE, FEMALE, OTHER |
| date_of_birth | DATE | NOT NULL | Date of birth |
| phone | VARCHAR(25) | NOT NULL, UNIQUE | Contact phone |
| email | VARCHAR(150) | — | Email address |
| blood_group | VARCHAR(10) | — | Blood group (O+, A+, etc.) |
| address | TEXT | — | Home address |
| emergency_contact | VARCHAR(100) | — | Emergency contact info |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Registration date |

---

### Table: `appointment_types`

Predefined types of medical consultations.

| Column | Type | Constraints | Description |
|:-------|:-----|:------------|:------------|
| id | BIGINT | PK, AUTO_INCREMENT | Type ID |
| type_name | VARCHAR(100) | NOT NULL, UNIQUE | Consultation type name |
| duration_minutes | INT | DEFAULT 30 | Duration of appointment |
| default_fee | DECIMAL(10,2) | DEFAULT 50.00 | Default fee |

**Seeded Types:**
| id | type_name | duration_minutes | default_fee |
|:---|:----------|:-----------------|:-----------|
| 1 | General Consultation | 30 | 40.00 |
| 2 | Follow-up Consultation | 15 | 25.00 |
| 3 | Specialist Examination | 45 | 80.00 |
| 4 | Comprehensive Health Checkup | 60 | 120.00 |

---

### Table: `priority_rules`

Priority weights for queue ordering.

| Column | Type | Constraints | Description |
|:-------|:-----|:------------|:------------|
| id | BIGINT | PK, AUTO_INCREMENT | Rule ID |
| category_name | VARCHAR(50) | NOT NULL, UNIQUE | Priority category |
| priority_weight | INT | DEFAULT 10 | Higher = higher priority |
| description | TEXT | — | Rule description |

**Seeded Rules:**
| category_name | priority_weight |
|:--------------|:---------------|
| EMERGENCY | 100 |
| SENIOR_CITIZEN | 50 |
| SCHEDULED_STANDARD | 10 |
| WALK_IN | 5 |

---

### Table: `appointments`

Main appointment bookings table.

| Column | Type | Constraints | Description |
|:-------|:-----|:------------|:------------|
| id | BIGINT | PK, AUTO_INCREMENT | Appointment ID |
| appointment_number | VARCHAR(60) | NOT NULL, UNIQUE | Human-readable appointment code |
| patient_id | BIGINT | FK → patients.id | Patient reference |
| doctor_id | BIGINT | FK → doctors.id | Doctor reference |
| department_id | BIGINT | FK → departments.id | Department reference |
| appointment_type_id | BIGINT | FK → appointment_types.id | Consultation type |
| scheduled_start_time | DATETIME | NOT NULL | Appointment start |
| scheduled_end_time | DATETIME | NOT NULL | Appointment end |
| status | VARCHAR(30) | DEFAULT 'CONFIRMED' | SCHEDULED, IN_CONSULTATION, COMPLETED, CANCELLED, RESCHEDULED, MISSED |
| priority_category | VARCHAR(50) | DEFAULT 'SCHEDULED' | Priority level |
| reason_for_visit | TEXT | — | Patient's stated reason |
| doctor_notes | TEXT | — | Post-consultation notes |
| created_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Booking timestamp |
| updated_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | Last update timestamp |

**Foreign Keys:**
- `patient_id` → `patients.id`
- `doctor_id` → `doctors.id`
- `department_id` → `departments.id`
- `appointment_type_id` → `appointment_types.id`

---

### Table: `appointment_history`

Tracks every status change made to an appointment.

| Column | Type | Constraints | Description |
|:-------|:-----|:------------|:------------|
| id | BIGINT | PK, AUTO_INCREMENT | History record ID |
| appointment_id | BIGINT | FK → appointments.id | Appointment reference |
| previous_status | VARCHAR(30) | — | Status before change |
| new_status | VARCHAR(30) | NOT NULL | Status after change |
| changed_by_user_id | BIGINT | — | User who made the change |
| reason | VARCHAR(255) | — | Reason for change |
| changed_at | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | When change was made |

**Foreign Keys:**
- `appointment_id` → `appointments.id` ON DELETE CASCADE

---

### Table: `queue_entries`

Live queue management with token numbers and wait time tracking.

| Column | Type | Constraints | Description |
|:-------|:-----|:------------|:------------|
| id | BIGINT | PK, AUTO_INCREMENT | Queue entry ID |
| appointment_id | BIGINT | FK → appointments.id, UNIQUE | Linked appointment |
| doctor_id | BIGINT | FK → doctors.id | Doctor's queue |
| token_number | VARCHAR(30) | NOT NULL | Displayed token (e.g., T-001) |
| queue_position | INT | DEFAULT 1 | Position in queue |
| queue_status | VARCHAR(30) | DEFAULT 'WAITING' | WAITING, IN_CONSULTATION, COMPLETED, SKIPPED |
| priority_rule_id | BIGINT | FK → priority_rules.id | Priority assignment |
| checked_in_at | DATETIME | DEFAULT CURRENT_TIMESTAMP | Check-in time |
| consultation_started_at | DATETIME | — | When doctor started |
| consultation_ended_at | DATETIME | — | When consultation ended |
| estimated_wait_minutes | INT | DEFAULT 0 | Estimated wait in minutes |

**Foreign Keys:**
- `appointment_id` → `appointments.id` ON DELETE CASCADE
- `doctor_id` → `doctors.id` ON DELETE CASCADE

---

### Table: `audit_logs`

System-wide activity audit trail.

| Column | Type | Constraints | Description |
|:-------|:-----|:------------|:------------|
| id | BIGINT | PK, AUTO_INCREMENT | Log entry ID |
| user_id | BIGINT | — | User who performed the action |
| action_type | VARCHAR(60) | NOT NULL | Action identifier (e.g., APPOINTMENT_BOOKED) |
| entity_name | VARCHAR(60) | NOT NULL | Entity affected (Appointment, Patient, etc.) |
| entity_id | BIGINT | — | ID of affected entity |
| details_json | TEXT | — | Human-readable detail string |
| ip_address | VARCHAR(45) | — | Client IP address |
| timestamp | TIMESTAMP | DEFAULT CURRENT_TIMESTAMP | When action occurred |

---

## Key Relationships Summary

| Relationship | Type | Description |
|:-------------|:-----|:------------|
| users → roles | Many-to-One | Each user has one role |
| doctors → users | One-to-One | Each doctor is a user |
| doctors → departments | Many-to-One | Each doctor belongs to one department |
| doctor_availability → doctors | Many-to-One | Multiple schedules per doctor |
| doctor_leave → doctors | Many-to-One | Multiple leaves per doctor |
| appointments → patients | Many-to-One | Many appointments per patient |
| appointments → doctors | Many-to-One | Many appointments per doctor |
| appointments → departments | Many-to-One | Many appointments per department |
| appointments → appointment_types | Many-to-One | Each appointment has a type |
| appointment_history → appointments | Many-to-One | Many history records per appointment |
| queue_entries → appointments | One-to-One | One queue entry per appointment |
| queue_entries → doctors | Many-to-One | Many queue entries per doctor |
| queue_entries → priority_rules | Many-to-One | One priority rule per queue entry |
