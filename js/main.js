/**
 * ResolveDesk - Grievance & Complaint Resolution System
 * Shared JavaScript Utilities & Mock State Initialization
 * Designed for Java OOP Mini Project Frontend
 */

document.addEventListener('DOMContentLoaded', () => {
  initSampleComplaints();
  highlightActiveNavLink();
  setupGlobalListeners();
});

/**
 * Initializes default complaints in localStorage simulating Java Collection: List<Complaint>
 */
function initSampleComplaints() {
  if (!localStorage.getItem('resolvedesk_complaints')) {
    const defaultComplaints = [
      {
        id: "CMP-1001",
        title: "Campus Wi-Fi connectivity outage in Computer Lab 3",
        category: "IT & Network",
        priority: "Critical",
        status: "In Progress",
        complainantName: "Aarav Sharma",
        complainantEmail: "aarav.sharma@college.edu",
        department: "Computer Science",
        filingDate: "2026-11-19",
        slaDeadline: "2026-11-20T18:00",
        assignedTo: "Network Operations Center (NOC)",
        description: "The core access point in Lab 3 drops packets continuously, preventing students from completing compiler lab submissions.",
        resolutionNotes: "Replaced faulty switch SFP module; monitoring latency."
      },
      {
        id: "CMP-1002",
        title: "Hostel Block B 3rd Floor water heating geyser not working",
        category: "Hostel & Infrastructure",
        priority: "High",
        status: "Open",
        complainantName: "Rohan Verma",
        complainantEmail: "rohan.verma@college.edu",
        department: "Mechanical Engineering",
        filingDate: "2026-11-20",
        slaDeadline: "2026-11-21T16:00",
        assignedTo: "Estate & Maintenance Cell",
        description: "Electrical trip occurred yesterday evening, causing cold water supply across 12 resident rooms during winter semester.",
        resolutionNotes: ""
      },
      {
        id: "CMP-1003",
        title: "End-Semester Grade Sheet calculation mismatch for CS-502",
        category: "Academic & Grading",
        priority: "Medium",
        status: "Escalated",
        complainantName: "Sneha Patel",
        complainantEmail: "sneha.patel@college.edu",
        department: "Information Technology",
        filingDate: "2026-11-17",
        slaDeadline: "2026-11-19T12:00",
        assignedTo: "Academic Controller of Examinations",
        description: "Mid-term 20% weightage was omitted in final grade calculation sheet despite valid re-test attendance approval.",
        resolutionNotes: "Discrepancy confirmed with subject faculty; awaiting dean signature."
      },
      {
        id: "CMP-1004",
        title: "Library digital barcode scanner failure at issue counter 2",
        category: "Administrative & Accounts",
        priority: "Low",
        status: "Resolved",
        complainantName: "Ananya Iyer",
        complainantEmail: "ananya.iyer@college.edu",
        department: "Electronics & Comm.",
        filingDate: "2026-11-15",
        slaDeadline: "2026-11-18T17:00",
        assignedTo: "Library Tech Support",
        description: "Laser barcode reader failing to decode ISBN tags, leading to manual logging delays during peak hours.",
        resolutionNotes: "Driver reinstalled and USB port reconfigured successfully."
      },
      {
        id: "CMP-1005",
        title: "Physics Optics Lab laser bench alignment screw damaged",
        category: "Laboratory Equipment",
        priority: "High",
        status: "Open",
        complainantName: "Vikram Rao",
        complainantEmail: "vikram.rao@college.edu",
        department: "Computer Science",
        filingDate: "2026-11-21",
        slaDeadline: "2026-11-22T14:00",
        assignedTo: "Physics Lab In-Charge",
        description: "Micro-adjustment thumb screw on interferometer bench is stripped, impeding diffraction experiment readings.",
        resolutionNotes: ""
      },
      {
        id: "CMP-1006",
        title: "Mess cafeteria drinking water filtration filter overdue for change",
        category: "Hostel & Infrastructure",
        priority: "Critical",
        status: "In Progress",
        complainantName: "Pooja Deshmukh",
        complainantEmail: "pooja.d@college.edu",
        department: "Information Technology",
        filingDate: "2026-11-20",
        slaDeadline: "2026-11-21T10:00",
        assignedTo: "Health & Sanitation Committee",
        description: "RO purification unit TDS reading above permissible safe drinking threshold. Urgent servicing required.",
        resolutionNotes: "Maintenance vendor dispatched with replacement membrane filters."
      }
    ];
    localStorage.setItem('resolvedesk_complaints', JSON.stringify(defaultComplaints));
  }
}

/**
 * Highlights active navigation link based on current URL path
 */
function highlightActiveNavLink() {
  const currentPath = window.location.pathname;
  const page = currentPath.split("/").pop() || "index.html";
  
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href === page || (page === '' && href === 'index.html')) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });
}

/**
 * Global Toast Notification Dispatcher
 * @param {string} title 
 * @param {string} message 
 * @param {'success' | 'danger' | 'warning' | 'info'} type 
 */
function showToast(title, message, type = 'info') {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container position-fixed bottom-0 end-0 p-3';
    container.style.zIndex = '9999';
    document.body.appendChild(container);
  }

  const toastId = 'toast_' + Date.now();
  const iconMap = {
    success: 'bi-check-circle-fill text-success',
    danger: 'bi-exclamation-triangle-fill text-danger',
    warning: 'bi-exclamation-circle-fill text-warning',
    info: 'bi-info-circle-fill text-primary'
  };

  const borderMap = {
    success: 'border-success',
    danger: 'border-danger',
    warning: 'border-warning',
    info: 'border-primary'
  };

  const toastHtml = `
    <div id="${toastId}" class="toast align-items-center shadow-lg border-start border-4 ${borderMap[type] || 'border-primary'}" role="alert" aria-live="assertive" aria-atomic="true">
      <div class="toast-header">
        <i class="bi ${iconMap[type] || iconMap.info} me-2 fs-5"></i>
        <strong class="me-auto text-dark">${title}</strong>
        <small class="text-muted">Just now</small>
        <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
      </div>
      <div class="toast-body py-2 text-secondary">
        ${message}
      </div>
    </div>
  `;

  container.insertAdjacentHTML('beforeend', toastHtml);
  const toastElement = document.getElementById(toastId);
  if (window.bootstrap && bootstrap.Toast) {
    const bsToast = new bootstrap.Toast(toastElement, { delay: 4200 });
    bsToast.show();
    toastElement.addEventListener('hidden.bs.toast', () => {
      toastElement.remove();
    });
  }
}

/**
 * Global click event listener simulating Event Handling
 */
function setupGlobalListeners() {
  document.addEventListener('click', (e) => {
    const target = e.target.closest('[data-oop-event]');
    if (target) {
      const eventName = target.getAttribute('data-oop-event');
      console.log(`[OOP Event Handler] Dispatched Event: ${eventName}`);
    }
  });
}
