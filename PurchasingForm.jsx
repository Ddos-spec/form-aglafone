import React, { useState, useEffect, useRef } from 'react';
import { Plus, Trash2, Save, Calendar, Search, ShoppingCart, CheckCircle } from 'lucide-react';

// --- Dummy Data ---
const PHONE_BRANDS = [
  "iPhone 15 Pro Max",
  "iPhone 15",
  "iPhone 14 Pro",
  "Samsung Galaxy S24 Ultra",
  "Samsung Galaxy Z Flip 5",
  "Samsung Galaxy A55",
  "Google Pixel 8 Pro",
  "Xiaomi 13T",
  "POCO F5",
  "OPPO Find N3 Flip",
  "Vivo X100 Pro",
  "Infinix GT 10 Pro",
  "Asus ROG Phone 8"
];

const PHONE_SPECS = [
  "4/64 GB",
  "6/128 GB",
  "8/128 GB",
  "8/256 GB",
  "12/256 GB",
  "12/512 GB",
  "16/512 GB",
  "1TB"
];

const PHONE_COLORS = [
  "Hitam (Black)",
  "Putih (White)",
  "Silver",
  "Gold",
  "Abu-abu (Grey)",
  "Biru (Blue)",
  "Hijau (Green)",
  "Merah (Red)",
  "Titanium Natural",
  "Titanium Blue",
  "Deep Purple",
  "Graphite"
];

// --- Utility Functions ---

// Format angka ke format Rupiah
const formatCurrency = (value) => {
  if (!value) return '';
  return new Intl.NumberFormat('id-ID').format(value);
};

// Balikin string Rupiah ke angka murni
const parseCurrency = (displayValue) => {
  return parseInt(displayValue.replace(/\./g, '') || '0', 10);
};

// --- Sub-Component: Searchable Dropdown ---
const SearchableSelect = ({ options, value, onChange, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  const filteredOptions = options.filter(opt =>
    opt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div
        className="flex items-center justify-between w-full p-2.5 border border-slate-300 rounded-lg bg-white cursor-pointer focus-within:ring-2 focus-within:ring-blue-500 transition-all"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={`block truncate text-sm ${!value ? 'text-gray-400' : 'text-gray-800'}`}>
          {value || placeholder}
        </span>
        <Search size={14} className="text-gray-400 ml-2" />
      </div>

      {isOpen && (
        <div className="absolute z-20 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-xl max-h-60 overflow-auto">
          <div className="p-2 sticky top-0 bg-white border-b border-gray-100">
            <input
              type="text"
              className="w-full p-2 bg-gray-50 text-xs rounded border border-gray-200 focus:outline-none focus:border-blue-500"
              placeholder="Cari..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoFocus
            />
          </div>
          <ul className="py-1">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((opt, idx) => (
                <li
                  key={idx}
                  className={`px-3 py-2 text-xs cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-colors ${value === opt ? 'bg-blue-100 font-medium text-blue-700' : 'text-gray-700'}`}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                    setSearchTerm('');
                  }}
                >
                  {opt}
                </li>
              ))
            ) : (
              <li className="px-4 py-3 text-xs text-gray-400 text-center">
                Tidak ditemukan
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
};

// --- Main Component ---
export default function App() {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // State Baris Produk (Added spec & color)
  const [rows, setRows] = useState([
    { id: 1, brand: '', spec: '', color: '', price: 0, qty: 1 }
  ]);

  const addRow = () => {
    const newId = rows.length > 0 ? Math.max(...rows.map(r => r.id)) + 1 : 1;
    setRows([...rows, { id: newId, brand: '', spec: '', color: '', price: 0, qty: 1 }]);
  };

  const removeRow = (id) => {
    if (rows.length === 1) {
      setRows([{ id: 1, brand: '', spec: '', color: '', price: 0, qty: 1 }]);
      return;
    }
    setRows(rows.filter(row => row.id !== id));
  };

  const updateRow = (id, field, value) => {
    setRows(rows.map(row => {
      if (row.id === id) {
        return { ...row, [field]: value };
      }
      return row;
    }));
  };

  const grandTotal = rows.reduce((acc, row) => acc + (row.price * row.qty), 0);

  const handleSave = () => {
    // Validasi lebih ketat (Brand, Spec, Color, Price harus ada)
    const isValid = rows.every(r => r.brand && r.spec && r.color && r.price > 0);
    
    if (!isValid) {
      alert("Waduh boss, data belum lengkap! Pastikan Merek, Spek, Warna, dan Harga sudah diisi semua.");
      return;
    }

    console.log("Data Disimpan:", { date, items: rows, total: grandTotal });
    
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-2 sm:px-6 font-sans">
      <div className="max-w-7xl mx-auto"> {/* Lebarin container jadi 7xl biar muat banyak kolom */}
        
        {/* Header */}
        <div className="mb-8 text-center sm:text-left flex flex-col sm:flex-row justify-between items-center px-2">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 flex items-center justify-center sm:justify-start gap-3">
              <ShoppingCart className="text-blue-600" />
              Purchasing Aglafone
            </h1>
            <p className="text-slate-500 mt-2">Input stok unit baru lengkap dengan spek & warna.</p>
          </div>
          
          <div className="mt-4 sm:mt-0 bg-blue-600 text-white p-4 rounded-xl shadow-lg min-w-[220px] text-center sm:text-right">
            <p className="text-blue-100 text-sm font-medium uppercase tracking-wider">Grand Total</p>
            <p className="text-2xl font-bold">Rp {formatCurrency(grandTotal)}</p>
          </div>
        </div>

        {/* Main Form Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          
          <div className="p-6 bg-slate-50 border-b border-slate-200">
            <label className="block text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
              <Calendar size={16} /> Tanggal Pembelian
            </label>
            <input 
              type="date" 
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="block w-full sm:w-64 p-2.5 bg-white border border-slate-300 text-slate-900 rounded-lg focus:ring-blue-500 focus:border-blue-500 transition-all"
            />
          </div>

          {/* Table Header (Desktop) - Adjusted Columns for 12-grid system */}
          {/* Merek(3) Spek(2) Warna(2) Harga(2) Qty(1) Subtotal(1) Aksi(1) = 12 */}
          <div className="hidden sm:grid grid-cols-12 gap-3 px-6 py-3 bg-slate-100 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
            <div className="col-span-3">Merek HP</div>
            <div className="col-span-2">Spek (RAM/ROM)</div>
            <div className="col-span-2">Warna</div>
            <div className="col-span-2">Harga (Rp)</div>
            <div className="col-span-1 text-center">Qty</div>
            <div className="col-span-1 text-right">Subtotal</div>
            <div className="col-span-1 text-center">Aksi</div>
          </div>

          {/* Rows */}
          <div className="p-4 sm:p-6 space-y-4 sm:space-y-0">
            {rows.map((row, index) => (
              <div 
                key={row.id} 
                className="flex flex-col sm:grid sm:grid-cols-12 gap-3 items-start sm:items-start py-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors rounded-lg sm:rounded-none p-4 sm:p-0 border sm:border-0 shadow-sm sm:shadow-none bg-slate-50 sm:bg-transparent"
              >
                {/* Mobile Label Header */}
                <div className="sm:hidden w-full flex justify-between items-center mb-2 pb-2 border-b border-gray-200">
                   <span className="font-bold text-slate-500 text-sm">Item #{index + 1}</span>
                   <button onClick={() => removeRow(row.id)} className="text-red-500 text-sm">Hapus</button>
                </div>

                {/* Brand Dropdown */}
                <div className="col-span-12 sm:col-span-3 w-full">
                  <label className="sm:hidden text-xs font-semibold text-slate-500 mb-1 block">Merek HP</label>
                  <SearchableSelect 
                    options={PHONE_BRANDS} 
                    value={row.brand}
                    placeholder="Pilih Merek..."
                    onChange={(val) => updateRow(row.id, 'brand', val)}
                  />
                </div>

                {/* Specs Dropdown */}
                <div className="col-span-12 sm:col-span-2 w-full">
                  <label className="sm:hidden text-xs font-semibold text-slate-500 mb-1 block">Spesifikasi</label>
                  <select
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                    value={row.spec}
                    onChange={(e) => updateRow(row.id, 'spec', e.target.value)}
                  >
                    <option value="" disabled>Pilih Spek</option>
                    {PHONE_SPECS.map((spec, i) => (
                      <option key={i} value={spec}>{spec}</option>
                    ))}
                  </select>
                </div>

                {/* Color Dropdown */}
                <div className="col-span-12 sm:col-span-2 w-full">
                  <label className="sm:hidden text-xs font-semibold text-slate-500 mb-1 block">Warna</label>
                  <select
                    className="w-full p-2.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none appearance-none"
                    value={row.color}
                    onChange={(e) => updateRow(row.id, 'color', e.target.value)}
                  >
                    <option value="" disabled>Pilih Warna</option>
                    {PHONE_COLORS.map((color, i) => (
                      <option key={i} value={color}>{color}</option>
                    ))}
                  </select>
                </div>

                {/* Price Input */}
                <div className="col-span-12 sm:col-span-2 w-full">
                  <label className="sm:hidden text-xs font-semibold text-slate-500 mb-1 block">Harga Satuan</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-medium text-xs">Rp</span>
                    <input
                      type="text"
                      className="w-full pl-8 pr-3 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-mono text-sm text-slate-700"
                      placeholder="0"
                      value={formatCurrency(row.price)}
                      onChange={(e) => {
                        const val = parseCurrency(e.target.value);
                        if (!isNaN(val)) updateRow(row.id, 'price', val);
                      }}
                    />
                  </div>
                </div>

                {/* Quantity */}
                <div className="col-span-6 sm:col-span-1 w-full">
                  <label className="sm:hidden text-xs font-semibold text-slate-500 mb-1 block">Qty</label>
                  <input
                    type="number"
                    min="1"
                    className="w-full text-center py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all font-semibold text-sm text-slate-700"
                    value={row.qty}
                    onChange={(e) => updateRow(row.id, 'qty', parseInt(e.target.value) || 0)}
                  />
                </div>

                {/* Subtotal (Read Only) */}
                <div className="col-span-6 sm:col-span-1 text-right w-full flex flex-col justify-center h-full sm:block sm:py-2">
                  <label className="sm:hidden text-xs font-semibold text-slate-500 mb-1 block text-right">Subtotal</label>
                  <span className="font-bold text-slate-800 font-mono text-sm truncate block" title={formatCurrency(row.price * row.qty)}>
                    {formatCurrency(row.price * row.qty)}
                  </span>
                </div>

                {/* Delete Action (Desktop Only - Mobile moved to top of card) */}
                <div className="hidden sm:flex col-span-1 justify-center items-center h-full">
                  <button 
                    onClick={() => removeRow(row.id)}
                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                    title="Hapus baris"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-6 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button
              onClick={addRow}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-dashed border-blue-300 text-blue-600 rounded-xl hover:bg-blue-50 hover:border-blue-400 transition-all font-semibold"
            >
              <Plus size={20} />
              Add Product
            </button>

            <button
              onClick={handleSave}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl shadow-lg hover:bg-blue-700 hover:shadow-blue-500/30 hover:-translate-y-0.5 transition-all font-bold text-lg"
            >
              <Save size={20} />
              Simpan Data
            </button>
          </div>
        </div>

        {/* Success Toast */}
        {showSuccess && (
          <div className="fixed bottom-8 right-8 bg-green-500 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center gap-3 animate-bounce z-50">
            <CheckCircle size={24} />
            <div>
              <h4 className="font-bold">Berhasil!</h4>
              <p className="text-sm text-green-100">Data purchasing udah diamankan, Boss.</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}