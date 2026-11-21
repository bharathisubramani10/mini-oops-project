/**
 * ResolveDesk - Dashboard Interactivity Module
 * Simulates Java OOP Concepts:
 * - Threading (SLA Monitor Daemon Thread: ScheduledExecutorService / Runnable)
 * - Logging (SLF4J / Logback appender with INFO, WARN, ERROR, DEBUG streams)
 * - Polymorphism (Dynamic Escalation Strategy Dispatch: EscalationPolicyStrategy interface)
 * - Collections (PriorityQueue for ticket SLA urgency scheduling, HashMap for category breakdown)
 */

let slaMonitorInterval = null;
let isThreadRunning = true;
let activityLogs = [];

document.addEventListener('DOMContentLoaded', () => {
  initDashboardMetrics();
  initLogStream();
  initThreadingSimulation();
  initPolymorphicEscalationDemo();
});

/**
 * Calculates dashboard metrics from stored complaints collection
 */
function initDashboardMetrics() {
  const stored = localStorage.getItem('resolvedesk_complaints');
  const complaints = stored ? JSON.parse(stored) : [];

  const total = complaints.length;
  const open = complaints.filter(c => c.status === 'Open').length;
  const inProgress = complaints.filter(c => c.status === 'In Progress').length;
  const resolved = complaints.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;
  const critical = complaints.filter(c => c.priority === 'Critical').length;

  const totalEl = document.getElementById('dashTotalComplaints');
  const openEl = document.getElementById('dashOpenComplaints');
  const inProgEl = document.getElementById('dashInProgressComplaints');
  const resolvedEl = document.getElementById('dashResolvedComplaints');
  const criticalEl = document.getElementById('dashCriticalComplaints');

  if (totalEl) totalEl.textContent = total;
  if (openEl) openEl.textContent = open;
  if (inProgEl) inProgEl.textContent = inProgress;
  if (resolvedEl) resolvedEl.textContent = resolved;
  if (criticalEl) criticalEl.textContent = critical;

  renderCategoryDistribution(complaints);
}

/**
 * Renders category breakdown
 * @param {Array} complaints 
 */
function renderCategoryDistribution(complaints) {
  const container = document.getElementById('categoryDistributionContainer');
  if (!container || complaints.length === 0) return;

  // Simulating Java HashMap<String, Integer> aggregation
  const catCounts = {};
  complaints.forEach(c => {
    catCounts[c.category] = (catCounts[c.category] || 0) + 1;
  });

  const total = complaints.length;
  const colors = ['bg-primary', 'bg-warning', 'bg-info', 'bg-danger', 'bg-success'];
  let colorIdx = 0;

  const html = Object.entries(catCounts).map(([cat, count]) => {
    const percent = Math.round((count / total) * 100);
    const color = colors[colorIdx % colors.length];
    colorIdx++;

    return `
      <div class="mb-3">
        <div class="d-flex justify-content-between align-items-center mb-1">
          <span class="fs-7 fw-semibold text-dark">${cat}</span>
          <span class="fs-7 text-muted">${count} tickets (${percent}%)</span>
        </div>
        <div class="progress" style="height: 8px;">
          <div class="progress-bar ${color}" role="progressbar" style="width: ${percent}%;" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"></div>
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
}

/**
 * Simulates Background SLA Monitor Threading
 * Simulating Java `ScheduledExecutorService` / `Runnable`
 */
function initThreadingSimulation() {
  const threadStatusBadge = document.getElementById('threadStatusBadge');
  const toggleThreadBtn = document.getElementById('toggleThreadBtn');
  const notificationList = document.getElementById('backgroundNotificationList');

  const simulatedWorkerTasks = [
    { title: "SLA Watchdog Daemon", msg: "Scanned open tickets against SLA deadlines. 1 ticket nearing 4-hour threshold.", icon: "bi-stopwatch-fill", type: "warning" },
    { title: "Auto-Dispatch Thread", msg: "Dispatched automated SMS/Email notification to Estate Maintenance supervisor.", icon: "bi-send-check-fill", type: "info" },
    { title: "PriorityQueue Sorter", msg: "Re-ordered dispatch queue: Critical priority ticket #CMP-1006 moved to top priority slot.", icon: "bi-sort-numeric-down", type: "primary" },
    { title: "Resolved Ticket Archiver", msg: "Archived resolved ticket audit logs into compressed storage partition.", icon: "bi-archive-fill", type: "success" }
  ];

  let taskPointer = 0;

  function runThreadCycle() {
    if (!isThreadRunning || !notificationList) return;

    const task = simulatedWorkerTasks[taskPointer % simulatedWorkerTasks.length];
    taskPointer++;

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const itemHtml = `
      <div class="list-group-item d-flex align-items-start gap-3 py-3 animate-fade-in border-start border-3 border-${task.type}">
        <div class="stat-icon ${task.type} flex-shrink-0" style="width: 38px; height: 38px; font-size: 1.1rem;">
          <i class="bi ${task.icon}"></i>
        </div>
        <div class="flex-grow-1">
          <div class="d-flex justify-content-between align-items-center">
            <h6 class="mb-0 fs-7 fw-bold text-dark">${task.title}</h6>
            <small class="text-muted font-monospace">${now}</small>
          </div>
          <p class="mb-0 fs-8 text-secondary mt-1">${task.msg}</p>
        </div>
      </div>
    `;

    notificationList.insertAdjacentHTML('afterbegin', itemHtml);

    while (notificationList.children.length > 5) {
      notificationList.removeChild(notificationList.lastChild);
    }

    addLogEntry('DEBUG', `[Thread: sla-monitor-worker-${Math.floor(Math.random()*8)}] ${task.title}: cycle executed successfully.`);
  }

  slaMonitorInterval = setInterval(runThreadCycle, 8500);

  if (toggleThreadBtn) {
    toggleThreadBtn.addEventListener('click', () => {
      isThreadRunning = !isThreadRunning;
      if (isThreadRunning) {
        threadStatusBadge.className = "badge bg-success-subtle text-success border border-success-subtle";
        threadStatusBadge.innerHTML = '<span class="spinner-grow spinner-grow-sm me-1" role="status"></span> SLA Daemon Active';
        toggleThreadBtn.innerHTML = '<i class="bi bi-pause-fill me-1"></i> Pause Daemon';
        showToast('Thread Resumed', 'SLA Watchdog ExecutorService daemon resumed.', 'info');
      } else {
        threadStatusBadge.className = "badge bg-secondary-subtle text-secondary border border-secondary-subtle";
        threadStatusBadge.textContent = 'SLA Daemon Paused';
        toggleThreadBtn.innerHTML = '<i class="bi bi-play-fill me-1"></i> Resume Daemon';
        showToast('Thread Paused', 'SLA Watchdog daemon thread paused.', 'warning');
      }
    });
  }
}

/**
 * Simulates SLF4J / Logback Logging Framework
 */
function initLogStream() {
  const initialLogs = [
    { level: 'INFO', time: '09:00:15', msg: 'ResolveDesk Application Context started on port 8080.' },
    { level: 'INFO', time: '09:01:22', msg: 'DataSource initialized: HikariPool-1 connection pool active [MySQL 8.0].' },
    { level: 'DEBUG', time: '09:02:40', msg: 'PriorityQueue<Complaint> initialized with natural SLA comparator.' },
    { level: 'WARN', time: '09:05:11', msg: 'Ticket #CMP-1003 SLA breached by 2 hours. Notification dispatched.' },
    { level: 'INFO', time: '09:08:02', msg: 'GlobalExceptionHandler loaded 12 custom application exception bindings.' }
  ];

  activityLogs = [...initialLogs];
  renderLogs('ALL');

  const filterBtns = document.querySelectorAll('.log-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active', 'btn-dark'));
      filterBtns.forEach(b => b.classList.add('btn-outline-secondary'));
      btn.classList.add('active', 'btn-dark');
      btn.classList.remove('btn-outline-secondary');

      const level = btn.getAttribute('data-log-level');
      renderLogs(level);
    });
  });

  const clearBtn = document.getElementById('clearLogsBtn');
  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      activityLogs = [];
      renderLogs('ALL');
      showToast('LogBufferCleared', 'Log stream buffer cleared.', 'info');
    });
  }
}

/**
 * Appends a log entry
 * @param {'INFO' | 'WARN' | 'ERROR' | 'DEBUG'} level 
 * @param {string} msg 
 */
function addLogEntry(level, msg) {
  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  activityLogs.unshift({ level, time, msg });
  if (activityLogs.length > 50) activityLogs.pop();

  const activeBtn = document.querySelector('.log-filter-btn.active');
  const currentFilter = activeBtn ? activeBtn.getAttribute('data-log-level') : 'ALL';
  renderLogs(currentFilter);
}

/**
 * Renders the log entries
 * @param {string} filterLevel 
 */
function renderLogs(filterLevel) {
  const container = document.getElementById('activityLogStream');
  if (!container) return;

  const filtered = filterLevel === 'ALL' ? activityLogs : activityLogs.filter(l => l.level === filterLevel);

  if (filtered.length === 0) {
    container.innerHTML = '<div class="text-muted text-center py-4 fs-7">No log entries found for this filter.</div>';
    return;
  }

  const levelBadges = {
    'INFO': 'bg-primary-subtle text-primary border border-primary-subtle',
    'WARN': 'bg-warning-subtle text-warning border border-warning-subtle',
    'ERROR': 'bg-danger-subtle text-danger border border-danger-subtle',
    'DEBUG': 'bg-secondary-subtle text-secondary border border-secondary-subtle'
  };

  container.innerHTML = filtered.map(log => `
    <div class="d-flex align-items-center gap-2 py-1 border-bottom border-light font-monospace fs-8">
      <span class="text-muted" style="min-width: 70px;">${log.time}</span>
      <span class="badge ${levelBadges[log.level] || 'bg-light text-dark'}" style="min-width: 55px; font-size: 0.7rem;">${log.level}</span>
      <span class="text-dark text-truncate">${escapeHtml(log.msg)}</span>
    </div>
  `).join('');
}

/**
 * Demonstrates Polymorphism in Action:
 * Simulating Java Interface `EscalationPolicyStrategy` overridden by:
 * - TechnicalEscalationStrategy
 * - InfrastructureEscalationStrategy
 * - AcademicGrievanceStrategy
 * - CampusSafetyEscalationStrategy
 */
function initPolymorphicEscalationDemo() {
  const runBtn = document.getElementById('runEscalationStrategyBtn');
  const catSelect = document.getElementById('polyCategorySelect');
  const prioSelect = document.getElementById('polyPrioritySelect');
  const resultCard = document.getElementById('polyResultOutput');

  if (!runBtn) return;

  runBtn.addEventListener('click', () => {
    const cat = catSelect ? catSelect.value : 'IT';
    const prio = prioSelect ? prioSelect.value : 'Critical';

    let strategy;

    if (cat === 'IT') {
      strategy = {
        className: "TechnicalEscalationStrategy (implements EscalationPolicyStrategy)",
        authority: "Chief Technology Officer & NOC Lead",
        slaHours: prio === 'Critical' ? 4 : prio === 'High' ? 12 : 24,
        routingAction: "Direct routing to Hardware/Network On-Call Engineering Squad with SMS alert."
      };
    } else if (cat === 'HOSTEL') {
      strategy = {
        className: "InfrastructureEscalationStrategy (implements EscalationPolicyStrategy)",
        authority: "Estate Officer & Chief Hostel Warden",
        slaHours: prio === 'Critical' ? 6 : prio === 'High' ? 24 : 48,
        routingAction: "Physical inspection team dispatched; contractor purchase order auto-generated."
      };
    } else if (cat === 'ACADEMIC') {
      strategy = {
        className: "AcademicGrievanceStrategy (implements EscalationPolicyStrategy)",
        authority: "Dean of Academic Affairs & Examination Ombudsperson",
        slaHours: prio === 'Critical' ? 24 : prio === 'High' ? 48 : 72,
        routingAction: "Faculty scrutiny committee summoned; evaluated answer scripts impounded."
      };
    } else {
      strategy = {
        className: "CampusSafetyEscalationStrategy (implements EscalationPolicyStrategy)",
        authority: "Campus Safety Directorate & Executive Proctor",
        slaHours: 2,
        routingAction: "Immediate priority-0 dispatch; security personnel deployment and incident log lock."
      };
    }

    if (resultCard) {
      resultCard.classList.remove('d-none');
      resultCard.innerHTML = `
        <div class="alert alert-primary mb-0 animate-fade-in border-start border-4 border-primary">
          <div class="d-flex align-items-center mb-1">
            <i class="bi bi-diagram-3-fill fs-5 text-primary me-2"></i>
            <strong class="text-dark">Polymorphic Escalation Strategy Resolved:</strong>
          </div>
          <div class="fs-7 text-secondary mb-2">
            <span class="code-pill">${strategy.className}</span>
          </div>
          <div class="bg-white p-3 rounded border">
            <div class="d-flex justify-content-between align-items-center mb-1">
              <span class="fw-bold text-dark fs-6">${strategy.authority}</span>
              <span class="badge bg-danger">SLA: ${strategy.slaHours} Hours</span>
            </div>
            <div class="text-secondary fs-8 mt-1">${strategy.routingAction}</div>
          </div>
        </div>
      `;
    }

    showToast('PolymorphismExecuted', `Strategy executed: ${strategy.className.split(' ')[0]}`, 'success');
    addLogEntry('INFO', `Escalation policy dispatched via ${strategy.className} with SLA ${strategy.slaHours}h.`);
  });
}

function escapeHtml(text) {
  if (!text) return '';
  return text.replace(/[&<>"']/g, function(m) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    }[m];
  });
}
