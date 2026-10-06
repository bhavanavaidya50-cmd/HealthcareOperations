# Test Accounts — Healthcare Operations Platform

> WARNING: DEVELOPMENT AND TESTING CREDENTIALS ONLY
> Do NOT use in production. Do NOT commit to public repositories.

---

## Authentication Endpoint

```
POST http://localhost:8081/api/v1/auth/login
Content-Type: application/json

{
  "username": "<username>",
  "password": "<password>"
}
```

JWT Token valid for 24 hours.

---

## Test Accounts

### 1. ADMIN

| Field    | Value |
|:---------|:------|
| Username | admin |
| Password | admin123 |
| Role     | ADMIN |
| Full Name | System Administrator |
| Email    | admin@hospital.org |

**Access:** Dashboard, Patients, Doctors, Departments, Availability, Appointments, Queue, Reports, Audit Logs

---

### 2. RECEPTIONIST

| Field    | Value |
|:---------|:------|
| Username | receptionist1 |
| Password | receptionist123 |
| Role     | RECEPTIONIST |
| Full Name | Sarah Jenkins (Reception) |
| Email    | reception1@hospital.org |

**Access:** Dashboard, Patients, Appointments, Queue

**No access to:** Doctors, Departments, Reports, Audit Logs

---

### 3. DOCTOR — Dr. Robert Smith

| Field    | Value |
|:---------|:------|
| Username | dr.smith |
| Password | doctor123 |
| Role     | DOCTOR |
| Full Name | Dr. Robert Smith |
| Email    | r.smith@hospital.org |
| Doctor ID | 1 |
| Department | Cardiology |
| Specialization | Senior Interventional Cardiologist |

**Access:** Dashboard, My Appointments, My Queue, Availability, Appointment History

---

### 4. DOCTOR — Dr. Emily Clark

| Field    | Value |
|:---------|:------|
| Username | dr.clark |
| Password | doctor123 |
| Role     | DOCTOR |
| Full Name | Dr. Emily Clark |
| Email    | e.clark@hospital.org |
| Doctor ID | 2 |
| Department | Orthopedics |
| Specialization | Orthopedic & Joint Specialist |

**Access:** Dashboard, My Appointments, My Queue, Availability, Appointment History

---

### 5. MANAGER

| Field    | Value |
|:---------|:------|
| Username | manager1 |
| Password | manager123 |
| Role     | MANAGER |
| Full Name | Operations Manager David |
| Email    | manager@hospital.org |

**Access:** Dashboard, Appointments, Queue, Reports, Audit Logs

**No access to:** Patients CRUD, Doctors, Departments, Availability

---

## Role Access Matrix

| Module              | ADMIN | RECEPTIONIST | DOCTOR | MANAGER |
|:--------------------|:-----:|:------------:|:------:|:-------:|
| Dashboard           | YES   | YES          | YES    | YES     |
| Patients            | YES   | YES          | NO     | NO      |
| Doctors             | YES   | NO           | NO     | NO      |
| Departments         | YES   | NO           | NO     | NO      |
| Availability        | YES   | NO           | YES    | NO      |
| Appointments        | YES   | YES          | YES    | YES     |
| Queue               | YES   | YES          | YES    | YES     |
| Appointment History | YES   | NO           | YES    | YES     |
| Reports             | YES   | NO           | NO     | YES     |
| Audit Logs          | YES   | NO           | NO     | YES     |

---

## Notes

- Passwords are BCrypt hashed in MySQL database (users.password_hash)
- JWT stored in browser localStorage key: medqueue_token
- User profile stored in localStorage key: medqueue_user
- Token expires after 24 hours — re-login required
- MySQL root password is NOT documented here — ask the project owner
- Accounts are seeded via MySQL seed script on initial setup
