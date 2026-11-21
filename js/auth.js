/**
 * ResolveDesk - Authentication & Role Hierarchy Module
 * Simulates Java OOP Concepts:
 * - Inheritance (User -> ComplainantUser vs SupportOfficerUser vs SystemAdminUser)
 * - Exception Handling (BadCredentialsException, InvalidEmailFormatException, WeakPasswordException)
 * - Event Handling (UserLoggedInEvent, ComplainantRegisteredEvent)
 * - Encapsulation (Private credentials & access control mutators)
 */

document.addEventListener('DOMContentLoaded', () => {
  setupLoginForm();
  setupRegisterForm();
  setupRoleToggle();
});

/**
 * Handle role switching (Showcasing OOP Inheritance Hierarchy)
 */
function setupRoleToggle() {
  const roleRadios = document.querySelectorAll('input[name="userRole"]');
  const roleDesc = document.getElementById('roleDescriptionText');

  if (roleRadios.length > 0) {
    roleRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        if (radio.value === 'ADMIN') {
          if (roleDesc) roleDesc.innerHTML = '<strong>SystemAdminUser</strong> (Subclass of User): Full system authority, department routing, and audit logs.';
        } else if (radio.value === 'OFFICER') {
          if (roleDesc) roleDesc.innerHTML = '<strong>SupportOfficerUser</strong> (Subclass of User): Resolves assigned tickets, logs action notes, and manages SLAs.';
        } else {
          if (roleDesc) roleDesc.innerHTML = '<strong>ComplainantUser</strong> (Subclass of User): Files new grievances, attaches evidence, and tracks ticket status.';
        }
      });
    });
  }
}

/**
 * Login Form Validation and Simulated Exception Handling
 */
function setupLoginForm() {
  const loginForm = document.getElementById('loginForm');
  if (!loginForm) return;

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value.trim();
    const password = document.getElementById('loginPassword').value.trim();
    const role = document.querySelector('input[name="userRole"]:checked')?.value || 'ADMIN';

    loginForm.classList.remove('was-validated');

    // 1. Validation Check
    if (!email || !password) {
      loginForm.classList.add('was-validated');
      showToast('ValidationException', 'Email and password are required fields.', 'danger');
      return;
    }

    // 2. Exception Handling Simulation: Email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      showToast('InvalidEmailFormatException', `The email address '${email}' violates standard RFC syntax.`, 'danger');
      return;
    }

    // 3. Exception Handling Simulation: Weak password
    if (password.length < 5) {
      showToast('WeakPasswordException', 'Password must be at least 6 characters long.', 'warning');
      return;
    }

    // 4. Exception Handling Simulation: Bad Credentials
    if (password === 'wrongpassword') {
      showToast('BadCredentialsException', 'Authentication failed: Invalid password entered.', 'danger');
      return;
    }

    // Success State
    let displayName = 'Administrator (Nodal Officer)';
    if (role === 'OFFICER') displayName = 'Officer K. Raman (Support Desk)';
    if (role === 'COMPLAINANT') displayName = 'Aarav Sharma (Student Complainant)';

    sessionStorage.setItem('resolvedesk_current_user', JSON.stringify({
      email,
      role,
      name: displayName,
      id: role === 'ADMIN' ? 'ADM-901' : role === 'OFFICER' ? 'OFF-402' : 'CMP-101'
    }));

    showToast('UserLoggedInEvent', `Welcome back, ${displayName}! Redirecting...`, 'success');

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1100);
  });
}

/**
 * Registration Form Validation & Event Dispatching
 */
function setupRegisterForm() {
  const regForm = document.getElementById('registerForm');
  if (!regForm) return;

  regForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (!regForm.checkValidity()) {
      e.stopPropagation();
      regForm.classList.add('was-validated');
      showToast('ValidationException', 'Please fill in all mandatory registration fields.', 'danger');
      return;
    }

    const regId = document.getElementById('regIdNumber').value.trim();
    const fullName = document.getElementById('regFullName').value.trim();
    const email = document.getElementById('regEmail').value.trim();
    const phone = document.getElementById('regPhone').value.trim();
    const department = document.getElementById('regDepartment').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('regConfirmPassword').value;

    if (password !== confirmPassword) {
      showToast('PasswordMismatchException', 'Passwords do not match. Please re-enter.', 'danger');
      return;
    }

    // Duplicate check simulation
    if (email.toLowerCase() === 'admin@college.edu' || email.toLowerCase() === 'aarav.sharma@college.edu') {
      showToast('DuplicateAccountException', `An account with email '${email}' already exists in registry!`, 'danger');
      return;
    }

    showToast('ComplainantRegisteredEvent', `Account for ${fullName} registered successfully! Redirecting to login...`, 'success');

    setTimeout(() => {
      window.location.href = 'login.html';
    }, 1400);
  });
}
