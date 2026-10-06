# Bug Report Template — Healthcare Operations Platform

Use this template to document any bugs found during testing.

Copy this template for each bug and save as: BUG-XXX.md (e.g., BUG-001.md)

---

## Bug Report

| Field | Value |
|:------|:------|
| **Bug ID** | BUG-XXX |
| **Date** | YYYY-MM-DD |
| **Tester** | |
| **Module** | (e.g., Appointments / Queue / Reports / Login / Patients) |
| **Severity** | Critical / Major / Minor / Cosmetic |
| **Status** | Open / In Progress / Fixed / Closed |
| **Browser** | (e.g., Chrome 120, Firefox 121, Edge 120) |
| **Frontend URL** | http://localhost:3000/... |

---

### Description

_Brief one-line summary of the issue._

---

### Steps to Reproduce

1. Step 1
2. Step 2
3. Step 3
...

---

### Expected Result

_What should happen when the steps above are followed._

---

### Actual Result

_What actually happens — the bug behavior._

---

### Screenshot

_Attach screenshot filename here if available._
(e.g., `bug-001-screenshot.png`)

---

### Console Error (Browser DevTools)

```
Paste browser console error here (F12 → Console tab)
```

---

### Backend Error (Maven terminal)

```
Paste Spring Boot terminal error here if applicable
```

---

### Network Request (if applicable)

| Field | Value |
|:------|:------|
| Method | GET / POST / PUT |
| URL | /api/v1/... |
| Status Code | 400 / 401 / 403 / 404 / 500 |
| Response Body | |

---

### Tester Comments

_Any additional context, observations, or suggested fix._

---

## Severity Definitions

| Severity | Definition |
|:---------|:-----------|
| **Critical** | Application crashes, data loss, login broken, complete feature failure |
| **Major** | Feature works incorrectly, wrong data displayed, core workflow broken |
| **Minor** | Feature partially broken, workaround available |
| **Cosmetic** | UI styling issue, typo, misalignment — no functional impact |

---

## Example Bug Report

| Field | Value |
|:------|:------|
| **Bug ID** | BUG-001 |
| **Date** | 2025-12-01 |
| **Tester** | Bhoomika |
| **Module** | Appointments |
| **Severity** | Major |
| **Status** | Open |
| **Browser** | Chrome 120 |

### Description
Booking an appointment fails with 500 error when no appointment type is selected.

### Steps to Reproduce
1. Login as receptionist1
2. Go to Appointments page
3. Click "Book Appointment"
4. Fill patient, doctor, date
5. Leave appointment type blank
6. Click Submit

### Expected Result
Frontend should show validation error: "Please select an appointment type."

### Actual Result
500 Internal Server Error is returned from backend.

### Console Error
```
POST http://localhost:8081/api/v1/appointments 500 (Internal Server Error)
```

### Backend Error
```
NullPointerException in AppointmentService.bookAppointment at line 87
```

### Tester Comments
Frontend validation for appointment type appears to be missing. Backend should also validate and return 400 instead of 500.
