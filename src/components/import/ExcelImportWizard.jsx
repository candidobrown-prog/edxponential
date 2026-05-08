/**
 * ExcelImportWizard — Universal Excel/CSV import system for edXponential
 * Step-by-step: Upload → Map Columns → Preview → Confirm → Success
 */
import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Upload, FileSpreadsheet, ChevronRight, ChevronLeft,
  CheckCircle, AlertCircle, X, Download, RefreshCw,
  Sparkles, Eye, Trash2, SkipForward
} from 'lucide-react';
import { base44 } from '@/api/base44Client';

// ─── CSV / TSV text parser (no external lib needed) ──────────────────────────
function parseCSV(text) {
  const lines = text.split(/\r?\n/).filter(l => l.trim());
  if (!lines.length) return { headers: [], rows: [] };
  const parse = (line) => {
    const cols = []; let cur = ''; let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') { inQ = !inQ; continue; }
      if ((c === ',' || c === '\t') && !inQ) { cols.push(cur.trim()); cur = ''; continue; }
      cur += c;
    }
    cols.push(cur.trim());
    return cols;
  };
  const headers = parse(lines[0]);
  const rows = lines.slice(1).map(l => {
    const vals = parse(l);
    const obj = {};
    headers.forEach((h, i) => { obj[h] = vals[i] ?? ''; });
    return obj;
  }).filter(r => Object.values(r).some(v => v));
  return { headers, rows };
}

// ─── AI-style fuzzy column matching ─────────────────────────────────────────
function autoMatch(excelHeaders, fieldDefs) {
  const mapping = {};
  const normalize = s => s?.toLowerCase().replace(/[^a-z0-9]/g, '') || '';
  fieldDefs.forEach(f => {
    const aliases = [f.key, f.label, ...(f.aliases || [])].map(normalize);
    for (const h of excelHeaders) {
      if (aliases.some(a => a && normalize(h).includes(a) || a && a.includes(normalize(h)))) {
        if (!Object.values(mapping).includes(h)) { mapping[f.key] = h; break; }
      }
    }
  });
  return mapping;
}

// ─── Template CSV generator ──────────────────────────────────────────────────
function downloadTemplate(fieldDefs, templateName) {
  const headers = fieldDefs.map(f => f.label + (f.required ? ' *' : ''));
  const sample = fieldDefs.map(f => f.sample || '');
  const csv = [headers.join(','), sample.join(',')].join('\n');
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url;
  a.download = `${templateName.replace(/\s/g, '_')}_template.csv`;
  a.click(); URL.revokeObjectURL(url);
}

// ─── Step components ─────────────────────────────────────────────────────────
const STEPS = ['Upload', 'Map Columns', 'Preview', 'Import'];

function StepBar({ step }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      {STEPS.map((s, i) => (
        <React.Fragment key={s}>
          <div className={`flex items-center gap-1.5 ${i <= step ? 'text-foreground' : 'text-muted-foreground'}`}>
            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black border-2 transition-all ${i < step ? 'bg-black border-black text-white' : i === step ? 'border-black text-black bg-white' : 'border-border text-muted-foreground bg-white'}`}>
              {i < step ? <CheckCircle className="w-3.5 h-3.5" /> : i + 1}
            </div>
            <span className="text-xs font-bold hidden sm:block">{s}</span>
          </div>
          {i < STEPS.length - 1 && <div className={`flex-1 h-px ${i < step ? 'bg-black' : 'bg-border'}`} />}
        </React.Fragment>
      ))}
    </div>
  );
}

// Step 1 — Upload
function StepUpload({ onParsed, fieldDefs, templateName, onDownloadTemplate }) {
  const [dragging, setDragging] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef();

  const processFile = async (file) => {
    if (!file) return;
    const ext = file.name.split('.').pop().toLowerCase();
    if (!['csv', 'xlsx', 'xls'].includes(ext)) {
      setError('Please upload a .xlsx, .xls, or .csv file.'); return;
    }
    setLoading(true); setError(null);
    try {
      if (ext === 'csv') {
        const text = await file.text();
        const { headers, rows } = parseCSV(text);
        onParsed({ headers, rows, fileName: file.name });
      } else {
        // Upload to base44 and extract
        const { file_url } = await base44.integrations.Core.UploadFile({ file });
        const schema = { type: 'object', properties: Object.fromEntries(fieldDefs.map(f => [f.key, { type: 'string' }])) };
        const result = await base44.integrations.Core.ExtractDataFromUploadedFile({ file_url, json_schema: schema });
        if (result.status === 'error') throw new Error(result.details);
        const rows = Array.isArray(result.output) ? result.output : [result.output];
        const headers = rows.length ? Object.keys(rows[0]) : [];
        onParsed({ headers, rows, fileName: file.name });
      }
    } catch (e) {
      setError(e.message || 'Failed to read file. Please check the format and try again.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-5">
      {/* Drop zone */}
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={e => { e.preventDefault(); setDragging(false); processFile(e.dataTransfer.files[0]); }}
        onClick={() => inputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-10 text-center cursor-pointer transition-all ${dragging ? 'border-black bg-black/5' : 'border-border hover:border-black/30 hover:bg-muted/30'}`}
      >
        <input ref={inputRef} type="file" accept=".xlsx,.xls,.csv" className="hidden" onChange={e => processFile(e.target.files[0])} />
        {loading ? (
          <div className="space-y-3">
            <div className="w-10 h-10 border-2 border-black/20 border-t-black rounded-full animate-spin mx-auto" />
            <p className="text-sm font-semibold text-muted-foreground">Reading your file…</p>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="w-14 h-14 bg-muted rounded-2xl flex items-center justify-center mx-auto">
              <FileSpreadsheet className="w-7 h-7 text-muted-foreground" />
            </div>
            <div>
              <p className="font-black text-base">Drag & drop your file here</p>
              <p className="text-muted-foreground text-sm mt-1">or <span className="text-black font-bold underline underline-offset-2">browse files</span></p>
            </div>
            <p className="text-xs text-muted-foreground">Supports .xlsx, .xls, and .csv files</p>
          </div>
        )}
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
          <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      {/* Template download */}
      <div className="flex items-center justify-between bg-muted/50 rounded-xl px-4 py-3">
        <div>
          <p className="text-sm font-bold">Need a template?</p>
          <p className="text-xs text-muted-foreground">Download our pre-formatted spreadsheet</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2 rounded-xl" onClick={onDownloadTemplate}>
          <Download className="w-3.5 h-3.5" /> Download Template
        </Button>
      </div>
    </div>
  );
}

// Step 2 — Map Columns
function StepMapping({ headers, mapping, setMapping, fieldDefs }) {
  const matched = fieldDefs.filter(f => mapping[f.key]).length;
  const pct = Math.round((matched / fieldDefs.filter(f => f.required).length) * 100);

  return (
    <div className="space-y-5">
      {/* AI match banner */}
      <div className="flex items-center gap-3 bg-black text-white rounded-xl px-4 py-3">
        <Sparkles className="w-4 h-4 flex-shrink-0" />
        <p className="text-sm font-semibold">We matched <span className="font-black">{matched} of {fieldDefs.length}</span> columns automatically. Review and adjust below.</p>
      </div>

      <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
        {fieldDefs.map(f => (
          <div key={f.key} className="flex items-center gap-3 bg-muted/30 rounded-xl px-4 py-3">
            <div className="w-40 flex-shrink-0">
              <p className="text-xs font-bold truncate">{f.label} {f.required && <span className="text-red-500">*</span>}</p>
              {f.hint && <p className="text-[10px] text-muted-foreground">{f.hint}</p>}
            </div>
            <ChevronRight className="w-3 h-3 text-muted-foreground flex-shrink-0" />
            <Select value={mapping[f.key] || '__none__'} onValueChange={v => setMapping(m => ({ ...m, [f.key]: v === '__none__' ? undefined : v }))}>
              <SelectTrigger className="flex-1 h-8 text-xs rounded-lg">
                <SelectValue placeholder="— Not mapped —" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="__none__">— Not mapped —</SelectItem>
                {headers.map(h => <SelectItem key={h} value={h}>{h}</SelectItem>)}
              </SelectContent>
            </Select>
            {mapping[f.key] ? <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" /> : f.required ? <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" /> : <div className="w-4" />}
          </div>
        ))}
      </div>
    </div>
  );
}

// Step 3 — Preview
function StepPreview({ rows, mapping, fieldDefs, validationErrors, duplicates, onRemoveRow }) {
  const validRows = rows.filter((_, i) => !validationErrors[i]);
  const errorRows = rows.filter((_, i) => validationErrors[i]);

  return (
    <div className="space-y-4">
      {/* Summary chips */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-black text-white rounded-xl p-3 text-center">
          <p className="text-2xl font-black">{rows.length}</p>
          <p className="text-xs text-white/60 font-semibold">Total rows</p>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-xl p-3 text-center">
          <p className="text-2xl font-black text-green-700">{validRows.length}</p>
          <p className="text-xs text-green-600 font-semibold">Ready to import</p>
        </div>
        <div className={`${errorRows.length > 0 ? 'bg-red-50 border border-red-200' : 'bg-muted'} rounded-xl p-3 text-center`}>
          <p className={`text-2xl font-black ${errorRows.length > 0 ? 'text-red-700' : 'text-muted-foreground'}`}>{errorRows.length}</p>
          <p className={`text-xs font-semibold ${errorRows.length > 0 ? 'text-red-600' : 'text-muted-foreground'}`}>Errors</p>
        </div>
      </div>

      {/* Error list */}
      {errorRows.length > 0 && (
        <div className="bg-red-50 border border-red-100 rounded-xl p-4 space-y-1.5 max-h-36 overflow-y-auto">
          <p className="text-xs font-black text-red-700 uppercase tracking-wider mb-2">Issues to review:</p>
          {rows.map((_, i) => validationErrors[i] && (
            <div key={i} className="flex items-start gap-2">
              <AlertCircle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700"><span className="font-bold">Row {i + 2}:</span> {validationErrors[i]}</p>
            </div>
          ))}
        </div>
      )}

      {/* Table preview */}
      <div className="border border-border rounded-xl overflow-hidden">
        <div className="bg-muted/50 px-4 py-2 flex items-center gap-2">
          <Eye className="w-3.5 h-3.5 text-muted-foreground" />
          <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Preview (first 5 rows)</span>
        </div>
        <div className="overflow-x-auto max-h-56">
          <table className="w-full text-xs">
            <thead className="bg-muted/30 sticky top-0">
              <tr>
                <th className="px-3 py-2 text-left font-bold text-muted-foreground">#</th>
                {fieldDefs.filter(f => mapping[f.key]).map(f => (
                  <th key={f.key} className="px-3 py-2 text-left font-bold text-muted-foreground whitespace-nowrap">{f.label}</th>
                ))}
                <th className="px-3 py-2" />
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {rows.slice(0, 5).map((row, i) => (
                <tr key={i} className={validationErrors[i] ? 'bg-red-50' : 'hover:bg-muted/20'}>
                  <td className="px-3 py-2 text-muted-foreground font-mono">{i + 2}</td>
                  {fieldDefs.filter(f => mapping[f.key]).map(f => (
                    <td key={f.key} className="px-3 py-2 whitespace-nowrap max-w-[120px] truncate">{row[mapping[f.key]] || <span className="text-muted-foreground/40">—</span>}</td>
                  ))}
                  <td className="px-3 py-2">
                    <button onClick={() => onRemoveRow(i)} className="text-muted-foreground hover:text-red-500 transition-colors">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {validRows.length > 0 && <p className="text-xs text-muted-foreground text-center">Showing first 5 rows · {validRows.length} valid rows will be imported</p>}
    </div>
  );
}

// Step 4 — Success
function StepSuccess({ result, onClose }) {
  return (
    <div className="text-center py-6 space-y-5">
      <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center mx-auto">
        <CheckCircle className="w-8 h-8 text-white" />
      </div>
      <div>
        <h3 className="text-2xl font-black">Import Complete.</h3>
        <p className="text-muted-foreground mt-1">Your data is live in the platform.</p>
      </div>
      <div className="grid grid-cols-3 gap-3 max-w-xs mx-auto">
        <div className="bg-green-50 rounded-xl p-3"><p className="text-xl font-black text-green-700">{result.imported}</p><p className="text-[10px] font-bold text-green-600">Imported</p></div>
        <div className="bg-muted rounded-xl p-3"><p className="text-xl font-black">{result.skipped}</p><p className="text-[10px] font-bold text-muted-foreground">Skipped</p></div>
        <div className="bg-red-50 rounded-xl p-3"><p className="text-xl font-black text-red-700">{result.errors}</p><p className="text-[10px] font-bold text-red-600">Errors</p></div>
      </div>
      <Button onClick={onClose} className="rounded-xl px-8">Done</Button>
    </div>
  );
}

// ─── Main Wizard ─────────────────────────────────────────────────────────────
export default function ExcelImportWizard({ open, onOpenChange, fieldDefs, entityName, templateName, onImportComplete }) {
  const [step, setStep] = useState(0);
  const [parsed, setParsed] = useState(null);
  const [mapping, setMapping] = useState({});
  const [rows, setRows] = useState([]);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState(null);

  // Validation
  const validateRow = useCallback((row) => {
    for (const f of fieldDefs) {
      if (!f.required) continue;
      const val = mapping[f.key] ? row[mapping[f.key]] : '';
      if (!val?.trim()) return `"${f.label}" is required but missing.`;
      if (f.type === 'email' && val && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) return `"${val}" is not a valid email address.`;
      if (f.type === 'number' && val && isNaN(Number(val))) return `"${f.label}" must be a number.`;
    }
    return null;
  }, [fieldDefs, mapping]);

  const validationErrors = rows.reduce((acc, row, i) => { acc[i] = validateRow(row); return acc; }, {});
  const validRows = rows.filter((_, i) => !validationErrors[i]);

  const handleParsed = ({ headers, rows: r, fileName }) => {
    const m = autoMatch(headers, fieldDefs);
    setMapping(m);
    setRows(r);
    setParsed({ headers, fileName });
    setStep(1);
  };

  const handleImport = async () => {
    setImporting(true);
    let imported = 0, skipped = 0, errors = 0;
    for (const row of validRows) {
      const record = {};
      fieldDefs.forEach(f => { if (mapping[f.key]) record[f.key] = row[mapping[f.key]] || undefined; });
      // Type coerce numbers
      fieldDefs.filter(f => f.type === 'number').forEach(f => { if (record[f.key]) record[f.key] = Number(record[f.key]) || undefined; });
      try {
        await base44.entities[entityName].create(record);
        imported++;
      } catch { errors++; }
    }
    skipped = rows.length - validRows.length;
    setResult({ imported, skipped, errors });
    setStep(3);
    setImporting(false);
    onImportComplete?.();
  };

  const reset = () => { setStep(0); setParsed(null); setMapping({}); setRows([]); setResult(null); };
  const handleClose = (v) => { if (!v) { reset(); } onOpenChange(v); };

  const canNext = {
    0: false,
    1: fieldDefs.filter(f => f.required).every(f => mapping[f.key]),
    2: validRows.length > 0,
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-black text-xl flex items-center gap-2">
            <FileSpreadsheet className="w-5 h-5" /> Import {templateName}
          </DialogTitle>
        </DialogHeader>

        <StepBar step={step} />

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }} transition={{ duration: 0.2 }}>
            {step === 0 && (
              <StepUpload
                fieldDefs={fieldDefs}
                templateName={templateName}
                onParsed={handleParsed}
                onDownloadTemplate={() => downloadTemplate(fieldDefs, templateName)}
              />
            )}
            {step === 1 && parsed && (
              <StepMapping headers={parsed.headers} mapping={mapping} setMapping={setMapping} fieldDefs={fieldDefs} />
            )}
            {step === 2 && (
              <StepPreview
                rows={rows} mapping={mapping} fieldDefs={fieldDefs}
                validationErrors={validationErrors}
                duplicates={[]}
                onRemoveRow={i => setRows(r => r.filter((_, idx) => idx !== i))}
              />
            )}
            {step === 3 && result && <StepSuccess result={result} onClose={() => handleClose(false)} />}
          </motion.div>
        </AnimatePresence>

        {/* Footer nav */}
        {step < 3 && (
          <div className="flex items-center justify-between mt-6 pt-4 border-t border-border">
            <Button variant="outline" className="gap-2 rounded-xl" onClick={() => step === 0 ? handleClose(false) : setStep(s => s - 1)}>
              {step === 0 ? <><X className="w-4 h-4" /> Cancel</> : <><ChevronLeft className="w-4 h-4" /> Back</>}
            </Button>
            <div className="flex gap-2">
              {step === 2 && validationErrors && Object.values(validationErrors).some(Boolean) && (
                <Button variant="outline" className="gap-2 rounded-xl text-xs" onClick={handleImport} disabled={importing || validRows.length === 0}>
                  <SkipForward className="w-3.5 h-3.5" /> Import valid only ({validRows.length})
                </Button>
              )}
              {step < 2 ? (
                <Button className="gap-2 rounded-xl" onClick={() => setStep(s => s + 1)} disabled={!canNext[step]}>
                  Next <ChevronRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button className="gap-2 rounded-xl" onClick={handleImport} disabled={importing || validRows.length === 0}>
                  {importing ? <><RefreshCw className="w-4 h-4 animate-spin" /> Importing…</> : <><Upload className="w-4 h-4" /> Import {validRows.length} Records</>}
                </Button>
              )}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}