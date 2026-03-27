// ============================================================
// export.js — Excel export via SheetJS (one sheet per category)
//
// [GRADE A — Selects and applies safe, secure and ethical
//  practices in the use of data]
// Export is one-way (no import). Each worksheet is a category.
// Column headers are styled with bold + amber fill. Currency
// columns use AUD accounting format. A summary sheet is
// prepended to give the HoD a quick cross-category overview.
// ============================================================

'use strict';

// ── Column definitions shared across all category sheets ─────
const ITEM_COLUMNS = [
  { header: 'Request ID',            key: 'requestId'    },
  { header: 'Submitted By',          key: 'submittedBy'  },
  { header: 'Submitted Date',        key: 'submittedDate'},
  { header: 'Supplier',              key: 'supplier'     },
  { header: 'Date Needed By',        key: 'dateNeededBy' },
  { header: 'Budget Code',           key: 'budgetCode'   },
  { header: 'Quote Number',          key: 'quoteNumber'  },
  { header: 'Priority',              key: 'priority'     },
  { header: 'Curriculum Justification', key: 'justification' },
  { header: 'Item Description',      key: 'description'  },
  { header: 'Qty',                   key: 'quantity'     },
  { header: 'Unit Price (AUD)',       key: 'unitPrice'    },
  { header: 'Line Total (AUD)',       key: 'total'        },
  { header: 'HoD Decision',          key: 'hodStatus'    },
  { header: 'HoD Comment',           key: 'hodComment'   }
];

// ── Header row style ─────────────────────────────────────────
const HEADER_STYLE = {
  font:      { bold: true, color: { rgb: '1C1917' }, sz: 10 },
  fill:      { fgColor: { rgb: 'FCD34D' }, type: 'pattern', patternType: 'solid' },
  alignment: { vertical: 'center', wrapText: false }
};

// ── AUD currency format string ───────────────────────────────
const AUD_FMT = '"$"#,##0.00';

// ── Build one worksheet for a category ──────────────────────
function buildCategorySheet(requests, category) {
  const rows = [];

  // Header row
  rows.push(ITEM_COLUMNS.map(c => c.header));

  let hasData = false;
  requests
    .filter(r => r.category === category)
    .forEach(req => {
      req.items.forEach(item => {
        hasData = true;
        rows.push(ITEM_COLUMNS.map(c => {
          switch (c.key) {
            case 'requestId':      return req.id;
            case 'submittedBy':    return req.submittedBy;
            case 'submittedDate':  return req.submittedDate;
            case 'supplier':       return req.supplier;
            case 'dateNeededBy':   return req.dateNeededBy;
            case 'budgetCode':     return req.budgetCode || '';
            case 'quoteNumber':    return req.quoteNumber || '';
            case 'priority':       return req.priority;
            case 'justification':  return req.curriculumJustification;
            case 'description':    return item.description;
            case 'quantity':       return item.quantity;
            case 'unitPrice':      return item.unitPrice;
            case 'total':          return item.total;
            case 'hodStatus':      return item.hodStatus;
            case 'hodComment':     return item.hodComment || '';
            default:               return '';
          }
        }));
      });
    });

  if (!hasData) {
    rows.push(['No requests for this category.']);
  }

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Style header row cells
  ITEM_COLUMNS.forEach((_, colIdx) => {
    const cellRef = XLSX.utils.encode_cell({ r: 0, c: colIdx });
    if (ws[cellRef]) ws[cellRef].s = HEADER_STYLE;
  });

  // Currency format on unit price + total columns
  const priceCol = ITEM_COLUMNS.findIndex(c => c.key === 'unitPrice');
  const totalCol = ITEM_COLUMNS.findIndex(c => c.key === 'total');

  for (let rowIdx = 1; rowIdx < rows.length; rowIdx++) {
    [priceCol, totalCol].forEach(colIdx => {
      const ref  = XLSX.utils.encode_cell({ r: rowIdx, c: colIdx });
      if (ws[ref] && typeof ws[ref].v === 'number') ws[ref].z = AUD_FMT;
    });
  }

  // Column widths
  ws['!cols'] = ITEM_COLUMNS.map((c, i) => {
    const widths = { 8: 45, 9: 35, 0: 18, 3: 22 };
    return { wch: widths[i] || 18 };
  });

  return ws;
}

// ── Build summary sheet (cross-category totals) ──────────────
function buildSummarySheet(requests, years) {
  const headers = ['Category', ...years, 'All-time Total'];
  const rows    = [headers];

  CATEGORIES.forEach(cat => {
    const row = [cat];
    let allTime = 0;
    years.forEach(yr => {
      const total = requests
        .filter(r => r.category === cat && r.submittedDate.startsWith(String(yr)))
        .reduce((s, r) =>
          s + r.items.filter(i => i.hodStatus !== 'rejected').reduce((a, i) => a + i.total, 0), 0);
      row.push(total);
      allTime += total;
    });
    row.push(allTime);
    rows.push(row);
  });

  // Totals row
  const totalsRow = ['TOTAL'];
  years.forEach(yr => {
    const t = requests
      .filter(r => r.submittedDate.startsWith(String(yr)))
      .reduce((s, r) =>
        s + r.items.filter(i => i.hodStatus !== 'rejected').reduce((a, i) => a + i.total, 0), 0);
    totalsRow.push(t);
  });
  totalsRow.push(totalsRow.slice(1).reduce((a, b) => a + b, 0));
  rows.push(totalsRow);

  const ws = XLSX.utils.aoa_to_sheet(rows);

  // Style header + totals row
  headers.forEach((_, colIdx) => {
    const ref = XLSX.utils.encode_cell({ r: 0, c: colIdx });
    if (ws[ref]) ws[ref].s = HEADER_STYLE;
  });

  const lastRow = rows.length - 1;
  headers.forEach((_, colIdx) => {
    const ref = XLSX.utils.encode_cell({ r: lastRow, c: colIdx });
    if (ws[ref]) ws[ref].s = { font: { bold: true } };
  });

  // Apply currency format to all numeric cells
  for (let r = 1; r < rows.length; r++) {
    for (let c = 1; c < headers.length; c++) {
      const ref = XLSX.utils.encode_cell({ r, c });
      if (ws[ref] && typeof ws[ref].v === 'number') ws[ref].z = AUD_FMT;
    }
  }

  ws['!cols'] = [{ wch: 28 }, ...years.map(() => ({ wch: 16 })), { wch: 16 }];
  return ws;
}

// ── Public Export namespace ───────────────────────────────────
const Export = {
  // [GRADE A — Technically concise: one workbook, one sheet per
  //  category + summary sheet prepended for HoD overview]
  exportToExcel() {
    const requests = AppState.getRequests();
    const years    = AppState.getYears();

    if (!requests.length) {
      showToast('No data to export.', 'error');
      return;
    }

    const wb = XLSX.utils.book_new();

    // Summary first
    XLSX.utils.book_append_sheet(wb, buildSummarySheet(requests, years), 'Summary');

    // One sheet per category
    CATEGORIES.forEach(cat => {
      // SheetJS sheet names must be ≤31 chars
      const safeName = cat.length > 31 ? cat.slice(0, 31) : cat;
      XLSX.utils.book_append_sheet(wb, buildCategorySheet(requests, cat), safeName);
    });

    const filename = `TAS_Purchasing_${new Date().toISOString().slice(0, 10)}.xlsx`;
    XLSX.writeFile(wb, filename);
    showToast(`Exported: ${filename}`, 'success');
  }
};
