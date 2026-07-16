import { useEffect, useRef, useState } from 'react';
import { database } from '../lib/database';
import { useQueueStore } from '../store/queueStore';
import type { Product } from '../types';
import ScannerStatus from './ScannerStatus';

export default function SearchPanel() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const addFromBarcode = useQueueStore((s) => s.addFromBarcode);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!query) {
      setOpen(false);
      return;
    }
    setResults(database.search(query));
    setOpen(true);
  }, [query]);

  useEffect(() => {
    const onClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('click', onClickOutside);
    return () => document.removeEventListener('click', onClickOutside);
  }, []);

  const pick = (p: Product) => {
    addFromBarcode(p.Barcode);
    setQuery('');
    setOpen(false);
  };

  return (
    <div className="panel">
      <div className="p-lbl">
        <span className="step-no">1</span> เพิ่มสินค้า
      </div>
      <ScannerStatus />
      <div className="search-container" ref={containerRef}>
        <div className="search-box-inner">
          <span className="search-ico">⌕</span>
          <input
            className="inp"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="หรือพิมพ์ชื่อสินค้า / เลขบาร์โค้ด ที่นี่..."
            autoComplete="off"
          />
        </div>
        <div className={`search-drop${open ? ' open' : ''}`}>
          {open && results.length === 0 && (
            <div className="s-item">
              <span className="s-meta" style={{ color: 'var(--r)' }}>
                ✕ ไม่พบสินค้า
              </span>
            </div>
          )}
          {open &&
            results.map((p) => (
              <div className="s-item" key={p.Barcode} onClick={() => pick(p)}>
                {p.Image && (
                  <img
                    className="s-thumb"
                    src={p.Image}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).style.display = 'none';
                    }}
                  />
                )}
                <div>
                  <div className="s-name">{p.ProductName}</div>
                  <div className="s-meta">
                    {p.Barcode} · {p.Price} บาท
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
