/**
 * ResolveDesk - Complaints & Grievance Management Module
 * Simulates Java OOP Concepts:
 * - Collections (ArrayList / List<Complaint>, PriorityQueue for SLA scheduling)
 * - Encapsulation (Private fields, validating getters & mutators)
 * - File Handling (CSV Import with FileReader, CSV Export with Blob stream)
 * - Exception Handling (DuplicateTicketException, InvalidStatusTransitionException)
 * - Event Handling (ComplaintFiledEvent, ComplaintStatusChangedEvent, ComplaintDeletedEvent)
 */

let complaintsList = [];
let complaintToDeleteId = null;

document.addEventListener('DOMContentLoaded', () => {
  loadComplaints();
  setupFilterAndSearch();
  setupFormValidation();
  setupCsvHandlers();
});

/**
 * Load complaints from localStorage (Simulating Java List<Complaint> service layer)
 */
function loadComplaints() {
  const stored = localStorage.getItem('resolvedesk_complaints');
  complaintsList = stored ? JSON.parse(stored) : [];
  renderComplaintsTable(complaintsList);
  updateComplaintMetrics();
}

/**
 * Renders the complaint tickets table
 * @param {Array} list 
 */
function renderComplaintsTable(list) {
  const tbody = document.getElementById('complaintsTableBody');
  const emptyState = document.getElementById('emptyState');
  const countBadge = document.getElementById('complaintResultCount');

  if (countBadge) {
    countBadge.textContent = `${list.length} Tickets`;
  }

  if (!tbody) return;

  if (list.length === 0) {
    tbody.innerHTML = '';
    if (emptyState) emptyState.classList.remove('d-none');
    return;
  }

  if (emptyState) emptyState.classList.add('d-none');

  const priorityClasses = {
    'Critical': 'priority-critical',
    'High': 'priority-high',
    'Medium': 'priority-medium',
    'Low': 'priority-low'
  };

  const statusClasses = {
    'Open': 'status-open',
    'In Progress': 'status-in-progress',
    'Resolved': 'status-resolved',
    'Escalated': 'status-escalated',
    'Closed': 'status-closed'
  };

  tbody.innerHTML = list.map(c => `
    <tr>
      <td class="font-monospace fw-bold text-dark">${c.id}</td>
      <td>
        <div class="fw-semibold text-dark">${escapeHtml(c.title)}</div>
        <div class="d-flex align-items-center gap-2 mt-1">
          <span class="badge bg-light text-secondary border fs-8">${c.category}</span>
          <span class="text-muted fs-8"><i class="bi bi-clock me-1"></i>${c.filingDate}</span>
        </div>
      </td>
      <td>
        <div class="fs-7 fw-semibold text-dark">${escapeHtml(c.complainantName)}</div>
        <div class="text-muted fs-8">${escapeHtml(c.department)}</div>
      </td>
      <td>
        <span class="priority-badge ${priorityClasses[c.priority] || 'priority-low'}">
          <i class="bi bi-circle-fill" style="font-size: 0.5rem;"></i> ${c.priority}
        </span>
      </td>
      <td>
        <span class="status-badge ${statusClasses[c.status] || 'status-open'}">
          ${c.status}
        </span>
      </td>
      <td>
        <div class="fs-8 text-secondary">
          <i class="bi bi-person-badge me-1"></i>${escapeHtml(c.assignedTo || 'Unassigned')}
        </div>
      </td>
      <td class="text-end">
        <div class="btn-group btn-group-sm">
          <button class="btn btn-outline-secondary" title="View Encapsulated Ticket" onclick="viewComplaintDetails('${c.id}')">
            <i class="bi bi-eye"></i>
          </button>
          <button class="btn btn-outline-primary" title="Update Ticket Status" onclick="openEditComplaintModal('${c.id}')">
            <i class="bi bi-pencil"></i>
          </button>
          <button class="btn btn-outline-danger" title="Delete Ticket" onclick="confirmDeleteComplaint('${c.id}')">
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </td>
    </tr>
  `).join('');
}

/**
 * Filter & Search Logic (Simulating Java Stream Predicates / JPA Criteria)
 */
function setupFilterAndSearch() {
  const searchInput = document.getElementById('searchComplaintInput');
  const catFilter = document.getElementById('filterCategory');
  const prioFilter = document.getElementById('filterPriority');
  const statusFilter = document.getElementById('filterStatus');
  const sortSelect = document.getElementById('sortBySelect');

  function applyFilters() {
    const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
    const cat = catFilter ? catFilter.value : '';
    const prio = prioFilter ? prioFilter.value : '';
    const status = statusFilter ? statusFilter.value : '';
    const sortBy = sortSelect ? sortSelect.value : 'id';

    let filtered = complaintsList.filter(c => {
      const matchesSearch = 
        c.id.toLowerCase().includes(query) ||
        c.title.toLowerCase().includes(query) ||
        c.complainantName.toLowerCase().includes(query) ||
        c.department.toLowerCase().includes(query) ||
        c.description.toLowerCase().includes(query);

      const matchesCat = cat === '' || c.category === cat;
      const matchesPrio = prio === '' || c.priority === prio;
      const matchesStatus = status === '' || c.status === status;

      return matchesSearch && matchesCat && matchesPrio && matchesStatus;
    });

    const priorityWeight = { 'Critical': 4, 'High': 3, 'Medium': 2, 'Low': 1 };

    if (sortBy === 'priority') {
      filtered.sort((a, b) => (priorityWeight[b.priority] || 0) - (priorityWeight[a.priority] || 0));
    } else if (sortBy === 'date_desc') {
      filtered.sort((a, b) => new Date(b.filingDate) - new Date(a.filingDate));
    } else if (sortBy === 'title') {
      filtered.sort((a, b) => a.title.localeCompare(b.title));
    } else {
      filtered.sort((a, b) => a.id.localeCompare(b.id));
    }

    renderComplaintsTable(filtered);
  }

  if (searchInput) searchInput.addEventListener('input', applyFilters);
  if (catFilter) catFilter.addEventListener('change', applyFilters);
  if (prioFilter) prioFilter.addEventListener('change', applyFilters);
  if (statusFilter) statusFilter.addEventListener('change', applyFilters);
  if (sortSelect) sortSelect.addEventListener('change', applyFilters);
}

/**
 * Metric Card Updater
 */
function updateComplaintMetrics() {
  const total = complaintsList.length;
  const pending = complaintsList.filter(c => c.status === 'Open').length;
  const inProgress = complaintsList.filter(c => c.status === 'In Progress').length;
  const resolved = complaintsList.filter(c => c.status === 'Resolved' || c.status === 'Closed').length;

  const totalEl = document.getElementById('metricTotalComplaints');
  const pendingEl = document.getElementById('metricPendingComplaints');
  const inProgEl = document.getElementById('metricInProgressComplaints');
  const resolvedEl = document.getElementById('metricResolvedComplaints');

  if (totalEl) totalEl.textContent = total;
  if (pendingEl) pendingEl.textContent = pending;
  if (inProgEl) inProgEl.textContent = inProgress;
  if (resolvedEl) resolvedEl.textContent = resolved;
}

/**
 * Add / Edit Form Validation & Submission
 */
function setupFormValidation() {
  const addForm = document.getElementById('addComplaintForm');
  if (addForm) {
    addForm.addEventListener('submit', (e) => {
      e.preventDefault();
      if (!addForm.checkValidity()) {
        e.stopPropagation();
        addForm.classList.add('was-validated');
        showToast('ValidationException', 'Please fill in all mandatory ticket fields properly.', 'danger');
        return;
      }

      const id = document.getElementById('newComplaintId').value.trim();
      const title = document.getElementById('newTitle').value.trim();
      const category = document.getElementById('newCategory').value;
      const priority = document.getElementById('newPriority').value;
      const complainantName = document.getElementById('newComplainantName').value.trim();
      const complainantEmail = document.getElementById('newComplainantEmail').value.trim();
      const department = document.getElementById('newDepartment').value;
      const description = document.getElementById('newDescription').value.trim();

      const exists = complaintsList.some(c => c.id.toLowerCase() === id.toLowerCase());
      if (exists) {
        showToast('DuplicateTicketException', `Grievance with Ticket ID "${id}" already exists in registry!`, 'danger');
        return;
      }

      const hoursMap = { 'Critical': 24, 'High': 48, 'Medium': 72, 'Low': 120 };
      const deadlineDate = new Date();
      deadlineDate.setHours(deadlineDate.getHours() + (hoursMap[priority] || 48));

      const newTicket = {
        id,
        title,
        category,
        priority,
        status: "Open",
        complainantName,
        complainantEmail,
        department,
        filingDate: new Date().toISOString().split('T')[0],
        slaDeadline: deadlineDate.toISOString().slice(0, 16),
        assignedTo: category === 'IT & Network' ? 'NOC Helpdesk' : category === 'Hostel & Infrastructure' ? 'Estate Cell' : 'Department Head',
        description,
        resolutionNotes: ""
      };

      complaintsList.unshift(newTicket);
      localStorage.setItem('resolvedesk_complaints', JSON.stringify(complaintsList));
      loadComplaints();

      showToast('ComplaintFiledEvent', `Ticket ${id} registered successfully and routed to ${newTicket.assignedTo}!`, 'success');

      const modalEl = document.getElementById('addComplaintModal');
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) modalInstance.hide();
      addForm.reset();
      addForm.classList.remove('was-validated');
    });
  }

  const editForm = document.getElementById('editComplaintForm');
  if (editForm) {
    editForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const ticketId = document.getElementById('editComplaintId').value;
      const newStatus = document.getElementById('editStatus').value;
      const assignedTo = document.getElementById('editAssignedTo').value.trim();
      const notes = document.getElementById('editResolutionNotes').value.trim();

      const ticket = complaintsList.find(c => c.id === ticketId);
      if (!ticket) return;

      if ((newStatus === 'Resolved' || newStatus === 'Closed') && notes.length < 5) {
        showToast('InvalidStatusTransitionException', 'Resolution notes required to mark ticket as Resolved/Closed.', 'danger');
        return;
      }

      ticket.status = newStatus;
      ticket.assignedTo = assignedTo;
      ticket.resolutionNotes = notes;

      localStorage.setItem('resolvedesk_complaints', JSON.stringify(complaintsList));
      loadComplaints();

      showToast('ComplaintStatusChangedEvent', `Ticket ${ticketId} status updated to [${newStatus}].`, 'success');

      const modalEl = document.getElementById('editComplaintModal');
      const modalInstance = bootstrap.Modal.getInstance(modalEl);
      if (modalInstance) modalInstance.hide();
    });
  }
}

function openAddComplaintModal() {
  const idInput = document.getElementById('newComplaintId');
  idInput.value = 'CMP-' + Math.floor(1000 + Math.random() * 9000);
  
  const form = document.getElementById('addComplaintForm');
  if (form) {
    form.reset();
    form.classList.remove('was-validated');
    idInput.value = 'CMP-' + Math.floor(1000 + Math.random() * 9000);
  }

  const modal = new bootstrap.Modal(document.getElementById('addComplaintModal'));
  modal.show();
}

function openEditComplaintModal(id) {
  const ticket = complaintsList.find(c => c.id === id);
  if (!ticket) {
    showToast('ComplaintNotFoundException', `No ticket found with ID ${id}`, 'danger');
    return;
  }

  document.getElementById('editComplaintId').value = ticket.id;
  document.getElementById('editComplaintTitleHeader').textContent = `${ticket.id}: ${ticket.title}`;
  document.getElementById('editStatus').value = ticket.status;
  document.getElementById('editAssignedTo').value = ticket.assignedTo || '';
  document.getElementById('editResolutionNotes').value = ticket.resolutionNotes || '';

  const modal = new bootstrap.Modal(document.getElementById('editComplaintModal'));
  modal.show();
}

function viewComplaintDetails(id) {
  const ticket = complaintsList.find(c => c.id === id);
  if (!ticket) return;

  const content = document.getElementById('viewDetailsContent');
  if (!content) return;

  content.innerHTML = `
    <div class="border-bottom pb-3 mb-3">
      <div class="d-flex justify-content-between align-items-center mb-1">
        <span class="badge bg-primary-subtle text-primary font-monospace fs-7">${ticket.id}</span>
        <span class="badge bg-light text-secondary border">${ticket.category}</span>
      </div>
      <h5 class="fw-bold text-dark mt-2">${escapeHtml(ticket.title)}</h5>
    </div>

    <div class="row g-3 fs-7">
      <div class="col-6">
        <small class="text-muted d-block">Complainant (Caller)</small>
        <span class="fw-semibold text-dark">${escapeHtml(ticket.complainantName)}</span>
      </div>
      <div class="col-6">
        <small class="text-muted d-block">Department</small>
        <span class="fw-semibold text-dark">${escapeHtml(ticket.department)}</span>
      </div>
      <div class="col-6">
        <small class="text-muted d-block">Priority Level</small>
        <span class="badge ${ticket.priority === 'Critical' ? 'bg-danger' : ticket.priority === 'High' ? 'bg-warning text-dark' : 'bg-secondary'}">${ticket.priority}</span>
      </div>
      <div class="col-6">
        <small class="text-muted d-block">Current Status</small>
        <span class="badge bg-success-subtle text-success border border-success-subtle">${ticket.status}</span>
      </div>
      <div class="col-6">
        <small class="text-muted d-block">Filing Date</small>
        <span class="text-dark">${ticket.filingDate}</span>
      </div>
      <div class="col-6">
        <small class="text-muted d-block">Assigned Resolution Team</small>
        <span class="text-dark fw-semibold">${escapeHtml(ticket.assignedTo || 'Unassigned')}</span>
      </div>
      <div class="col-12">
        <small class="text-muted d-block">Grievance Description (Private Field)</small>
        <div class="p-2.5 bg-light rounded border text-secondary mt-1 fs-8">
          ${escapeHtml(ticket.description)}
        </div>
      </div>
      <div class="col-12">
        <small class="text-muted d-block">Action Taken & Resolution Notes</small>
        <div class="p-2.5 bg-light rounded border text-secondary mt-1 fs-8">
          ${ticket.resolutionNotes ? escapeHtml(ticket.resolutionNotes) : '<span class="text-muted fst-italic">Pending investigation notes.</span>'}
        </div>
      </div>
    </div>
  `;

  const modal = new bootstrap.Modal(document.getElementById('viewDetailsModal'));
  modal.show();
}

function confirmDeleteComplaint(id) {
  complaintToDeleteId = id;
  const ticket = complaintsList.find(c => c.id === id);
  const targetLabel = document.getElementById('deleteTargetName');
  if (targetLabel && ticket) {
    targetLabel.textContent = `"${ticket.title}" (${ticket.id})`;
  }

  const modal = new bootstrap.Modal(document.getElementById('deleteConfirmModal'));
  modal.show();
}

function executeDeleteStudent() {
  if (!complaintToDeleteId) return;

  const idx = complaintsList.findIndex(c => c.id === complaintToDeleteId);
  if (idx !== -1) {
    const deleted = complaintsList.splice(idx, 1)[0];
    localStorage.setItem('resolvedesk_complaints', JSON.stringify(complaintsList));
    loadComplaints();
    showToast('ComplaintDeletedEvent', `Ticket ${deleted.id} removed from system.`, 'warning');
  }

  const modalEl = document.getElementById('deleteConfirmModal');
  const modalInstance = bootstrap.Modal.getInstance(modalEl);
  if (modalInstance) modalInstance.hide();
  complaintToDeleteId = null;
}

function setupCsvHandlers() {
  const exportBtn = document.getElementById('exportCsvBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      exportComplaintsToCSV();
    });
  }

  const fileInput = document.getElementById('importCsvInput');
  if (fileInput) {
    fileInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = function(evt) {
        try {
          const text = evt.target.result;
          parseAndImportCsv(text);
          fileInput.value = '';
        } catch (err) {
          showToast('FileProcessingException', 'Failed to parse CSV file: ' + err.message, 'danger');
        }
      };
      reader.onerror = function() {
        showToast('IOException', 'Error reading input file stream.', 'danger');
      };
      reader.readAsText(file);
    });
  }
}

function exportComplaintsToCSV() {
  if (complaintsList.length === 0) {
    showToast('EmptyCollectionWarning', 'No complaint records available to export.', 'warning');
    return;
  }

  const headers = ['Ticket ID', 'Title', 'Category', 'Priority', 'Status', 'Complainant', 'Email', 'Department', 'Date', 'Assigned To', 'Description'];
  const rows = complaintsList.map(c => [
    `"${c.id}"`,
    `"${c.title.replace(/"/g, '""')}"`,
    `"${c.category}"`,
    `"${c.priority}"`,
    `"${c.status}"`,
    `"${c.complainantName}"`,
    `"${c.complainantEmail}"`,
    `"${c.department}"`,
    `"${c.filingDate}"`,
    `"${c.assignedTo || ''}"`,
    `"${c.description.replace(/"/g, '""')}"`
  ]);

  const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `ResolveDesk_Grievances_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  showToast('FileExportSuccess', 'Grievance database exported to CSV successfully (File Handling)!', 'success');
}

function parseAndImportCsv(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    throw new Error('CSV file contains no data rows.');
  }

  let importedCount = 0;
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = line.split(',').map(s => s.replace(/(^"|"$)/g, '').trim());
    if (parts.length >= 5) {
      const [id, title, category, priority, status, complainantName, email, department] = parts;
      
      const ticketId = id || ('CMP-' + Math.floor(1000 + Math.random() * 9000));
      const existingIdx = complaintsList.findIndex(c => c.id === ticketId);

      const ticketObj = {
        id: ticketId,
        title: title || 'Imported Grievance',
        category: category || 'Administrative & Accounts',
        priority: priority || 'Medium',
        status: status || 'Open',
        complainantName: complainantName || 'Anonymous Complainant',
        complainantEmail: email || 'anonymous@college.edu',
        department: department || 'General Services',
        filingDate: new Date().toISOString().split('T')[0],
        slaDeadline: '2026-11-23T18:00',
        assignedTo: 'Support Desk Tier-1',
        description: 'Imported batch grievance record.',
        resolutionNotes: ''
      };

      if (existingIdx !== -1) {
        complaintsList[existingIdx] = ticketObj;
      } else {
        complaintsList.push(ticketObj);
      }
      importedCount++;
    }
  }

  localStorage.setItem('resolvedesk_complaints', JSON.stringify(complaintsList));
  loadComplaints();
  showToast('FileImportSuccess', `Successfully imported ${importedCount} grievance tickets from CSV!`, 'success');
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
