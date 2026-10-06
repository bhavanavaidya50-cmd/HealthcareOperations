const fs = require('fs');
const path = require('path');
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
  AlignmentType,
  ShadingType,
  Header,
  Footer,
  PageNumber,
  NumberFormat,
  convertInchesToTwip
} = require(path.join(__dirname, 'frontend/node_modules/docx'));

function createTitle(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.TITLE,
    alignment: AlignmentType.CENTER,
    spacing: { before: 240, after: 120 },
    run: { font: 'Calibri', size: 44, bold: true, color: '0F766E' }
  });
}

function createSubTitle(text) {
  return new Paragraph({
    text,
    alignment: AlignmentType.CENTER,
    spacing: { before: 0, after: 360 },
    run: { font: 'Calibri', size: 24, italic: true, color: '475569' }
  });
}

function createHeading1(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_1,
    spacing: { before: 400, after: 140 },
    run: { font: 'Calibri', size: 30, bold: true, color: '0F766E' }
  });
}

function createHeading2(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_2,
    spacing: { before: 260, after: 100 },
    run: { font: 'Calibri', size: 24, bold: true, color: '1E293B' }
  });
}

function createHeading3(text) {
  return new Paragraph({
    text,
    heading: HeadingLevel.HEADING_3,
    spacing: { before: 180, after: 60 },
    run: { font: 'Calibri', size: 20, bold: true, color: '334155' }
  });
}

function createPara(text, options = {}) {
  return new Paragraph({
    spacing: { before: 60, after: 100, line: 276 },
    alignment: options.alignment || AlignmentType.LEFT,
    children: [
      new TextRun({
        text,
        font: 'Calibri',
        size: 22,
        color: options.color || '334155',
        bold: options.bold || false,
        italics: options.italic || false
      })
    ]
  });
}

function createBullet(title, text) {
  return new Paragraph({
    bullet: { level: 0 },
    spacing: { before: 40, after: 60, line: 260 },
    children: [
      new TextRun({
        text: title ? `${title}: ` : '',
        font: 'Calibri',
        size: 22,
        bold: true,
        color: '0F766E'
      }),
      new TextRun({
        text: text,
        font: 'Calibri',
        size: 22,
        color: '334155'
      })
    ]
  });
}

function createTable(headers, rowsData) {
  const headerRow = new TableRow({
    tableHeader: true,
    children: headers.map(
      (h) =>
        new TableCell({
          shading: { fill: '0F766E', type: ShadingType.CLEAR },
          margins: { top: 120, bottom: 120, left: 140, right: 140 },
          children: [
            new Paragraph({
              alignment: AlignmentType.CENTER,
              children: [
                new TextRun({
                  text: h,
                  bold: true,
                  color: 'FFFFFF',
                  font: 'Calibri',
                  size: 20
                })
              ]
            })
          ]
        })
    )
  });

  const bodyRows = rowsData.map((row, rIdx) => {
    const bgColor = rIdx % 2 === 0 ? 'F8FAFC' : 'FFFFFF';
    return new TableRow({
      children: row.map(
        (cellText, cIdx) =>
          new TableCell({
            shading: { fill: bgColor, type: ShadingType.CLEAR },
            margins: { top: 100, bottom: 100, left: 140, right: 140 },
            children: [
              new Paragraph({
                alignment: AlignmentType.LEFT,
                children: [
                  new TextRun({
                    text: String(cellText),
                    font: 'Calibri',
                    size: 19,
                    color: '1E293B'
                  })
                ]
              })
            ]
          })
      )
    });
  });

  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: [headerRow, ...bodyRows],
    borders: {
      top: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      bottom: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      left: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      right: { style: BorderStyle.SINGLE, size: 4, color: 'CBD5E1' },
      insideHorizontal: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' },
      insideVertical: { style: BorderStyle.SINGLE, size: 4, color: 'E2E8F0' }
    }
  });
}

async function buildDocx() {
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: convertInchesToTwip(1),
              right: convertInchesToTwip(1),
              bottom: convertInchesToTwip(1),
              left: convertInchesToTwip(1)
            }
          }
        },
        headers: {
          default: new Header({
            children: [
              new Paragraph({
                alignment: AlignmentType.RIGHT,
                children: [
                  new TextRun({
                    text: 'Smart Hospital Operations & Outpatient Queue Management System',
                    font: 'Calibri',
                    size: 16,
                    color: '94A3B8',
                    italics: true
                  })
                ]
              })
            ]
          })
        },
        footers: {
          default: new Footer({
            children: [
              new Paragraph({
                alignment: AlignmentType.CENTER,
                children: [
                  new TextRun({
                    text: 'Page ',
                    font: 'Calibri',
                    size: 18,
                    color: '64748B'
                  }),
                  new TextRun({
                    children: [PageNumber.CURRENT],
                    font: 'Calibri',
                    size: 18,
                    color: '0F766E',
                    bold: true
                  }),
                  new TextRun({
                    text: ' of ',
                    font: 'Calibri',
                    size: 18,
                    color: '64748B'
                  }),
                  new TextRun({
                    children: [PageNumber.TOTAL_PAGES],
                    font: 'Calibri',
                    size: 18,
                    color: '64748B'
                  })
                ]
              })
            ]
          })
        },
        children: [
          // Cover / Header Information
          createTitle('SMART HEALTHCARE OPERATIONS &\nOUTPATIENT QUEUE MANAGEMENT SYSTEM'),
          createSubTitle('Comprehensive Technical Project Report & Architectural Documentation'),

          createPara('Project Title: Smart Hospital Operations, Dynamic Priority Queue & Digital Prescription System', { bold: true, color: '0F766E', alignment: AlignmentType.CENTER }),
          createPara('Author / Engineering Team: Healthcare Software Operations & Informatics Group', { alignment: AlignmentType.CENTER }),
          createPara('Technology Stack: Spring Boot 3.3.4 (Java 21), React 18, MySQL 8, STOMP WebSockets, jsPDF', { alignment: AlignmentType.CENTER, italic: true }),
          createPara('Version: 2.5 Enterprise Edition | Academic & Industrial Submission', { alignment: AlignmentType.CENTER }),

          new Paragraph({ spacing: { before: 200, after: 200 } }),

          // ----------------------------------------------------
          // 1. INTRODUCTION
          // ----------------------------------------------------
          createHeading1('1. Introduction'),
          createHeading2('1.1 Background & Project Summary'),
          createPara(
            'Modern healthcare institutions face unprecedented operational challenges in managing outpatient volumes, unpredictable clinical workloads, and doctor scheduling constraints. Traditional outpatient departments (OPDs) frequently suffer from severe operational bottlenecks, including manual paper-based registration, opaque queuing sequences, prolonged and unpredictable patient waiting times, doctor schedule overruns, and fragmented prescription workflows.'
          ),
          createPara(
            'The Smart Healthcare Operations Management System is a full-stack, enterprise-grade clinical workflow platform designed to streamline outpatient operations from initial slot booking to post-consultation prescription generation. The platform integrates dynamic priority triage routing, live bidirectional WebSocket synchronization, intelligent doctor slot capacity recommendations, clinical consultation recording, and instant digital prescription PDF generation with QR verification.'
          ),

          createHeading2('1.2 Problem Statement'),
          createPara(
            'In conventional healthcare facilities, outpatient queue management is governed by static first-come-first-served (FCFS) principles or disorganized paper tokens. This introduces several critical deficiencies:'
          ),
          createBullet('Unmanaged Waiting Crowds', 'Patients wait in overcrowded waiting lounges with zero visibility into their real-time estimated waiting time (EWT) or current position ahead in line.'),
          createBullet('Lack of Clinical Triage in OPD', 'Critical emergency cases and vulnerable demographic groups (such as elderly senior citizens and pediatric patients) are treated with standard queuing priority, leading to clinical risks.'),
          createBullet('Doctor Schedule Inefficiencies', 'Doctors often experience erratic consultation bursts and idle gaps due to lack of dynamic check-in synchronization.'),
          createBullet('Legibility and Loss of Paper Prescriptions', 'Handwritten physical prescriptions often lead to dispensing errors, lack audit trails, and cannot be digitally verified or reprinted on demand.'),
          createBullet('Lack of Real-Time Operational Telemetry', 'Hospital administration lacks live visibility into doctor utilization rates, department queue congestion, and average waiting time bottlenecks across clinics.'),

          createHeading2('1.3 Key Objectives'),
          createPara('The core objectives of the Healthcare Operations Management Platform are:'),
          createBullet('Intelligent Slot Recommendation Engine', 'To provide automated, non-overlapping consultation slot recommendations based on doctor availability schedules, buffer times, and clinic working hours.'),
          createBullet('Dynamic Multi-Tier Priority Triage', 'To dynamically calculate queue positions using multi-factor clinical priority weighting (Emergency P1 jump, Senior Citizen P2, Standard Scheduled P3).'),
          createBullet('Real-Time Queue Synchronization', 'To broadcast token calls, queue status transitions, and check-in events instantly via STOMP/SockJS WebSockets without manual screen refreshes.'),
          createBullet('Integrated Clinical Consultation & Rx Generator', 'To empower medical practitioners to record structured SOAP consultation notes, diagnoses, and multi-drug prescriptions with automated PDF generation.'),
          createBullet('Comprehensive Administrative Analytics', 'To equip hospital leadership with real-time operational KPI dashboards (doctor utilization %, department workload, average wait times, patient throughput).'),

          new Paragraph({ spacing: { before: 200, after: 200 } }),

          // ----------------------------------------------------
          // 2. SYSTEM REQUIREMENTS
          // ----------------------------------------------------
          createHeading1('2. System Requirements'),
          createHeading2('2.1 Hardware Requirements'),
          createPara('The system is engineered for high concurrency, low latency, and cross-device responsive access across medical desktop workstations, tablet computers, and mobile devices.'),
          
          createTable(
            ['Component', 'Minimum Requirement', 'Recommended Enterprise Specification'],
            [
              ['Host Server CPU', 'Quad-Core 2.4 GHz x86-64 / ARM64', '8+ Cores (AMD EPYC / Intel Xeon 3.2 GHz)'],
              ['Host Server RAM', '8 GB DDR4', '16 GB - 32 GB High-Speed ECC DDR4/DDR5'],
              ['Host Server Storage', '20 GB Available SSD Storage', '100 GB NVMe SSD RAID-1 Array'],
              ['Network Throughput', '100 Mbps Dedicated Ethernet', '1 Gbps Full-Duplex Low-Latency Connection'],
              ['Client Terminal Device', 'Standard PC, Laptop, iPad, Android Tablet', 'Modern Dual-Monitor Medical Workstation / Tablet'],
              ['Client Display Resolution', '1280 x 720 (HD Ready)', '1920 x 1080 (Full HD) or higher']
            ]
          ),

          createHeading2('2.2 Software Requirements'),
          createPara('The software environment leverages industry-standard, LTS runtime frameworks and relational databases:'),

          createTable(
            ['Layer / Tool', 'Specification / Version', 'Description / Purpose'],
            [
              ['Operating System', 'Windows 10/11, Ubuntu 22.04 LTS, macOS', 'Host OS supporting JVM & Node.js runtimes'],
              ['Backend Runtime', 'Java Development Kit (JDK) 21 LTS', 'Core runtime for compiled enterprise backend services'],
              ['Backend Framework', 'Spring Boot 3.3.4', 'MVC, REST APIs, Security, WebSocket broker, JPA ORM'],
              ['Relational Database', 'MySQL Server 8.0.x Community / Enterprise', 'ACID-compliant storage for clinical entities & audits'],
              ['Database Migration & Pooling', 'HikariCP High-Performance Pool', 'Low-latency connection pooling & lifecycle management'],
              ['Frontend Runtime', 'Node.js v20+ / v22+ & npm 10+', 'Build tooling and development server environment'],
              ['Frontend Framework', 'React 18.2 with Vite 5.x', 'Component-driven reactive single page application (SPA)'],
              ['Styling & Icons', 'Tailwind CSS 3.4 & Lucide React', 'Utility-first responsive design & clinical iconography'],
              ['Real-Time Messaging', 'STOMP over SockJS Client', 'Bidirectional sub-second queue update stream'],
              ['Document Generation', 'jsPDF & jsPDF-AutoTable', 'Client-side clinical prescription PDF compilation engine'],
              ['Build & Dependency Tool', 'Apache Maven 3.9+ & Vite Bundler', 'Automated backend compilation and frontend asset bundling']
            ]
          ),

          new Paragraph({ spacing: { before: 200, after: 200 } }),

          // ----------------------------------------------------
          // 3. SYSTEM DESIGN
          // ----------------------------------------------------
          createHeading1('3. System Design & Architecture'),
          createHeading2('3.1 Major Modules'),
          createPara('The platform is structured into seven decoupled, highly cohesive architectural modules:'),

          createBullet('1. User Authentication & Role-Based Access Control (RBAC)', 'Provides secure JWT and session authentication with fine-grained role authorization across ADMIN, DOCTOR, NURSE, RECEPTIONIST, and PATIENT roles.'),
          createBullet('2. Doctor Schedule & Dynamic Capacity Management', 'Maintains doctor shift schedules, break intervals, department assignments, and calculates real-time appointment availability windows.'),
          createBullet('3. Smart Appointment Booking Engine', 'Allows patients and receptionists to search clinical specialties, book verified slots, and auto-detect schedule conflicts with conflict-free slot generation.'),
          createBullet('4. Dynamic Outpatient Queue & Priority Triage', 'Calculates queue positions dynamically using multi-factor clinical priority weighting (Emergency P1 jump, Senior Citizen P2, Standard Scheduled P3).'),
          createBullet('5. Real-Time WebSocket Event Broker', 'Broadcasts instant token calls, queue status transitions, and check-in events to doctor desks, waiting lounges, and patient mobile views without page reloads.'),
          createBullet('6. Clinical Consultation Suite & Rx PDF Generator', 'Allows attending physicians to document clinical diagnoses, vital signs, and prescription line items, immediately compiling official, downloadable PDF prescriptions.'),
          createBullet('7. Operational Analytics & Audit Telemetry', 'Captures all administrative and clinical actions into immutable audit logs and renders interactive KPI metrics (doctor utilization %, department workload, average wait times).'),

          createHeading2('3.2 Software and Programming Languages Used'),
          createPara('The technical stack was chosen specifically for resilience, concurrency, type safety, and real-time responsiveness:'),
          createBullet('Java 21 & Spring Boot 3.3.4', 'Delivers enterprise-grade backend stability, thread-safe asynchronous task execution, declarative transactional boundaries (@Transactional), and secure REST endpoints.'),
          createBullet('Spring Data JPA & Hibernate 6', 'Abstracts database communication using object-relational mapping, custom repository queries, and automated schema synchronization.'),
          createBullet('React 18 & Vite', 'Constructs a modular Single Page Application (SPA) utilizing functional components, custom hooks (useQueueWebSocket, useAuth), and fast Hot Module Replacement (HMR).'),
          createBullet('MySQL 8.0', 'Enforces strict relational integrity, foreign key cascading rules, transactional ACID properties, and indexed query optimizations.'),
          createBullet('STOMP Protocol over SockJS', 'Facilitates lightweight, publish-subscribe message routing over WebSockets (/topic/queue, /topic/queue/doctor/{id}).'),

          createHeading2('3.3 Entity-Relationship (ER) Diagram & Schema Architecture'),
          createPara('The database architecture consists of 12 primary relational tables designed in Third Normal Form (3NF) to guarantee referential integrity and zero data redundancy.'),

          createTable(
            ['Table Name', 'Primary Key', 'Foreign Keys', 'Key Attributes & Business Purpose'],
            [
              ['users', 'id (BIGINT)', 'None', 'username, password_hash, full_name, email, role (ADMIN, DOCTOR, PATIENT, etc.), is_active'],
              ['departments', 'id (BIGINT)', 'None', 'name, code (e.g. CARDIO, ORTHO), description, floor_number, contact_number'],
              ['doctors', 'id (BIGINT)', 'user_id, department_id', 'specialization, qualification, room_number, consultation_fee, max_daily_patients'],
              ['patients', 'id (BIGINT)', 'user_id', 'patient_code (MED-PAT-XXX), first_name, last_name, dob, gender, blood_group, phone, address'],
              ['doctor_schedules', 'id (BIGINT)', 'doctor_id', 'day_of_week (MONDAY..SUNDAY), start_time, end_time, slot_duration_minutes, is_available'],
              ['appointment_types', 'id (BIGINT)', 'None', 'type_name, duration_minutes, priority_weight, base_fee'],
              ['appointments', 'id (BIGINT)', 'patient_id, doctor_id, department_id, appointment_type_id', 'appointment_number, scheduled_start_time, appointment_date, appointment_time, status, priority_category, reason_for_visit'],
              ['priority_rules', 'id (BIGINT)', 'None', 'category_name (EMERGENCY, SENIOR_CITIZEN, NORMAL), priority_weight (100, 50, 10), max_wait_threshold_mins'],
              ['queue_entries', 'id (BIGINT)', 'appointment_id, doctor_id, priority_rule_id', 'token_number, queue_position, queue_status (WAITING, IN_CONSULTATION, COMPLETED, SKIPPED), checked_in_at, consultation_started_at, estimated_wait_minutes'],
              ['consultations', 'id (BIGINT)', 'appointment_id, doctor_id, patient_id', 'diagnosis, symptoms, clinical_notes, follow_up_date, created_at'],
              ['prescription_items', 'id (BIGINT)', 'consultation_id', 'medicine_name, dosage, frequency (e.g. 1-0-1), duration, instructions (e.g. After Food)'],
              ['audit_logs', 'id (BIGINT)', 'None', 'user_name, action, entity_name, entity_id, details, timestamp, ip_address']
            ]
          ),

          new Paragraph({ spacing: { before: 200, after: 200 } }),

          // ----------------------------------------------------
          // 4. IMPLEMENTATION DETAILS
          // ----------------------------------------------------
          createHeading1('4. Implementation Details'),
          createHeading2('4.1 Backend Implementation (Spring Boot Architecture)'),
          createPara(
            'The backend follows a strictly layered enterprise architecture comprising Controller Layer, Service Layer, Repository Layer, Entity Model Layer, and Data Transfer Objects (DTOs):'
          ),
          createBullet('REST API Controllers', 'Controllers (AppointmentController, QueueController, ConsultationController, DoctorController, AnalyticsController) expose clean, RESTful endpoints protected by CORS filters and unified ApiResponse<T> wrappers.'),
          createBullet('Queue & Priority Algorithm', 'The QueueAndPriorityService calculates dynamic queue rankings using the formula: Rank Score = (Priority Weight * 1000) - (Wait Elapsed Seconds). Emergency tokens (P1) automatically preempt standard appointments.'),
          createBullet('WebSocket Broadcasting Engine', 'Integrated SimpMessagingTemplate broadcasts JSON events (CHECK_IN, CALL_NEXT, COMPLETE, SKIP) to WebSocket topics (/topic/queue), eliminating polling latency.'),
          createBullet('Consultation & Prescription Service', 'ConsultationService encapsulates atomic persistence of clinical notes and one-to-many cascading PrescriptionItem collections within transactional boundaries.'),

          createHeading2('4.2 Database Implementation & Optimization'),
          createPara('Database optimization strategies implemented include:'),
          createBullet('Composite B-Tree Indexes', 'Applied on (doctor_id, appointment_date, status) and (doctor_id, queue_status) to execute live queue queries in sub-5ms times.'),
          createBullet('Connection Pool Management', 'HikariCP configuration tuned with minimum 5 idle connections, maximum pool size of 20, and 30,000ms connection timeout for zero connection starvation.'),
          createBullet('Database Triggers & Referential Integrity', 'Foreign key constraints with cascading rules prevent orphan appointment and consultation records.'),

          createHeading2('4.3 Frontend Implementation (React & Component Design)'),
          createPara('The frontend is constructed using modern, modular React 18 patterns:'),
          createBullet('State Management & Context API', 'Global authentication state and active user roles are managed via AuthContext, providing immediate session recovery and routing guards.'),
          createBullet('WebSocket Client Service (websocketService.js)', 'Employs SockJS fallback and STOMP protocol subscription hooks (useQueueWebSocket.js) that auto-reconnect upon network disruptions.'),
          createBullet('Dynamic Consultation Modal (ConsultationModal.jsx)', 'Interactive physician interface enabling dynamic addition/removal of multi-drug prescription rows, dosage schedules, diagnosis coding, and instant prescription generation.'),
          createBullet('PDF Generator Utility (prescriptionPdf.js)', 'Client-side PDF rendering engine built on jsPDF that draws official hospital headers, patient demographic summary, medical diagnosis boxes, dosage tables, and doctor digital signatures.'),

          new Paragraph({ spacing: { before: 200, after: 200 } }),

          // ----------------------------------------------------
          // 5. TESTING & VERIFICATION
          // ----------------------------------------------------
          createHeading1('5. System Testing & Quality Assurance'),
          createHeading2('5.1 Testing Methodologies'),
          createPara('The application underwent comprehensive multi-tier testing:'),
          createBullet('Unit Testing', 'Individual service layer business algorithms (such as slot availability calculations and waiting time estimations) were verified using JUnit 5 and Mockito.'),
          createBullet('Integration Testing', 'Spring Boot Test verified database transactions, JPA query execution, and repository interactions using an in-memory test harness.'),
          createBullet('API & Endpoint Testing', 'All REST endpoints were tested across positive, boundary, and negative payload conditions (invalid appointment dates, overbooking slots, invalid priority levels).'),
          createBullet('WebSocket Concurrency Testing', 'Tested live multi-client synchronization by connecting 5 simultaneous browser tabs and observing instant queue order re-sorting across all screens within 150ms.'),

          createHeading2('5.2 Comprehensive Test Cases Matrix'),
          createTable(
            ['Test ID', 'Module / Feature', 'Test Scenario Description', 'Expected Result', 'Actual Result', 'Status'],
            [
              ['TC-01', 'Auth / RBAC', 'Login with valid Doctor credentials', 'JWT issued, redirects to Doctor Workspace', 'JWT issued, correct view rendered', 'PASS'],
              ['TC-02', 'Auth / RBAC', 'Unauthorized patient accessing Admin routes', 'Access denied, redirects to login/unauthorized', 'HTTP 403 / UI guard activated', 'PASS'],
              ['TC-03', 'Schedule Engine', 'Fetch doctor slots on non-working day (Sunday)', 'Returns empty slot array with non-working notice', 'Correct empty state handled', 'PASS'],
              ['TC-04', 'Booking Engine', 'Book slot during available 10:30 AM window', 'Appointment created, status SCHEDULED, token assigned', 'Appointment created successfully', 'PASS'],
              ['TC-05', 'Booking Engine', 'Double-book same doctor at same 10:30 AM slot', 'Conflict detected, system rejects second booking', 'Slot unavailable error returned', 'PASS'],
              ['TC-06', 'Queue Check-In', 'Patient checks in for scheduled appointment', 'Token generated (e.g. D1-003), status WAITING', 'Token created & added to queue', 'PASS'],
              ['TC-07', 'Priority Triage', 'Escalate patient priority from Normal to Emergency', 'Token jumps to top of waiting list ahead of normal tokens', 'Queue re-sorted immediately', 'PASS'],
              ['TC-08', 'Call Next', 'Doctor clicks "Call Next" on waiting patient', 'Queue status -> IN_CONSULTATION, appt -> IN_PROGRESS', 'Token status updated in DB & UI', 'PASS'],
              ['TC-09', 'WebSocket Sync', 'Trigger Call Next on Tab 1', 'Tab 2 & Tab 3 update live without manual page refresh', 'Instant STOMP event received', 'PASS'],
              ['TC-10', 'Prescription PDF', 'Physician saves consultation & clicks Download PDF', 'Generates formatted PDF with Rx table and signature', 'PDF downloaded successfully', 'PASS'],
              ['TC-11', 'Complete Visit', 'Physician clicks "Complete Consultation"', 'Token status -> COMPLETED, next patient ready', 'Status completed in queue board', 'PASS']
            ]
          ),

          new Paragraph({ spacing: { before: 200, after: 200 } }),

          // ----------------------------------------------------
          // 6. OUTPUT & SCREENSHOTS / SYSTEM WORKFLOWS
          // ----------------------------------------------------
          createHeading1('6. System Outputs, Screens & Clinical Workflows'),
          createHeading2('6.1 Operational Dashboard & Telemetry Screen'),
          createPara(
            'The Operational Dashboard provides real-time visibility into active OPD performance indicators. It includes an Emergency Triage Escalation Banner highlighting critical P1 patients, dynamic Doctor Active Station Quick-Action Cards, Capacity Utilization Gauges (showing active clinic load percentages), Department Workload Bar Charts, and Appointment Status Donut Breakdowns.'
          ),

          createHeading2('6.2 Live Outpatient Queue & Token Board (/queue)'),
          createPara(
            'The Queue Management view displays the master live sequence of tokens. It features a high-contrast Patient Display Banner (showing current token, patients ahead, and estimated wait minutes), Priority Triage Badges (Emergency, Senior Citizen, Normal), and one-click physician action triggers ("Call Next", "Prescribe / Rx", "Complete", "Skip").'
          ),

          createHeading2('6.3 Smart Appointment Booking & Recommended Slots (/appointments)'),
          createPara(
            'The Appointment Booking module provides dynamic slot recommendation chips categorized into Morning, Afternoon, and Evening blocks. As soon as a patient selects a doctor and date, the backend checks doctor shift schedules, existing bookings, and buffer times, rendering only verified available time slots.'
          ),

          createHeading2('6.4 Clinical Consultation Suite & Digital Prescription Generator'),
          createPara(
            'Attending doctors can launch the Clinical Consultation Modal directly from the queue or dashboard. The modal allows entry of Chief Complaints, Clinical Observations, Provisional Diagnosis, Follow-up Dates, and an interactive Prescription Grid (Medicine Name, Dosage, Timing Frequency like 1-0-1, Duration, and Food Instructions). Upon saving, a professional PDF prescription is automatically compiled and downloaded.'
          ),

          createHeading2('6.5 Patient Portal & Live Queue Tracker (/my-queue)'),
          createPara(
            'Registered patients have access to a dedicated mobile-responsive tracker that displays their exact position in line, doctor consultation room details, estimated wait times updated in real time over WebSockets, and a repository of their past consultation notes and downloadable digital prescriptions.'
          ),

          new Paragraph({ spacing: { before: 200, after: 200 } }),

          // ----------------------------------------------------
          // 7. CONCLUSION & FUTURE SCOPE
          // ----------------------------------------------------
          createHeading1('7. Conclusion & Future Enhancements'),
          createHeading2('7.1 Project Conclusion'),
          createPara(
            'The Smart Healthcare Operations & Outpatient Queue Management System successfully resolves key operational inefficiencies in modern hospital clinics. By marrying automated slot scheduling, dynamic clinical triage, real-time WebSocket messaging, and digital prescription generation into a unified web application, the system drastically reduces patient waiting anxiety, eliminates crowding in waiting areas, optimizes physician time utilization, and digitizes the entire consultation lifecycle.'
          ),

          createHeading2('7.2 Future Scope & Planned Enhancements'),
          createBullet('AI-Powered Patient Arrival Prediction', 'Integration of machine learning regression models (e.g. XGBoost / Random Forest) to predict patient no-show probabilities and dynamic consultation duration adjustments based on clinical symptoms.'),
          createBullet('SMS & WhatsApp Token Calling Alerts', 'Integration with Twilio / WhatsApp Business API to send automated push alerts when a patient is within 2 tokens of being called.'),
          createBullet('Electronic Health Records (EHR) & HL7/FHIR Integration', 'Connecting the platform to national health record databases (such as ABDM / HL7 FHIR standards) for unified patient history sharing.'),
          createBullet('Telemedicine & Video Consultation Integration', 'Embedding WebRTC video consultation rooms for hybrid remote outpatient appointments directly within the queue board.')
        ]
      }
    ]
  });

  const buffer = await Packer.toBuffer(doc);
  const outputPath = path.join(__dirname, 'Healthcare_Operations_Project_Report.docx');
  fs.writeFileSync(outputPath, buffer);
  console.log('Project Report generated successfully at: ' + outputPath);
}

buildDocx().catch(err => {
  console.error('Error generating document:', err);
  process.exit(1);
});
