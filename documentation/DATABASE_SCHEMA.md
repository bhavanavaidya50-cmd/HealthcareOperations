# Database Schema & Data Dictionary

## 1. Entity-Relationship Overview

```mermaid
erDiagram
    ROLES ||--o{ USERS : "assigned to"
    DEPARTMENTS ||--o{ DOCTORS : "belongs to"
    USERS ||--o| DOCTORS : "profile for"
    DOCTORS ||--o{ DOCTOR_AVAILABILITY : "has schedule"
    DOCTORS ||--o{ DOCTOR_LEAVE : "has leave"
    PATIENTS ||--o{ APPOINTMENTS : "books"
    DOCTORS ||--o{ APPOINTMENTS : "attends"
    DEPARTMENTS ||--o{ APPOINTMENTS : "hosts"
    APPOINTMENT_TYPES ||--o{ APPOINTMENTS : "categorizes"
    APPOINTMENTS ||--o{ APPOINTMENT_HISTORY : "tracks lifecycle"
    APPOINTMENTS ||--o| QUEUE_ENTRIES : "enqueues"
    PRIORITY_RULES ||--o{ QUEUE_ENTRIES : "applies"
    USERS ||--o{ AUDIT_LOGS : "performs action"

    ROLES {
        bigint id PK
        varchar role_name UK "ADMIN, RECEPTIONIST, DOCTOR, MANAGER"
    }

    USERS {
        bigint id PK
        varchar username UK
        varchar password_hash
        bigint role_id FK
        varchar full_name
        varchar email UK
        varchar phone
        boolean is_active
        timestamp created_at
    }

    DEPARTMENTS {
        bigint id PK
        varchar name UK
        text description
        time operating_hours_start
        time operating_hours_end
        boolean is_active
    }

    DOCTORS {
        bigint id PK
        bigint user_id FK
        bigint department_id FK
        varchar specialization
        int consultation_fee
        varchar status "ACTIVE, ON_LEAVE, INACTIVE"
    }

    DOCTOR_AVAILABILITY {
        bigint id PK
        bigint doctor_id FK
        varchar day_of_week "MONDAY..SUNDAY"
        time start_time
        time end_time
        time break_start_time
        time break_end_time
        int max_capacity_per_day
    }

    DOCTOR_LEAVE {
        bigint id PK
        bigint doctor_id FK
        date leave_date
        varchar session_type "FULL_DAY, MORNING, AFTERNOON"
        varchar reason
        varchar status "APPROVED, PENDING, REJECTED"
        timestamp created_at
    }

    PATIENTS {
        bigint id PK
        varchar patient_code UK "P-2026-0001"
        varchar first_name
        varchar last_name
        varchar gender
        date date_of_birth
        varchar phone UK
        varchar email
        varchar blood_group
        text address
        text emergency_contact
        timestamp created_at
    }

    APPOINTMENT_TYPES {
        bigint id PK
        varchar type_name UK "General Consultation, Follow-up, Diagnostic Review"
        int duration_minutes "15, 30, 45, 60"
        decimal default_fee
    }

    APPOINTMENTS {
        bigint id PK
        varchar appointment_number UK "APT-2026-0001"
        bigint patient_id FK
        bigint doctor_id FK
        bigint department_id FK
        bigint appointment_type_id FK
        datetime scheduled_start_time
        datetime scheduled_end_time
        varchar status "CONFIRMED, IN_PROGRESS, COMPLETED, CANCELLED, RESCHEDULED, MISSED"
        varchar priority_category "EMERGENCY, SENIOR_CITIZEN, SCHEDULED, WALK_IN"
        text reason_for_visit
        text doctor_notes
        timestamp created_at
        timestamp updated_at
    }

    APPOINTMENT_HISTORY {
        bigint id PK
        bigint appointment_id FK
        varchar previous_status
        varchar new_status
        bigint changed_by_user_id FK
        varchar reason
        timestamp changed_at
    }

    PRIORITY_RULES {
        bigint id PK
        varchar category_name UK
        int priority_weight "Higher = Prioritized (e.g. 100, 50, 10)"
        text description
    }

    QUEUE_ENTRIES {
        bigint id PK
        bigint appointment_id FK
        bigint doctor_id FK
        varchar token_number "D1-001"
        int queue_position
        varchar queue_status "WAITING, IN_CONSULTATION, COMPLETED, SKIPPED"
        bigint priority_rule_id FK
        datetime checked_in_at
        datetime consultation_started_at
        datetime consultation_ended_at
        int estimated_wait_minutes
    }

    AUDIT_LOGS {
        bigint id PK
        bigint user_id FK
        varchar action_type "CREATE, UPDATE, CANCEL, RESCHEDULE, QUEUE_CALL"
        varchar entity_name "APPOINTMENT, QUEUE, AVAILABILITY, PATIENT"
        bigint entity_id
        text details_json
        varchar ip_address
        timestamp timestamp
    }
```

---

## 2. Table Specifications & Indexes

### Performance & Constraint Indexes
* `appointments`:
  * Index on `(doctor_id, scheduled_start_time, scheduled_end_time, status)` — for rapid smart-slot conflict detection.
  * Index on `(patient_id, status)` — for fast patient history lookups.
  * Index on `(scheduled_start_time, status)` — for daily manager summary aggregations.
* `queue_entries`:
  * Index on `(doctor_id, queue_status, checked_in_at)` — for instant real-time queue ordering.
* `doctor_availability`:
  * Index on `(doctor_id, day_of_week)`.
* `doctor_leave`:
  * Index on `(doctor_id, leave_date, status)`.
* `audit_logs`:
  * Index on `(entity_name, entity_id)` and `(timestamp)`.
