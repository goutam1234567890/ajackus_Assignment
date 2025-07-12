// Main app logic
let employees = JSON.parse(localStorage.getItem('employees')) || [...(window.mockEmployees || [])];
let currentPage = 1;
let itemsPerPage = 2;
let searchQuery = '';
let filter = { firstName: '', department: '', role: '' };
let sortBy = '';
let sortDir = 'asc';
let sidebarFilterVisible = false;

function saveEmployees() {
    localStorage.setItem('employees', JSON.stringify(employees));
}

function renderApp() {
    renderDashboard();
}

function renderDashboard() {
    const app = document.getElementById('app');
    app.innerHTML = `
        <div class="dashboard-header">
            <h1 class="dashboard-title">Employee Directory</h1>
            <div class="dashboard-controls">
                <input type="search" id="search-input" class="search-input" placeholder="Search by name or email" value="${searchQuery}">
                <button id="filter-btn" class="filter-btn">Filter</button>
            </div>
        </div>
        <div style="display:flex;">
            <div style="flex:1;">
                <div class="dashboard-controls" style="gap:10px;padding:16px 0 0 16px;">
                    <label>Sort: <select id="sort-select"><option value="">--Select--</option><option value="firstName">First Name</option><option value="department">Department</option></select></label>
                    <label>Show: <select id="items-per-page">
                        <option value="2"${itemsPerPage === 2 ? ' selected' : ''}>2</option>
                        <option value="4"${itemsPerPage === 4 ? ' selected' : ''}>4</option>
                        <option value="6"${itemsPerPage === 6 ? ' selected' : ''}>6</option>
                        <option value="10"${itemsPerPage === 10 ? ' selected' : ''}>10</option>
                        <option value="25"${itemsPerPage === 25 ? ' selected' : ''}>25</option>
                        <option value="50"${itemsPerPage === 50 ? ' selected' : ''}>50</option>
                        <option value="100"${itemsPerPage === 100 ? ' selected' : ''}>100</option>
                    </select></label>
                    <button id="add-employee-btn" class="add-employee-btn">Add Employee</button>
                </div>
                <div class="employee-list">
                    ${getPaginatedEmployees().map(emp => `
                        <div class="employee-card" data-employee-id="${emp.id}">
                            <strong>${emp.firstName} ${emp.lastName}</strong><br>
                            <b>Email:</b> ${emp.email}<br>
                            <b>Department:</b> ${emp.department}<br>
                            <b>Role:</b> ${emp.role}<br>
                            <div style="margin-top:10px;">
                                <button class="edit-btn" data-id="${emp.id}" style="padding:4px 12px;">Edit</button>
                                <button class="delete-btn" data-id="${emp.id}" style="padding:4px 12px;">Delete</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
                <div class="pagination-controls">
                    ${renderPaginationControls()}
                </div>
            </div>
            ${sidebarFilterVisible ? `
            <div class="sidebar-filter">
                <form id="filter-form" class="sidebar-form">
                    <h3>Filter Employees</h3>
                    <div class="sidebar-form-group">
                        <label for="filter-firstName">First Name:</label>
                        <input type="text" id="filter-firstName" name="firstName" value="${filter.firstName}">
                    </div>
                    <div class="sidebar-form-group">
                        <label for="filter-department">Department:</label>
                        <input type="text" id="filter-department" name="department" value="${filter.department}">
                    </div>
                    <div class="sidebar-form-group">
                        <label for="filter-role">Role:</label>
                        <input type="text" id="filter-role" name="role" value="${filter.role}">
                    </div>
                    <button type="submit" style="padding:4px 14px;">Apply</button>
                    <button type="button" id="clear-filter-btn" style="padding:4px 14px;">Reset</button>
                </form>
            </div>
            ` : ''}
        </div>
        <div class="footer">© 2025 Employee Directory App. All rights reserved.</div>
    `;
    attachDashboardEvents();
}

function getPaginatedEmployees() {
    let filtered = employees.filter(emp => {
        const matchesSearch =
            emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFirstName = filter.firstName ? emp.firstName.toLowerCase().includes(filter.firstName.toLowerCase()) : true;
        const matchesDepartment = filter.department ? emp.department === filter.department : true;
        const matchesRole = filter.role ? emp.role === filter.role : true;
        return matchesSearch && matchesFirstName && matchesDepartment && matchesRole;
    });
    if (sortBy) {
        filtered.sort((a, b) => {
            let valA = a[sortBy].toLowerCase();
            let valB = b[sortBy].toLowerCase();
            if (valA < valB) return sortDir === 'asc' ? -1 : 1;
            if (valA > valB) return sortDir === 'asc' ? 1 : -1;
            return 0;
        });
    }
    const start = (currentPage - 1) * itemsPerPage;
    return filtered.slice(start, start + itemsPerPage);
}

function renderPaginationControls() {
    let filteredCount = employees.filter(emp => {
        const matchesSearch =
            emp.firstName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
            emp.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesFirstName = filter.firstName ? emp.firstName.toLowerCase().includes(filter.firstName.toLowerCase()) : true;
        const matchesDepartment = filter.department ? emp.department === filter.department : true;
        const matchesRole = filter.role ? emp.role === filter.role : true;
        return matchesSearch && matchesFirstName && matchesDepartment && matchesRole;
    }).length;
    const totalPages = Math.ceil(filteredCount / itemsPerPage);
    let html = '';
    if (totalPages > 1) {
        html += `<button ${currentPage === 1 ? 'disabled' : ''} data-page="${currentPage - 1}" class="page-btn">Prev</button>`;
        for (let i = 1; i <= totalPages; i++) {
            html += `<button ${i === currentPage ? 'disabled' : ''} data-page="${i}" class="page-btn">${i}</button>`;
        }
        html += `<button ${currentPage === totalPages ? 'disabled' : ''} data-page="${currentPage + 1}" class="page-btn">Next</button>`;
    }
    return html;
}

function attachDashboardEvents() {
    document.getElementById('filter-btn').onclick = function() {
        sidebarFilterVisible = !sidebarFilterVisible;
        renderDashboard();
    };
    if (sidebarFilterVisible) {
        document.getElementById('filter-form').onsubmit = function(e) {
            e.preventDefault();
            filter.firstName = document.getElementById('filter-firstName').value.trim();
            filter.department = document.getElementById('filter-department').value.trim();
            filter.role = document.getElementById('filter-role').value.trim();
            currentPage = 1;
            renderDashboard();
        };
        document.getElementById('clear-filter-btn').onclick = function() {
            filter = { firstName: '', department: '', role: '' };
            currentPage = 1;
            renderDashboard();
        };
    }
    document.getElementById('add-employee-btn').onclick = () => showForm();
    document.querySelectorAll('.edit-btn').forEach(btn => {
        btn.onclick = () => showForm(parseInt(btn.dataset.id));
    });
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.onclick = () => deleteEmployee(parseInt(btn.dataset.id));
    });
    const searchInput = document.getElementById('search-input');
    searchInput.value = searchQuery;
    searchInput.focus();
    searchInput.setSelectionRange(searchInput.value.length, searchInput.value.length);
    searchInput.oninput = (e) => {
        searchQuery = e.target.value;
        currentPage = 1;
        renderDashboard();
    };
    document.getElementById('sort-select').onchange = (e) => {
        sortBy = e.target.value;
        sortDir = 'asc';
        renderDashboard();
    };
    document.getElementById('items-per-page').onchange = (e) => {
        itemsPerPage = parseInt(e.target.value);
        currentPage = 1;
        renderDashboard();
    };
    document.querySelectorAll('.page-btn').forEach(btn => {
        btn.onclick = () => {
            currentPage = parseInt(btn.dataset.page);
            renderDashboard();
        };
    });
}

function showForm(editId) {
    const editing = typeof editId === 'number';
    const employee = editing ? employees.find(e => e.id === editId) : null;
    const app = document.getElementById('app');
    app.innerHTML = `
        <div style="position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.08);display:flex;align-items:center;justify-content:center;z-index:1000;">
            <div style="background:#fff;border-radius:18px;box-shadow:0 4px 32px rgba(0,0,0,0.12);padding:40px 36px;max-width:480px;width:100%;">
                <h2 style="font-size:2em;font-weight:bold;margin-bottom:24px;">${editing ? 'Edit' : 'Add'} Employee</h2>
                <form id="employee-form">
                    <div class="form-group">
                        <label for="firstName" style="font-weight:600;">First name</label>
                        <input type="text" id="firstName" name="firstName" value="${employee ? employee.firstName : ''}" required style="margin-bottom:16px;">
                        <div class="error-message" id="firstName-error"></div>
                    </div>
                    <div class="form-group">
                        <label for="lastName" style="font-weight:600;">Last name</label>
                        <input type="text" id="lastName" name="lastName" value="${employee ? employee.lastName : ''}" required style="margin-bottom:16px;">
                        <div class="error-message" id="lastName-error"></div>
                    </div>
                    <div style="display:flex;gap:16px;">
                        <div class="form-group" style="flex:1;">
                            <label for="email" style="font-weight:600;">Email</label>
                            <input type="email" id="email" name="email" value="${employee ? employee.email : ''}" required>
                            <div class="error-message" id="email-error"></div>
                        </div>
                        <div class="form-group" style="flex:1;">
                            <label for="department" style="font-weight:600;">Department</label>
                            <select id="department" name="department" required style="width:100%;height:36px;">
                                <option value="">Select</option>
                                <option value="HR" ${employee && employee.department === 'HR' ? 'selected' : ''}>HR</option>
                                <option value="IT" ${employee && employee.department === 'IT' ? 'selected' : ''}>IT</option>
                                <option value="Finance" ${employee && employee.department === 'Finance' ? 'selected' : ''}>Finance</option>
                            </select>
                            <div class="error-message" id="department-error"></div>
                        </div>
                    </div>
                    <div class="form-group" style="margin-top:16px;">
                        <label for="role" style="font-weight:600;">Role</label>
                        <input type="text" id="role" name="role" value="${employee ? employee.role : ''}" required>
                        <div class="error-message" id="role-error"></div>
                    </div>
                    <div style="display:flex;justify-content:flex-end;gap:16px;margin-top:32px;">
                        <button type="button" id="cancel-btn" style="padding:10px 24px;font-size:1.1em;border-radius:6px;border:1px solid #bbb;background:#fff;cursor:pointer;">Cancel</button>
                        <button type="submit" style="padding:10px 32px;font-size:1.1em;border-radius:6px;border:none;background:#0066e6;color:#fff;font-weight:600;cursor:pointer;">${editing ? 'Save' : 'Add'}</button>
                    </div>
                </form>
            </div>
        </div>
    `;
    document.getElementById('employee-form').onsubmit = function(e) {
        e.preventDefault();
        const form = e.target;
        const data = {
            firstName: form.firstName.value.trim(),
            lastName: form.lastName.value.trim(),
            email: form.email.value.trim(),
            department: form.department.value,
            role: form.role.value.trim(),
        };
        let valid = true;
        // Validation
        if (!data.firstName) {
            valid = false;
            document.getElementById('firstName-error').textContent = 'First name is required.';
        } else {
            document.getElementById('firstName-error').textContent = '';
        }
        if (!data.lastName) {
            valid = false;
            document.getElementById('lastName-error').textContent = 'Last name is required.';
        } else {
            document.getElementById('lastName-error').textContent = '';
        }
        if (!data.email) {
            valid = false;
            document.getElementById('email-error').textContent = 'Email is required.';
        } else if (!/^\S+@\S+\.\S+$/.test(data.email)) {
            valid = false;
            document.getElementById('email-error').textContent = 'Invalid email format.';
        } else {
            document.getElementById('email-error').textContent = '';
        }
        if (!data.department) {
            valid = false;
            document.getElementById('department-error').textContent = 'Department is required.';
        } else {
            document.getElementById('department-error').textContent = '';
        }
        if (!data.role) {
            valid = false;
            document.getElementById('role-error').textContent = 'Role is required.';
        } else {
            document.getElementById('role-error').textContent = '';
        }
        if (!valid) return;
        if (editing) {
            // Update existing
            const idx = employees.findIndex(e => e.id === editId);
            if (idx !== -1) {
                employees[idx] = { ...employees[idx], ...data };
            }
        } else {
            // Add new
            const newId = employees.length ? Math.max(...employees.map(e => e.id)) + 1 : 1;
            employees.push({ id: newId, ...data });
        }
        saveEmployees();
        renderDashboard();
    };
    document.getElementById('cancel-btn').onclick = function() {
        renderDashboard();
    };
}

function deleteEmployee(id) {
    if (confirm('Are you sure you want to delete this employee?')) {
        employees = employees.filter(emp => emp.id !== id);
        saveEmployees();
        renderDashboard();
    }
}

function showFilterPopup() {
    sidebarFilterVisible = false;
    renderDashboard();
}

// Initial render
console.log('App starting...', { employees: employees.length, mockEmployees: window.mockEmployees });
renderApp(); 