# API Documentation — Healthcare Operations Platform

Base URL: `http://localhost:8081/api/v1`

All endpoints require a valid JWT Bearer Token in the Authorization header UNLESS marked as Public.

Request Header (all protected endpoints):
```
Authorization: Bearer <your_jwt_token>
```

All responses use the wrapper format:
```json
{
  "success": true,
  "message": "Description",
  "data": { ... }
}
```

---

## 1. Authentication

### POST /auth/login
- **Auth Required:** Public (No token needed)
- **Purpose:** Authenticate a user and receive a JWT token

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiJ9...",
    "type": "Bearer",
    "userId": 1,
    "username": "admin",
    "fullName": "System Administrator",
    "email": "admin@hospital.org",
    "role": "ADMIN",
    "doctorId": null
  }
}
```

---

## 2. Patients

### GET /patients
- **Auth Required:** Yes
- **Roles:** ADMIN, RECEPTIONIST
- **Purpose:** Get all patients (optional search filter)
- **Query Params:** `search` (optional)

**Example:** `GET /patients?search=John`

**Response:** Array of patient objects
```json
{
  "data": [
    {
      "id": 1,
      "patientCode": "PAT-001",
      "firstName": "John",
      "lastName": "Doe",
      "gender": "MALE",
      "dateOfBirth": "1980-05-15",
      "phone": "+1-555-1001",
      "email": "john.doe@email.com",
      "bloodGroup": "O+",
      "address": null,
      "emergencyContact": null
    }
  ]
}
```

---

### GET /patients/{id}
- **Auth Required:** Yes
- **Roles:** ADMIN, RECEPTIONIST
- **Purpose:** Get a single patient by ID

---

### POST /patients
- **Auth Required:** Yes
- **Roles:** ADMIN, RECEPTIONIST
- **Purpose:** Create a new patient record

**Request Body:**
```json
{
  "firstName": "Alice",
  "lastName": "Brown",
  "gender": "FEMALE",
  "dateOfBirth": "1995-03-10",
  "phone": "+1-555-9001",
  "email": "alice@email.com",
  "bloodGroup": "AB+",
  "address": "123 Main St",
  "emergencyContact": "Bob Brown +1-555-9002"
}
```

---

### PUT /patients/{id}
- **Auth Required:** Yes
- **Roles:** ADMIN, RECEPTIONIST
- **Purpose:** Update an existing patient record

**Request Body:** Same as POST /patients (all fields optional in update)

---

### GET /patients/{id}/appointments
- **Auth Required:** Yes
- **Roles:** ADMIN, RECEPTIONIST
- **Purpose:** Get all appointments for a specific patient

---

## 3. Doctors

### GET /doctors
- **Auth Required:** Yes
- **Roles:** All authenticated users
- **Purpose:** Get all doctors
- **Query Params:** `departmentId` (optional)

**Response includes:** id, fullName, specialization, departmentName, consultationFee, status, availabilities

---

### GET /doctors/{id}
- **Auth Required:** Yes
- **Purpose:** Get a single doctor by ID (includes availabilities)

---

### GET /doctors/department/{deptId}
- **Auth Required:** Yes
- **Purpose:** Get all doctors in a specific department

---

### POST /doctors
- **Auth Required:** Yes
- **Roles:** ADMIN
- **Purpose:** Register a new doctor

**Request Body:**
```json
{
  "userId": 6,
  "departmentId": 1,
  "specialization": "General Practitioner",
  "consultationFee": 60.00,
  "status": "ACTIVE"
}
```

---

### PUT /doctors/{id}
- **Auth Required:** Yes
- **Roles:** ADMIN
- **Purpose:** Update doctor information

---

### GET /doctors/{doctorId}/leaves
- **Auth Required:** Yes
- **Purpose:** Get all leave records for a doctor

---

### POST /doctors/leave
- **Auth Required:** Yes
- **Roles:** ADMIN, DOCTOR
- **Purpose:** Submit a doctor leave request

**Request Body:**
```json
{
  "doctorId": 1,
  "leaveDate": "2025-12-25",
  "sessionType": "FULL_DAY",
  "reason": "Medical Conference",
  "status": "PENDING"
}
```

---

## 4. Departments

### GET /departments
- **Auth Required:** Yes
- **Purpose:** Get all hospital departments

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Cardiology",
      "description": "Heart & cardiovascular care",
      "operatingHoursStart": "08:00:00",
      "operatingHoursEnd": "18:00:00",
      "isActive": true
    }
  ]
}
```

---

### GET /departments/{id}
- **Auth Required:** Yes
- **Purpose:** Get a single department by ID

---

### POST /departments
- **Auth Required:** Yes
- **Roles:** ADMIN
- **Purpose:** Create a new department

**Request Body:**
```json
{
  "name": "Neurology",
  "description": "Brain and nervous system care",
  "operatingHoursStart": "08:00:00",
  "operatingHoursEnd": "18:00:00"
}
```

---

## 5. Appointments

### GET /appointments
- **Auth Required:** Yes
- **Roles:** ADMIN, RECEPTIONIST, DOCTOR, MANAGER
- **Purpose:** Get appointments with optional filters
- **Query Params:** `doctorId`, `departmentId`, `status`, `date`

**Example:** `GET /appointments?status=SCHEDULED&date=2025-12-01`

---

### GET /appointments/{id}
- **Auth Required:** Yes
- **Purpose:** Get appointment by ID

---

### GET /appointments/available-slots
- **Auth Required:** Yes
- **Purpose:** Get available time slots for a doctor on a date
- **Query Params:** `doctorId` (required), `date` (required, format: YYYY-MM-DD), `appointmentTypeId` (optional)

**Response:**
```json
{
  "data": [
    {
      "startTime": "09:00",
      "endTime": "09:30",
      "formattedTime": "09:00 AM",
      "available": true,
      "reasonIfNotAvailable": null
    }
  ]
}
```

---

### POST /appointments
- **Auth Required:** Yes
- **Roles:** ADMIN, RECEPTIONIST
- **Purpose:** Book a new appointment

**Request Body:**
```json
{
  "patientId": 1,
  "doctorId": 1,
  "departmentId": 1,
  "appointmentTypeId": 1,
  "appointmentDate": "2025-12-01",
  "appointmentTime": "10:00",
  "priorityCategory": "SCHEDULED_STANDARD",
  "reasonForVisit": "Routine checkup"
}
```

---

### PUT /appointments/{id}/cancel
- **Auth Required:** Yes
- **Roles:** ADMIN, RECEPTIONIST
- **Purpose:** Cancel an appointment

**Query Params:** `reason` (optional)

---

### PUT /appointments/{id}/reschedule
- **Auth Required:** Yes
- **Roles:** ADMIN, RECEPTIONIST
- **Purpose:** Reschedule an appointment

**Request Body:**
```json
{
  "newDate": "2025-12-10",
  "newTime": "11:00",
  "reason": "Patient request"
}
```

---

### PUT /appointments/{id}/status
- **Auth Required:** Yes
- **Purpose:** Update appointment status
- **Query Params:** `status` (SCHEDULED, IN_CONSULTATION, COMPLETED, CANCELLED, RESCHEDULED, MISSED), `notes` (optional)

---

### GET /appointments/history
- **Auth Required:** Yes
- **Roles:** DOCTOR, ADMIN, MANAGER
- **Purpose:** Get appointment status change history
- **Query Params:** `doctorId`, `status` (optional)

---

## 6. Queue

### GET /queue/doctor/{doctorId}
- **Auth Required:** Yes
- **Purpose:** Get the live queue for a specific doctor

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "appointmentId": 5,
      "tokenNumber": "T-001",
      "queuePosition": 1,
      "queueStatus": "WAITING",
      "patientName": "John Doe",
      "doctorName": "Dr. Robert Smith",
      "estimatedWaitMinutes": 15,
      "checkedInAt": "2025-12-01T09:05:00"
    }
  ]
}
```

---

### POST /queue/check-in
- **Auth Required:** Yes
- **Roles:** ADMIN, RECEPTIONIST
- **Purpose:** Check in a patient and generate queue token

**Request Body:**
```json
{
  "appointmentId": 5,
  "priorityCategory": "SCHEDULED_STANDARD"
}
```

---

### POST /queue/doctor/{doctorId}/call-next
- **Auth Required:** Yes
- **Roles:** ADMIN, DOCTOR
- **Purpose:** Call the next patient in the doctor's queue

---

### PUT /queue/{id}/complete
- **Auth Required:** Yes
- **Roles:** ADMIN, DOCTOR
- **Purpose:** Mark consultation as complete
- **Query Params:** `notes` (optional)

---

### PUT /queue/{id}/skip
- **Auth Required:** Yes
- **Roles:** ADMIN, DOCTOR
- **Purpose:** Skip a patient in the queue
- **Query Params:** `reason` (optional)

---

## 7. Analytics

### GET /analytics/live-queue-summary
- **Auth Required:** Yes
- **Roles:** All authenticated
- **Purpose:** Get current queue statistics (waiting, in-consultation, completed, avg wait)

**Response:**
```json
{
  "data": {
    "total_waiting": 5,
    "total_in_consultation": 2,
    "total_completed": 12,
    "total_skipped": 1,
    "avg_wait_time_minutes": 18.5
  }
}
```

---

### GET /analytics/status-summary
- **Auth Required:** Yes
- **Purpose:** Get appointment counts grouped by status

**Response:**
```json
{
  "data": [
    { "status": "SCHEDULED", "total_count": 25 },
    { "status": "COMPLETED", "total_count": 18 },
    { "status": "CANCELLED", "total_count": 4 }
  ]
}
```

---

### GET /analytics/doctor-utilization
- **Auth Required:** Yes
- **Roles:** ADMIN, MANAGER
- **Purpose:** Get utilization rate per doctor

**Response:**
```json
{
  "data": [
    {
      "doctor_id": 1,
      "doctor_name": "Dr. Robert Smith",
      "department_name": "Cardiology",
      "max_capacity": 16,
      "booked_count": 12,
      "utilization_percentage": 75.0,
      "actual_status": "ACTIVE"
    }
  ]
}
```

---

### GET /analytics/department-load
- **Auth Required:** Yes
- **Roles:** ADMIN, MANAGER
- **Purpose:** Get appointment load per department

**Response:**
```json
{
  "data": [
    {
      "department_id": 1,
      "department_name": "Cardiology",
      "appointment_count": 15
    }
  ]
}
```

---

## 8. Audit Logs

### GET /audit-logs
- **Auth Required:** Yes
- **Roles:** ADMIN, MANAGER
- **Purpose:** Get all system audit log entries

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "userId": 1,
      "actionType": "APPOINTMENT_BOOKED",
      "entityName": "Appointment",
      "entityId": 5,
      "detailsJson": "Appointment booked for patient John Doe",
      "ipAddress": "127.0.0.1",
      "timestamp": "2025-12-01T10:30:00"
    }
  ]
}
```

---

### POST /audit-logs
- **Auth Required:** Yes
- **Purpose:** Manually log a system action (called internally by frontend)

**Request Body:**
```json
{
  "action": "APPOINTMENT_BOOKED",
  "entityName": "Appointment",
  "entityId": 5,
  "details": "Appointment booked for patient ID 1"
}
```

---

## HTTP Status Codes

| Status | Meaning |
|:-------|:--------|
| 200 OK | Request successful |
| 400 Bad Request | Validation error |
| 401 Unauthorized | Missing/invalid/expired JWT |
| 403 Forbidden | Valid token but insufficient role |
| 404 Not Found | Resource not found |
| 409 Conflict | Booking conflict (slot already taken) |
| 500 Internal Server Error | Backend error |

---

## Appointment Status Values

| Status | Description |
|:-------|:------------|
| SCHEDULED | Appointment booked, pending check-in |
| IN_CONSULTATION | Patient is currently with doctor |
| COMPLETED | Consultation finished |
| CANCELLED | Appointment cancelled |
| RESCHEDULED | Appointment moved to a new time |
| MISSED | Patient did not show up |

---

## Priority Categories

| Category | Weight | Description |
|:---------|:------:|:------------|
| EMERGENCY | 100 | Immediate attention required |
| SENIOR_CITIZEN | 50 | Elderly patients |
| SCHEDULED_STANDARD | 10 | Regular confirmed appointment |
| WALK_IN | 5 | Unscheduled walk-in patient |
