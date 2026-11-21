# ResolveDesk — Complaint Resolution & Grievance Tracking System
### Modern, Responsive Frontend Web Application for Java OOP Mini Project Evaluation

---

## 📌 Project Overview
**ResolveDesk** is an enterprise-grade Complaint Resolution and Grievance Redressal System designed to automate ticket lodging, SLA deadline monitoring, multi-tier escalation, and audit logging. 

It is built using **HTML5, CSS3, Bootstrap 5, and JavaScript** specifically to satisfy every requirement of an **Object-Oriented Programming (OOP) College Mini Project Report and Viva Voce**. 

> **Frontend-Only Design:** The system runs directly in any browser (`Chrome`, `Edge`, `Firefox`) without requiring any database or backend server installation. All data is managed through modern client-side storage, with realistic simulations for Java collections, threads, streams, and exceptions.

---

## 🚀 Tech Stack
- **Presentation:** Semantic HTML5 & Modern Responsive CSS3
- **Styling Framework:** Bootstrap 5.3.3 (via CDN)
- **Icons:** Bootstrap Icons 1.11.3 (via CDN)
- **Typography:** Inter & Fira Code (Google Fonts)
- **Logic & Concurrency Simulation:** Vanilla JavaScript (ES6+, DOM APIs, LocalStorage, Web File APIs)

---

## 📂 Project Directory Structure

```text
mini oops/
│
├── index.html              # Home landing page with workflow flowchart & live metrics
├── login.html              # Role-based login (Complainant vs Officer vs Admin inheritance)
├── register.html           # Complainant registration form with validation & events
├── dashboard.html          # Grievance operations dashboard with SLA watchdog thread & logs
├── complaints.html         # Grievance Registry: Full CRUD, Search, Filters, CSV Import/Export
├── profile.html            # Profile page demonstrating Encapsulation (Private fields & Getters)
├── about.html              # Academic viva voce guide & 10 OOP Concept breakdown cards
│
├── css/
│   └── style.css           # Custom styles, priority badges, status pills, and animations
│
├── js/
│   ├── main.js             # Shared utilities, toast notifications, mock data initialization
│   ├── auth.js             # Form validation, role hierarchy, mock Java exceptions
│   ├── dashboard.js        # SLA Watchdog thread simulation, SLF4J log stream, polymorphism
│   └── complaints.js       # Grievance collection CRUD, search, filter, CSV File I/O
│
├── sample_complaints.csv   # Ready-to-use CSV dataset for testing the CSV Import feature
└── README.md               # Project documentation & college report reference
```

---

## 🎯 10 Java OOP Concepts Mapping Table

| No. | Java OOP Concept | Where It Exists in ResolveDesk | Backend Java Architecture Mapping |
|:---:|:---|:---|:---|
| **1** | **Encapsulation** | **[complaints.html](file:///d:/Downloads/mini%20oops/complaints.html)** & **[profile.html](file:///d:/Downloads/mini%20oops/profile.html)** | `private` variables (`id`, `title`, `priority`, `status`, `slaDeadline`). Getter methods control read access, while setter mutators enforce validation rules (e.g. status transition constraints). |
| **2** | **Inheritance** | **[login.html](file:///d:/Downloads/mini%20oops/login.html)** & User Model | Base class `BaseEntity` inherited by domain models. Parent class `User` is subclassed into `ComplainantUser`, `SupportOfficerUser`, and `SystemAdminUser`. |
| **3** | **Polymorphism** | **[dashboard.html](file:///d:/Downloads/mini%20oops/dashboard.html)** Escalation Engine | Interface `EscalationPolicyStrategy` overridden by `TechnicalEscalationStrategy`, `InfrastructureEscalationStrategy`, and `AcademicGrievanceStrategy`. Overloaded `searchComplaints()` methods. |
| **4** | **Interface** | **Service Layer Contracts** | `ComplaintService` implemented by `ComplaintServiceImpl`, `NotificationChannel` (Email/SMS), and `ReportExporter` ensuring loose coupling. |
| **5** | **Exception Handling** | **[login.html](file:///d:/Downloads/mini%20oops/login.html)** & **[complaints.html](file:///d:/Downloads/mini%20oops/complaints.html)** | Custom exceptions: `ComplaintNotFoundException`, `DuplicateTicketException`, `InvalidStatusTransitionException`, `BadCredentialsException` handled via `@ControllerAdvice`. |
| **6** | **Collections** | **[complaints.html](file:///d:/Downloads/mini%20oops/complaints.html)** Ticket Registry | `ArrayList<Complaint>` for table listing, `PriorityQueue` for SLA urgency scheduling, `HashMap` for category counts, and `HashSet` for unique tracking tags. |
| **7** | **File Handling** | **[complaints.html](file:///d:/Downloads/mini%20oops/complaints.html)** CSV Import & Export | Live CSV file download generated via browser `Blob` (representing `BufferedWriter`/`FileWriter`) and CSV file upload parsing via `FileReader` (representing `BufferedReader`/`FileReader`). |
| **8** | **Threading** | **[dashboard.html](file:///d:/Downloads/mini%20oops/dashboard.html)** SLA Watchdog | Background worker daemon (`ScheduledExecutorService` / `Runnable`) asynchronously checking for approaching SLA breaches and dispatching alerts with live pause/resume control. |
| **9** | **Logging** | **[dashboard.html](file:///d:/Downloads/mini%20oops/dashboard.html)** Telemetry Stream | SLF4J / Logback framework simulation with live level filtering across `ALL`, `INFO`, `WARN`, `ERROR`, and `DEBUG` logs. |
| **10** | **Event Handling** | **Action Buttons & Form Submissions** | Spring Application Events: `ComplaintFiledEvent`, `ComplaintStatusChangedEvent`, `ComplaintEscalatedEvent` triggered by user interactions. |

---

## 💻 How to Run the Website

### Option 1: Direct Browser Launch (Easiest)
1. Open folder `d:\Downloads\mini oops`.
2. Double-click **`index.html`** or right-click &rarr; **Open with** &rarr; **Google Chrome** (or Edge).
3. The application will immediately load with pre-populated grievance records and live simulated threads.

### Option 2: Using VS Code Live Server
1. Open the `mini oops` folder in Visual Studio Code.
2. Install the **Live Server** extension.
3. Right-click `index.html` and click **"Open with Live Server"**.

---

## 🧪 Interactive Features to Showcase During Viva Voce

1. **Grievance Registry (`complaints.html`)**:
   - **Real CSV Export**: Click **"Export CSV"** to generate and download a real `ResolveDesk_Grievances_YYYY-MM-DD.csv` file directly from the browser.
   - **Real CSV Import**: Click **"Import CSV"** and select the included `sample_complaints.csv` file &mdash; 5 new grievance tickets will be parsed and loaded into the table on the fly!
   - **Live Search & Filter**: Search by Ticket ID, Title, or Complainant name. Filter dynamically by Category, Priority, or Status.
   - **File New Grievance**: Click **"+ File New Grievance"** to test the modal form with validation constraints.
   - **Encapsulated View**: Click the **Eye icon** on any ticket to view private fields, SLA timers, and resolution notes.
   - **Update Status**: Click the **Pencil icon** to update status and add action taken notes.

2. **Operations Dashboard (`dashboard.html`)**:
   - **SLA Watchdog Daemon**: Observe the background thread notification center updating with asynchronous tasks every few seconds. Click **"Pause Daemon" / "Resume Daemon"** to showcase thread lifecycle.
   - **Polymorphic Escalation Demo**: Select a grievance category (IT vs Hostel vs Academic vs Safety), pick a severity level, and click **"Execute"** to see dynamic escalation strategy resolution.
   - **Logging Telemetry Stream**: Toggle log filters between `INFO`, `WARN`, `ERROR`, and `DEBUG`.

3. **Authentication (`login.html`)**:
   - Switch between **AdminUser**, **SupportOfficer**, and **Complainant** to demonstrate subclass inheritance.
   - Click the **"Viva Quick-Fill"** buttons to auto-populate test credentials.
   - Enter password `wrongpassword` to demonstrate custom Java exception handling (`BadCredentialsException`).

4. **Academic Viva Voce Guide (`about.html`)**:
   - Contains a complete report breakdown, architecture flow diagram, 10 concept code snippets, and model answers to top viva questions.
