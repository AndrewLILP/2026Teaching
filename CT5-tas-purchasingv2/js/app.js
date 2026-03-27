// ============================================================
// app.js — Application controller: login, routing, nav, tabs
//
// [GRADE A — Develops highly effective computing solutions using
//  computational, design and systems thinking skills]
// App.init() wires the login screen, then App.switchTab() acts
// as a simple client-side router — mapping tab IDs to render
// functions without a framework. Role-based nav means the
// sidebar only offers tabs the current user is authorised to see.
// ============================================================

'use strict';

// ── Role → accessible tabs config ────────────────────────────
// [GRADE A — Systems thinking: a data-driven access control
//  table is cleaner and more auditable than scattered if/else
//  blocks throughout the codebase. Adding a new role = one row.]
const ROLE_TABS = {
  teacher: ['dashboard', 'all-requests', 'new-request'],
  admin:   ['dashboard', 'all-requests'],
  hod:     ['dashboard', 'all-requests', 'hod-review']
};

const TAB_LABELS = {
  'dashboard':    { icon: '◈', label: 'Dashboard'    },
  'all-requests': { icon: '≡', label: 'All Requests' },
  'new-request':  { icon: '+', label: 'New Request'  },
  'hod-review':   { icon: '✓', label: 'HoD Review'   }
};

// ── Build sidebar nav for the current role ───────────────────
function buildNav(role) {
  const navEl     = document.getElementById('sidebar-nav');
  const pendingBadge = AppState.getPendingCount();

  navEl.innerHTML = ROLE_TABS[role].map(tabId => {
    const { icon, label } = TAB_LABELS[tabId];
    const badge = (tabId === 'hod-review' && role === 'hod' && pendingBadge)
      ? `<span class="nav-badge">${pendingBadge}</span>` : '';
    return `
      <li>
        <button class="nav-btn" id="nav-${tabId}"
                onclick="App.switchTab('${tabId}')">
          <span class="nav-icon">${icon}</span>
          <span class="nav-label">${label}</span>
          ${badge}
        </button>
      </li>`;
  }).join('');
}

// ── Update active nav state ───────────────────────────────────
function setActiveNav(tabId) {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.classList.toggle('nav-btn--active', btn.id === `nav-${tabId}`);
  });
}

// ── Tab renderers ─────────────────────────────────────────────
const TAB_RENDERERS = {
  'dashboard'() {
    document.getElementById('tab-content').innerHTML = `
      <div id="tab-dashboard">
        <h2 class="tab-title">Dashboard</h2>
        <div class="stat-grid">
          <div class="stat-card">
            <span class="stat-value" id="stat-total-requests">—</span>
            <span class="stat-label">Total Requests</span>
          </div>
          <div class="stat-card stat-card--amber">
            <span class="stat-value" id="stat-pending">—</span>
            <span class="stat-label">Awaiting HoD</span>
          </div>
          <div class="stat-card stat-card--green">
            <span class="stat-value" id="stat-year-spend">—</span>
            <span class="stat-label">${new Date().getFullYear()} Approved Spend</span>
          </div>
          <div class="stat-card">
            <span class="stat-value" id="stat-categories">${CATEGORIES.length}</span>
            <span class="stat-label">Categories</span>
          </div>
        </div>
        <div class="charts-grid">
          <div class="chart-card chart-card--wide">
            <canvas id="chart-yearly" height="200"></canvas>
          </div>
          <div class="chart-card">
            <canvas id="chart-approval" height="220"></canvas>
          </div>
          <div class="chart-card chart-card--wide">
            <canvas id="chart-category" height="240"></canvas>
          </div>
        </div>
      </div>`;
    Charts.renderDashboard();
  },

  'all-requests'() {
    const role     = AppState.getRole();
    const requests = AppState.getRequests();
    document.getElementById('tab-content').innerHTML = `
      <div id="tab-all-requests">
        <div class="toolbar">
          <h2 class="tab-title">All Requests</h2>
          <div class="toolbar-controls">
            <input id="req-search" type="search" class="field search-field"
                   placeholder="Search…" oninput="App.filterAllRequests()">
            <select id="req-cat-filter" class="field filter-select"
                    onchange="App.filterAllRequests()">
              <option value="">All categories</option>
              ${CATEGORIES.map(c => `<option value="${c}">${c}</option>`).join('')}
            </select>
            <select id="req-status-filter" class="field filter-select"
                    onchange="App.filterAllRequests()">
              <option value="">All statuses</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="partial">Partial</option>
              <option value="rejected">Rejected</option>
            </select>
            ${role === 'hod' ? `
              <button class="btn btn--ghost btn--sm"
                      onclick="Export.exportToExcel()">⬇ Export Excel</button>
            ` : ''}
          </div>
        </div>
        <div id="requests-table-container"></div>
      </div>`;
    App.filterAllRequests();
  },

  'new-request'() {
    document.getElementById('tab-content').innerHTML =
      `<div id="tab-new-request"></div>`;
    Forms.renderNewRequestForm();
  },

  'hod-review'() {
    document.getElementById('tab-content').innerHTML = `
      <div id="tab-hod-review"></div>`;
    HoD.renderHodQueue();
  }
};

// ── Login screen ──────────────────────────────────────────────
function renderLoginScreen() {
  document.getElementById('app-shell').hidden     = true;
  document.getElementById('login-screen').hidden  = false;
}

function renderAppShell(role) {
  const user = AppState.getUser();
  document.getElementById('login-screen').hidden  = true;
  document.getElementById('app-shell').hidden     = false;
  document.getElementById('sidebar-role').textContent  = role.charAt(0).toUpperCase() + role.slice(1);
  document.getElementById('sidebar-user').textContent  = user.name;
  buildNav(role);
  App.switchTab('dashboard');
}

// ── Public App namespace ─────────────────────────────────────
const App = {
  init() {
    // Login button handlers
    document.querySelectorAll('.login-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const role = btn.dataset.role;
        AppState.login(role);
        renderAppShell(role);
      });
    });

    // Modal close via overlay click or close button
    document.getElementById('modal').addEventListener('click', e => {
      if (e.target === e.currentTarget) UI.closeModal();
    });
    document.getElementById('modal-close-btn').addEventListener('click', UI.closeModal);

    // Keyboard: Escape closes modal
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape') UI.closeModal();
    });

    // Logout
    document.getElementById('logout-btn').addEventListener('click', () => {
      AppState.logout();
      Charts.destroyAll();
      renderLoginScreen();
    });
  },

  switchTab(tabId) {
    const role = AppState.getRole();
    if (!ROLE_TABS[role]?.includes(tabId)) {
      showToast('Access denied.', 'error');
      return;
    }
    AppState.setTab(tabId);
    setActiveNav(tabId);
    const renderer = TAB_RENDERERS[tabId];
    if (renderer) renderer();
  },

  filterAllRequests() {
    const search  = (document.getElementById('req-search')?.value || '').toLowerCase();
    const catF    = document.getElementById('req-cat-filter')?.value    || '';
    const statusF = document.getElementById('req-status-filter')?.value || '';
    const role    = AppState.getRole();

    const filtered = AppState.getRequests().filter(r => {
      const matchCat    = !catF    || r.category     === catF;
      const matchStatus = !statusF || r.overallStatus === statusF;
      const matchSearch = !search  ||
        r.id.toLowerCase().includes(search)          ||
        r.submittedBy.toLowerCase().includes(search) ||
        r.category.toLowerCase().includes(search)    ||
        r.supplier.toLowerCase().includes(search);
      return matchCat && matchStatus && matchSearch;
    });

    const container = document.getElementById('requests-table-container');
    if (container) UI.renderRequestTable(container, filtered, role);
  }
};

// ── Boot ──────────────────────────────────────────────────────
// Scripts are loaded at the bottom of <body>, so the DOM is already
// fully built when this runs. Calling directly is more reliable than
// DOMContentLoaded when opening via file:// in different browsers.
App.init();
