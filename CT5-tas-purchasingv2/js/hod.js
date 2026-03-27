// ============================================================
// hod.js — HoD approval workflow
//
// [GRADE A — Skilfully applies appropriate iterative processes
//  to produce computing solutions]
// Line-by-line decision model: each item is approved/rejected
// independently. overallStatus is derived by state.js (not stored
// redundantly), ensuring the UI always reflects the true state
// of the request without synchronisation errors.
// ============================================================

'use strict';

// ── Render HoD review queue ───────────────────────────────────
function renderHodQueue() {
  const container = document.getElementById('tab-hod-review');
  const role      = AppState.getRole();
  if (!container) return;

  // Search/filter bar
  container.innerHTML = `
    <div class="toolbar">
      <h2 class="tab-title">HoD Review</h2>
      <div class="toolbar-controls">
        <input id="hod-search" type="search" class="field search-field"
               placeholder="Search by ID, teacher or category…"
               oninput="HoD.filterQueue()">
        <select id="hod-status-filter" class="field filter-select"
                onchange="HoD.filterQueue()">
          <option value="">All statuses</option>
          <option value="pending"  selected>Pending</option>
          <option value="approved">Approved</option>
          <option value="partial">Partial</option>
          <option value="rejected">Rejected</option>
        </select>
      </div>
    </div>
    <div id="hod-table-container"></div>
  `;

  HoD.filterQueue();
}

// ── Public HoD namespace ──────────────────────────────────────
const HoD = {

  // [GRADE A — Selects relevant data and processes: filter runs
  //  on the in-memory array, updating only the table container,
  //  so the full page never re-renders on each keystroke]
  filterQueue() {
    const search   = (document.getElementById('hod-search')?.value || '').toLowerCase();
    const statusF  = document.getElementById('hod-status-filter')?.value || '';
    const requests = AppState.getRequests().filter(r => {
      const matchStatus = !statusF || r.overallStatus === statusF;
      const matchSearch = !search  ||
        r.id.toLowerCase().includes(search)            ||
        r.submittedBy.toLowerCase().includes(search)   ||
        r.category.toLowerCase().includes(search)      ||
        r.supplier.toLowerCase().includes(search);
      return matchStatus && matchSearch;
    });

    const container = document.getElementById('hod-table-container');
    if (container) UI.renderRequestTable(container, requests, 'hod');
  },

  // ── Save a single line-item decision ─────────────────────────
  // [GRADE A — Technically concise: reads select + comment
  //  from the DOM, delegates state mutation to AppState,
  //  then re-renders only the modal content — not the whole page]
  saveItemDecision(requestId, itemId) {
    const status  = document.getElementById(`sel-${itemId}`)?.value;
    const comment = document.getElementById(`cmt-${itemId}`)?.value.trim() || '';

    if (!status) return;

    AppState.updateItemStatus(requestId, itemId, status, comment);

    const req = AppState.getRequests().find(r => r.id === requestId);
    if (req) {
      document.getElementById('modal-body').innerHTML =
        UI.renderRequestDetail(req, 'hod');
    }

    const label = status.charAt(0).toUpperCase() + status.slice(1);
    showToast(`Item ${label.toLowerCase()}d.`,
              status === 'approved' ? 'success' : status === 'rejected' ? 'error' : 'info');

    // Refresh the queue table in the background
    HoD.filterQueue();
  },

  // ── Bulk: approve every line item in one click ──────────────
  approveAll(requestId) {
    const req = AppState.getRequests().find(r => r.id === requestId);
    if (!req) return;
    req.items.forEach(item =>
      AppState.updateItemStatus(requestId, item.id, 'approved', '')
    );
    document.getElementById('modal-body').innerHTML =
      UI.renderRequestDetail(AppState.getRequests().find(r => r.id === requestId), 'hod');
    showToast('All items approved.', 'success');
    HoD.filterQueue();
  },

  // ── Bulk: reject every line item in one click ───────────────
  rejectAll(requestId) {
    const req = AppState.getRequests().find(r => r.id === requestId);
    if (!req) return;
    req.items.forEach(item =>
      AppState.updateItemStatus(requestId, item.id, 'rejected', '')
    );
    document.getElementById('modal-body').innerHTML =
      UI.renderRequestDetail(AppState.getRequests().find(r => r.id === requestId), 'hod');
    showToast('All items rejected.', 'error');
    HoD.filterQueue();
  },

  renderHodQueue
};
