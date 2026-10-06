# Testing Guide — Healthcare Operations Platform

This document is for the tester (friend/colleague) conducting end-to-end QA on MedQueue PRO.

---

## Prerequisites Checklist

Before starting any tests:
- [ ] MySQL running on port 3306
- [ ] Database `health_care_operations_db` populated
- [ ] Backend running: `http://localhost:8081`
- [ ] Frontend running: `http://localhost:3000`
- [ ] Browser DevTools open (F12) to catch console errors

---

## A. Environment Setup

| Test ID | TEST-A-001 |
|:--------|:-----------|
| **Test Name** | Verify MySQL is running |
| **Steps** | 1. Open PowerShell. 2. Run: `Test-NetConnection -ComputerName localhost -Port 3306` |
| **Expected Result** | TcpTestSucceeded: True |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

| Test ID | TEST-A-002 |
|:--------|:-----------|
| **Test Name** | Verify backend is running |
| **Steps** | 1. Open browser. 2. Navigate to `http://localhost:8081/api/v1/departments` |
| **Expected Result** | JSON response (may redirect to login or return 401 — both are acceptable) |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

| Test ID | TEST-A-003 |
|:--------|:-----------|
| **Test Name** | Verify frontend loads |
| **Steps** | 1. Open browser. 2. Navigate to `http://localhost:3000` |
| **Expected Result** | Login page appears with username and password fields |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

---

## B. MySQL Database

| Test ID | TEST-B-001 |
|:--------|:-----------|
| **Test Name** | Verify database schema exists |
| **Steps** | 1. Open MySQL Workbench. 2. Connect to localhost. 3. Run: `USE health_care_operations_db; SHOW TABLES;` |
| **Expected Result** | 13 tables: roles, users, departments, doctors, doctor_availability, doctor_leave, patients, appointment_types, priority_rules, appointments, appointment_history, queue_entries, audit_logs |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

| Test ID | TEST-B-002 |
|:--------|:-----------|
| **Test Name** | Verify seed data |
| **Steps** | 1. Run: `SELECT username, role_id FROM users;` in MySQL |
| **Expected Result** | 5 users: admin (1), receptionist1 (2), dr.smith (3), dr.clark (3), manager1 (4) |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

---

## C. Backend Startup

| Test ID | TEST-C-001 |
|:--------|:-----------|
| **Test Name** | Backend startup without errors |
| **Steps** | 1. Open PowerShell. 2. Run: `cd backend\health_care_operations; mvn spring-boot:run` 3. Wait for startup message |
| **Expected Result** | "Started HealthCareOperationsApplication in X seconds" |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

---

## D. Frontend Startup

| Test ID | TEST-D-001 |
|:--------|:-----------|
| **Test Name** | Frontend dev server starts |
| **Steps** | 1. Open second PowerShell. 2. Run: `cd frontend; npm install; npm run dev` |
| **Expected Result** | "Local: http://localhost:3000/" output |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

---

## E. Login

| Test ID | TEST-E-001 |
|:--------|:-----------|
| **Test Name** | Successful admin login |
| **Steps** | 1. Open http://localhost:3000. 2. Enter username: admin, password: admin123. 3. Click Login |
| **Expected Result** | Redirected to /dashboard. Sidebar shows all nav items including Patients, Doctors, Departments, Reports, Audit Logs |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

| Test ID | TEST-E-002 |
|:--------|:-----------|
| **Test Name** | Successful receptionist login |
| **Steps** | 1. Logout. 2. Login with receptionist1 / receptionist123 |
| **Expected Result** | Sidebar shows: Dashboard, Patients, Appointments, Queue (NO Doctors, Departments, Reports, Audit Logs) |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

| Test ID | TEST-E-003 |
|:--------|:-----------|
| **Test Name** | Successful doctor login |
| **Steps** | 1. Logout. 2. Login with dr.smith / doctor123 |
| **Expected Result** | Sidebar shows: Dashboard, My Appointments, My Queue, Availability, Appointment History |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

| Test ID | TEST-E-004 |
|:--------|:-----------|
| **Test Name** | Successful manager login |
| **Steps** | 1. Logout. 2. Login with manager1 / manager123 |
| **Expected Result** | Sidebar shows: Dashboard, Appointments, Queue, Reports, Audit Logs |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

---

## F. Admin Role

| Test ID | TEST-F-001 |
|:--------|:-----------|
| **Test Name** | Admin can see all navigation items |
| **Steps** | Login as admin. Check sidebar |
| **Expected Result** | Dashboard, Patients, Doctors, Departments, Availability, Appointments, Queue, Reports, Audit Logs |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

---

## G. Receptionist Role

| Test ID | TEST-G-001 |
|:--------|:-----------|
| **Test Name** | Receptionist cannot access Doctors page directly |
| **Steps** | Login as receptionist1. Navigate to http://localhost:3000/doctors |
| **Expected Result** | Redirected to Dashboard or Unauthorized page |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

---

## H. Doctor Role

| Test ID | TEST-H-001 |
|:--------|:-----------|
| **Test Name** | Doctor sees only own appointments |
| **Steps** | 1. Login as dr.smith. 2. Go to My Appointments |
| **Expected Result** | Appointments list is filtered to Dr. Robert Smith only |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

---

## I. Manager Role

| Test ID | TEST-I-001 |
|:--------|:-----------|
| **Test Name** | Manager cannot access Patients page |
| **Steps** | Login as manager1. Navigate to http://localhost:3000/patients |
| **Expected Result** | Redirected or access denied |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

---

## J. Patient CRUD

| Test ID | TEST-J-001 |
|:--------|:-----------|
| **Test Name** | View patient list |
| **Steps** | 1. Login as admin. 2. Go to Patients. 3. Observe the table |
| **Expected Result** | Table loads with at least 3 patients (PAT-001 John Doe, PAT-002 Jane Smith, PAT-003 Robert Johnson) |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

| Test ID | TEST-J-002 |
|:--------|:-----------|
| **Test Name** | Search patients |
| **Steps** | 1. Patients page. 2. Type "John" in search box |
| **Expected Result** | Table filters to show only John Doe |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

| Test ID | TEST-J-003 |
|:--------|:-----------|
| **Test Name** | Add new patient |
| **Steps** | 1. Click "Add Patient". 2. Fill all required fields: First Name, Last Name, Gender, DOB, Phone. 3. Submit |
| **Expected Result** | New patient appears in the table with a generated patient code |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

| Test ID | TEST-J-004 |
|:--------|:-----------|
| **Test Name** | Edit patient |
| **Steps** | 1. Click Edit on existing patient. 2. Change phone number. 3. Save |
| **Expected Result** | Patient record updated with new phone number |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

| Test ID | TEST-J-005 |
|:--------|:-----------|
| **Test Name** | View patient details |
| **Steps** | 1. Click View/Eye icon on a patient |
| **Expected Result** | Patient details panel or modal shows all fields including blood group and emergency contact |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

---

## K. Doctor Management

| Test ID | TEST-K-001 |
|:--------|:-----------|
| **Test Name** | View doctor list |
| **Steps** | 1. Login as admin. 2. Go to Doctors |
| **Expected Result** | At least 2 doctors: Dr. Robert Smith (Cardiology), Dr. Emily Clark (Orthopedics) |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

| Test ID | TEST-K-002 |
|:--------|:-----------|
| **Test Name** | View doctor details |
| **Steps** | Click on a doctor to view details |
| **Expected Result** | Shows specialization, department, consultation fee, status, availability schedule |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

---

## L. Departments

| Test ID | TEST-L-001 |
|:--------|:-----------|
| **Test Name** | View departments |
| **Steps** | 1. Login as admin. 2. Go to Departments |
| **Expected Result** | 5 departments listed: Cardiology, Orthopedics, General Medicine, Pediatrics, Dermatology |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

| Test ID | TEST-L-002 |
|:--------|:-----------|
| **Test Name** | Add new department |
| **Steps** | 1. Click "Add Department". 2. Enter department name and description. 3. Submit |
| **Expected Result** | New department appears in the list |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

---

## M. Availability

| Test ID | TEST-M-001 |
|:--------|:-----------|
| **Test Name** | View doctor availability |
| **Steps** | 1. Login as admin. 2. Go to Availability. 3. Select a doctor |
| **Expected Result** | Shows working days (Mon-Fri), shift times (09:00-17:00), break times, max capacity |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

| Test ID | TEST-M-002 |
|:--------|:-----------|
| **Test Name** | Add doctor leave |
| **Steps** | 1. Availability page. 2. Click "Add Leave". 3. Select a future date and reason. 4. Submit |
| **Expected Result** | Leave request saved. Appears in the leave list |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

---

## N. Appointment Booking

| Test ID | TEST-N-001 |
|:--------|:-----------|
| **Test Name** | Book a new appointment |
| **Steps** | 1. Login as receptionist1. 2. Go to Appointments. 3. Click "Book Appointment". 4. Select patient, doctor, date (future weekday), slot. 5. Submit |
| **Expected Result** | Appointment created with status SCHEDULED. Appears in the appointments list |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

| Test ID | TEST-N-002 |
|:--------|:-----------|
| **Test Name** | Verify available slots load |
| **Steps** | 1. Book Appointment modal. 2. Select doctor and date. 3. Observe time slots |
| **Expected Result** | Time slots load from backend (09:00 AM to 05:00 PM in 30-min intervals, marked available/booked) |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

---

## O. Appointment Cancellation

| Test ID | TEST-O-001 |
|:--------|:-----------|
| **Test Name** | Cancel an appointment |
| **Steps** | 1. Go to Appointments. 2. Find a SCHEDULED appointment. 3. Click Cancel. 4. Enter reason. 5. Confirm |
| **Expected Result** | Appointment status changes to CANCELLED |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

---

## P. Appointment Rescheduling

| Test ID | TEST-P-001 |
|:--------|:-----------|
| **Test Name** | Reschedule an appointment |
| **Steps** | 1. Find a SCHEDULED appointment. 2. Click Reschedule. 3. Pick new date and time. 4. Submit |
| **Expected Result** | Appointment status changes to RESCHEDULED. New date/time reflected |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

---

## Q. Queue & Check-in

| Test ID | TEST-Q-001 |
|:--------|:-----------|
| **Test Name** | Check in a patient |
| **Steps** | 1. Go to Queue page. 2. Find a SCHEDULED appointment. 3. Click Check-In |
| **Expected Result** | Patient added to queue with token number (T-001). Status changes to WAITING |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

| Test ID | TEST-Q-002 |
|:--------|:-----------|
| **Test Name** | Call next patient |
| **Steps** | 1. Queue page (logged in as admin or doctor). 2. Click "Call Next" |
| **Expected Result** | First WAITING patient status changes to IN_CONSULTATION |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

| Test ID | TEST-Q-003 |
|:--------|:-----------|
| **Test Name** | Complete consultation |
| **Steps** | 1. Queue page. 2. Click Complete on IN_CONSULTATION patient |
| **Expected Result** | Queue status changes to COMPLETED |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

| Test ID | TEST-Q-004 |
|:--------|:-----------|
| **Test Name** | Skip patient |
| **Steps** | 1. Queue page. 2. Click Skip on a WAITING patient. 3. Enter reason |
| **Expected Result** | Queue status changes to SKIPPED |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

---

## R. Dashboard

| Test ID | TEST-R-001 |
|:--------|:-----------|
| **Test Name** | Dashboard KPI cards load |
| **Steps** | 1. Login as admin. 2. Go to Dashboard |
| **Expected Result** | KPI cards show: Total Appointments, Waiting Patients, In Consultation, Completed Today, Cancellations |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

| Test ID | TEST-R-002 |
|:--------|:-----------|
| **Test Name** | Doctor utilization chart loads |
| **Steps** | Dashboard page, scroll down |
| **Expected Result** | Bar chart shows doctor utilization percentages |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

---

## S. Reports

| Test ID | TEST-S-001 |
|:--------|:-----------|
| **Test Name** | Reports page loads |
| **Steps** | 1. Login as admin or manager1. 2. Go to Reports |
| **Expected Result** | KPI summary cards, status pie chart, department bar chart, doctor table, queue stats all load |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

| Test ID | TEST-S-002 |
|:--------|:-----------|
| **Test Name** | Reports filter — Today |
| **Steps** | 1. Reports page. 2. Select "Today" from date filter dropdown |
| **Expected Result** | All report sections refresh with today's data |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

| Test ID | TEST-S-003 |
|:--------|:-----------|
| **Test Name** | Reports filter — Previous Month |
| **Steps** | 1. Reports page. 2. Select "Previous Month" |
| **Expected Result** | Data changes to previous month's appointments |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

---

## T. Print

| Test ID | TEST-T-001 |
|:--------|:-----------|
| **Test Name** | Print report |
| **Steps** | 1. Reports page. 2. Click "Print / PDF" button |
| **Expected Result** | Browser print dialog opens. Preview shows A4 formatted report. Sidebar, navbar, and controls are hidden in print preview |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

---

## U. PDF Export

| Test ID | TEST-U-001 |
|:--------|:-----------|
| **Test Name** | Export PDF report |
| **Steps** | 1. Reports page. 2. Click "Export PDF" button |
| **Expected Result** | PDF file downloads named `healthcare-capacity-report-YYYY-MM-DD.pdf`. Contains: header, KPI table, status table, doctor table, department table, queue stats |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

---

## V. Excel Export

| Test ID | TEST-V-001 |
|:--------|:-----------|
| **Test Name** | Export Excel report |
| **Steps** | 1. Reports page. 2. Click "Export Excel" button |
| **Expected Result** | .xlsx file downloads named `healthcare-capacity-report-YYYY-MM-DD.xlsx`. Contains 6 worksheets: Summary, Appointments, Appointment Status, Doctor Utilization, Department Load, Queue Summary |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

---

## W. Audit Logs

| Test ID | TEST-W-001 |
|:--------|:-----------|
| **Test Name** | View audit logs |
| **Steps** | 1. Login as admin. 2. Go to Audit Logs |
| **Expected Result** | Table shows audit entries with: Timestamp, User, Action, Entity, Details |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

| Test ID | TEST-W-002 |
|:--------|:-----------|
| **Test Name** | Audit log records booking action |
| **Steps** | 1. Book a new appointment. 2. Go to Audit Logs. 3. Find latest entry |
| **Expected Result** | New audit log entry with action APPOINTMENT_BOOKED or similar |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

---

## X. Unauthorized Access

| Test ID | TEST-X-001 |
|:--------|:-----------|
| **Test Name** | Receptionist cannot access Reports |
| **Steps** | 1. Login as receptionist1. 2. Navigate to http://localhost:3000/reports |
| **Expected Result** | Access denied or redirected to dashboard |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

| Test ID | TEST-X-002 |
|:--------|:-----------|
| **Test Name** | Doctor cannot access Patients |
| **Steps** | 1. Login as dr.smith. 2. Navigate to http://localhost:3000/patients |
| **Expected Result** | Access denied or redirected to dashboard |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

| Test ID | TEST-X-003 |
|:--------|:-----------|
| **Test Name** | Unauthenticated access redirects to login |
| **Steps** | 1. Clear all localStorage (DevTools → Application → Local Storage → Clear). 2. Navigate to http://localhost:3000/dashboard |
| **Expected Result** | Redirected to /login page |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

---

## Y. Invalid Login

| Test ID | TEST-Y-001 |
|:--------|:-----------|
| **Test Name** | Wrong password shows error |
| **Steps** | 1. Login page. 2. Enter username: admin, password: wrongpassword. 3. Click Login |
| **Expected Result** | Error message displayed: "Invalid username or password" (no crash, no redirect) |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

| Test ID | TEST-Y-002 |
|:--------|:-----------|
| **Test Name** | Empty credentials show validation |
| **Steps** | 1. Login page. 2. Leave both fields empty. 3. Click Login |
| **Expected Result** | Inline validation messages appear (username required, password required) |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

---

## Z. Double-Booking / Conflict Prevention

| Test ID | TEST-Z-001 |
|:--------|:-----------|
| **Test Name** | Cannot book the same slot twice |
| **Steps** | 1. Book an appointment: Dr. Smith, Date: tomorrow, Time: 10:00 AM. 2. Try to book the SAME slot again for the same doctor and date |
| **Expected Result** | Backend returns conflict error. Slot marked as BOOKED in the slot picker. Error message displayed to user |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

| Test ID | TEST-Z-002 |
|:--------|:-----------|
| **Test Name** | Slots respect doctor leave |
| **Steps** | 1. Add a leave for Dr. Smith for a specific future date (Availability page). 2. Try to book Dr. Smith on that date |
| **Expected Result** | No available slots shown for that date OR booking is rejected |
| **Actual Result** | |
| **Status** | PASS / FAIL |
| **Tester Comments** | |

---

## Testing Summary Sheet

| Category | Total Tests | Passed | Failed | Blocked |
|:---------|:-----------:|:------:|:------:|:-------:|
| A. Environment Setup | 3 | | | |
| B. MySQL Database | 2 | | | |
| C. Backend Startup | 1 | | | |
| D. Frontend Startup | 1 | | | |
| E. Login | 4 | | | |
| F. Admin Role | 1 | | | |
| G. Receptionist Role | 1 | | | |
| H. Doctor Role | 1 | | | |
| I. Manager Role | 1 | | | |
| J. Patient CRUD | 5 | | | |
| K. Doctor Management | 2 | | | |
| L. Departments | 2 | | | |
| M. Availability | 2 | | | |
| N. Appointment Booking | 2 | | | |
| O. Cancellation | 1 | | | |
| P. Rescheduling | 1 | | | |
| Q. Queue/Check-in | 4 | | | |
| R. Dashboard | 2 | | | |
| S. Reports | 3 | | | |
| T. Print | 1 | | | |
| U. PDF Export | 1 | | | |
| V. Excel Export | 1 | | | |
| W. Audit Logs | 2 | | | |
| X. Unauthorized Access | 3 | | | |
| Y. Invalid Login | 2 | | | |
| Z. Double-booking | 2 | | | |
| **TOTAL** | **52** | | | |

---

## Bug Reporting

For any FAIL results, use the `BUG_REPORT.md` template to document the issue.
