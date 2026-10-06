# Feature Specification & Business Rules

## 1. Core Feature Breakdown

### 1.1 Authentication & Role-Based Access Control (RBAC)
* **Users & Roles**: 4 distinct system personas (`ADMIN`, `RECEPTIONIST`, `DOCTOR`, `MANAGER`).
* **Security Controls**:
  * Passwords hashed via BCrypt ($2a$ salt rounds: 12).
  * Stateless token exchange with role verification on protected REST endpoints.
  * Role-specific navigation in React UI.

---

### 1.2 Patient Management
* **Demographics**: First Name, Last Name, Date of Birth, Gender, Phone, Email, Blood Group, Address, Emergency Contact.
* **Unique Identification**: Auto-generated Patient ID (e.g., `P-2026-0001`).
* **History Log**: Complete historical record of all past, upcoming, cancelled, and rescheduled visits.

---

### 1.3 Doctor & Department Management
* **Departments**: Name, operating schedules (e.g., 08:00 - 20:00), active status.
* **Doctor Profiles**: Specialization, associated department, consultation fee, operational status (`ACTIVE`, `ON_LEAVE`, `INACTIVE`).

---

### 1.4 Doctor Availability & Leave System
* **Weekly Working Schedules**: Configured per doctor per day of the week (e.g., Mon-Fri 09:00 - 17:00).
* **Break Windows**: Defined per schedule (e.g., 13:00 - 14:00 Lunch break).
* **Leave Management**: Leave dates with status (`PENDING`, `APPROVED`, `REJECTED`) and scope (`FULL_DAY`, `MORNING_SESSION`, `AFTERNOON_SESSION`).
* **Enforcement Rule**: Slot generator rejects any appointment creation if it overlaps with leave or break times.

---

### 1.5 Smart Slot Recommendation Engine (Standout Feature)
Instead of returning a dumb list of all timestamps, the backend executes the following rule-based decision tree:

```
[Input: DoctorID, Date, AppointmentTypeID]
                       │
             Doctor has approved leave?
             ├── YES ──► Return 0 available slots (Doctor on leave)
             └── NO
                       │
             Load Doctor's Working Window for Day-of-Week
                       │
             Generate potential time intervals (Step: Duration in mins)
                       │
             Filter out intervals overlapping Doctor Breaks
                       │
             Filter out intervals overlapping Existing Non-Cancelled Bookings
                       │
             Validate full duration fits within remaining window
                       │
             Return List of Clean, Validated, Available Slots
```

---

### 1.6 Appointment Booking, Cancellation & Rescheduling
* **Conflict Prevention**: Double booking is impossible due to transactional isolation + database unique check / indexed overlap check.
* **Duration Fit**: Appointments must fit entirely within the remaining operating time.
* **Cancellation Capacity Recovery**: When an appointment is set to `CANCELLED`, the time slot is immediately liberated for smart-slot queries and walk-in scheduling.
* **Rescheduling Integrity**: Rescheduling creates an `APPOINTMENT_HISTORY` entry (recording previous time, new time, reason, and actor ID) and applies the same rigorous slot validations as a new booking.

---

### 1.7 Real-Time Queue Management & Explainable Priority
* **Tokens**: Generated upon daily check-in (e.g., `CARDIO-001`, `ORTHO-002`).
* **Priority Rules**:
  * `EMERGENCY` (Weight: 100) — Moves to top of pending queue immediately.
  * `SENIOR_CITIZEN` / `SPECIAL_ASSISTANCE` (Weight: 50) — Prioritized before general standard slots.
  * `SCHEDULED_STANDARD` (Weight: 10) — Standard slot-based ordering.
  * `WALK_IN` (Weight: 5) — Filled into open gaps.
* **Explainable Priority UI**: The interface explains why a patient holds a given queue rank (e.g., *"Position #2 • Priority: Senior Citizen category"*).

---

### 1.8 Waiting Time Estimation
* **Estimated Wait Time Calculation**:
  $$\text{Wait Mins} = \sum (\text{Duration of Patients Ahead in Waiting}) + \text{Remaining Mins of Current Consultation}$$
* **UI Transparency**: Displayed with clear disclaimer: *"Estimated time based on average consultation durations."*

---

### 1.9 Operational Analytics & Utilization (Manager Dashboard)
* **Doctor Utilization**:
  $$\text{Utilization \%} = \left( \frac{\text{Total Consultation Minutes Booked}}{\text{Total Available Working Minutes}} \right) \times 100$$
* **Department Workload**: Distribution of appointments across cardiology, orthopedics, general medicine, etc.
* **Cancellation & No-Show Rate**: Percentage of cancelled vs. completed consultations to highlight operational gaps.

---

### 1.10 Audit Logging & Compliance
* All mutations (`CREATE_APPOINTMENT`, `CANCEL_APPOINTMENT`, `RESCHEDULE_APPOINTMENT`, `ADVANCE_QUEUE`, `UPDATE_AVAILABILITY`) write an immutable row to `audit_logs` capturing `user_id`, `action`, `entity_name`, `entity_id`, `timestamp`, and `details_json`.
