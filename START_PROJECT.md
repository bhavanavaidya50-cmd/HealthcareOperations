# Startup Guide — Healthcare Operations Platform

Step-by-step Windows PowerShell startup commands for local development and testing.

---

## Prerequisites

Before starting, ensure the following are installed and available:

| Tool | Required Version | Check Command |
|:-----|:----------------|:--------------|
| Java JDK | 21+ | `java -version` |
| Maven | 3.6+ | `mvn -version` |
| MySQL | 8.x | Running on port 3306 |
| Node.js | 18+ | `node --version` |
| npm | 9+ | `npm --version` |

---

## Step 1 — Start MySQL

MySQL must be running BEFORE starting the backend.

**Option A: Windows Services**
```
Press Win + R → type: services.msc → Enter
Find "MySQL80" (or "MySQL") → Right-click → Start
```

**Option B: PowerShell (as Administrator)**
```powershell
Start-Service -Name "MySQL80"
```

**Verify MySQL is running:**
```powershell
Test-NetConnection -ComputerName localhost -Port 3306
```
Expected: `TcpTestSucceeded: True`

---

## Step 2 — Verify Database Exists

Open MySQL Workbench or run:
```powershell
mysql -u root -p -e "SHOW DATABASES;"
```
Ensure `health_care_operations_db` appears in the list.

---

## Step 3 — Start the Spring Boot Backend

Open a PowerShell terminal and run:

```powershell
cd "C:\Users\Bhoomika\Downloads\HealthcareOperations\HealthcareOperations\backend\health_care_operations"
mvn spring-boot:run
```

**Expected output (success):**
```
Started HealthCareOperationsApplication in X.XXX seconds
Tomcat started on port 8081
```

**Verify backend is running:**
- Open browser: http://localhost:8081/api/v1/departments
- Expected: JSON array of departments (may require login)
- Or test health: http://localhost:8081/api/v1/auth/login (POST request)

> IMPORTANT: Keep this terminal open. Closing it stops the backend.

---

## Step 4 — Start the React Frontend

Open a SECOND PowerShell terminal and run:

```powershell
cd "C:\Users\Bhoomika\Downloads\HealthcareOperations\HealthcareOperations\frontend"

# First time only — install dependencies
npm install

# Start development server
npm run dev
```

**Expected output:**
```
VITE v6.x.x  ready in XXX ms
➜  Local:   http://localhost:3000/
```

**Open in browser:** http://localhost:3000

> IMPORTANT: Keep this terminal open. Closing it stops the frontend.

---

## URLs Summary

| Service | URL |
|:--------|:----|
| Frontend | http://localhost:3000 |
| Backend REST API | http://localhost:8081/api/v1 |
| MySQL | localhost:3306 |
| Database | health_care_operations_db |

---

## Startup Order

```
1. MySQL (must be running first)
      ↓
2. Spring Boot backend (mvn spring-boot:run)
      ↓
3. React frontend (npm run dev)
      ↓
4. Open http://localhost:3000 in browser
```

---

## If Port 8081 Is Already In Use

**Find and kill the process using port 8081:**

```powershell
# Find the process
netstat -ano | findstr :8081

# Note the PID from the output (last column), then:
taskkill /PID <PID> /F
```

**Alternative: Change the backend port**

In `backend/health_care_operations/src/main/resources/application.properties`:
```properties
server.port=8082
```

Then update `frontend/.env`:
```
VITE_API_BASE_URL=http://localhost:8082/api/v1
```

---

## If Port 3000 Is Already In Use

**Find and kill the process using port 3000:**
```powershell
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

**Or change frontend port:**
In `frontend/package.json`, change:
```json
"dev": "vite --port 3001"
```

---

## If Backend Fails to Connect to MySQL

1. Verify MySQL is running: `Test-NetConnection -ComputerName localhost -Port 3306`
2. Check `application.properties` has the correct MySQL root password
3. Verify database exists: `SHOW DATABASES;` in MySQL Workbench
4. Check Hibernate logs for connection errors in the Maven terminal output

---

## If Frontend Shows "Backend Unreachable"

1. Confirm backend is running on port 8081
2. Open `frontend/.env` and verify:
   ```
   VITE_API_BASE_URL=http://localhost:8081/api/v1
   ```
3. Restart the frontend dev server after changing `.env`

---

## Production Build (Optional)

To create an optimized production bundle:

```powershell
cd frontend
npm run build
```

Output goes to `frontend/dist/`. Last verified build: exit code 0, 2539 modules, ~2.18MB bundle.

---

## Default Login After Startup

Once both servers are running, go to:
```
http://localhost:3000
```

Login with:
- Username: `admin`
- Password: `admin123`

See `TEST_ACCOUNTS.md` for all available test credentials.
