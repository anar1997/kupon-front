import React, { useMemo } from "react";

function range(start, end) {
  const out = [];
  for (let i = start; i <= end; i += 1) out.push(i);
  return out;
}

function getPageItems({ currentPage, totalPages, siblingCount = 1, boundaryCount = 1 }) {
  const safeTotal = Math.max(1, Number(totalPages) || 1);
  const safeCurrent = Math.min(Math.max(1, Number(currentPage) || 1), safeTotal);

  const pages = new Set();

  range(1, Math.min(boundaryCount, safeTotal)).forEach((p) => pages.add(p));
  range(Math.max(1, safeTotal - boundaryCount + 1), safeTotal).forEach((p) => pages.add(p));
  range(Math.max(1, safeCurrent - siblingCount), Math.min(safeTotal, safeCurrent + siblingCount)).forEach((p) => pages.add(p));

  const sorted = Array.from(pages).sort((a, b) => a - b);
  const items = [];

  for (let i = 0; i < sorted.length; i += 1) {
    const page = sorted[i];
    const prev = sorted[i - 1];

    if (i > 0) {
      const gap = page - prev;
      if (gap === 2) {
        items.push(prev + 1);
      } else if (gap > 2) {
        items.push("…");
      }
    }

    items.push(page);
  }

  return { items, safeCurrent, safeTotal };
}

export default function Pagination({
  currentPage,
  totalPages,
  onChange,
  siblingCount = 1,
  boundaryCount = 1,
  className = "",
}) {
  const { items, safeCurrent, safeTotal } = useMemo(
    () => getPageItems({ currentPage, totalPages, siblingCount, boundaryCount }),
    [currentPage, totalPages, siblingCount, boundaryCount]
  );

  if (safeTotal <= 1) return null;

  const goTo = (page) => {
    if (!onChange) return;
    const next = Math.min(Math.max(1, page), safeTotal);
    if (next !== safeCurrent) onChange(next);
  };

  return (
    <div className={`w-full flex items-center justify-center ${className}`}>
      <div className="max-w-full flex items-center justify-center gap-1 flex-wrap">
        <button
          type="button"
          className="px-2 sm:px-3 py-1 rounded border text-xs sm:text-sm bg-white disabled:opacity-50"
          onClick={() => goTo(safeCurrent - 1)}
          disabled={safeCurrent === 1}
        >
          ‹
        </button>

        {items.map((it, idx) => {
          if (it === "…") {
            return (
              <span key={`e-${idx}`} className="px-2 py-1 text-xs sm:text-sm text-gray-500 select-none">
                …
              </span>
            );
          }
          const page = it;
          const active = page === safeCurrent;
          return (
            <button
              key={page}
              type="button"
              aria-current={active ? "page" : undefined}
              className={
                `px-2 sm:px-3 py-1 rounded border text-xs sm:text-sm ` +
                (active ? "bg-yellow-200 font-bold" : "bg-white hover:bg-gray-50")
              }
              onClick={() => goTo(page)}
            >
              {page}
            </button>
          );
        })}

        <button
          type="button"
          className="px-2 sm:px-3 py-1 rounded border text-xs sm:text-sm bg-white disabled:opacity-50"
          onClick={() => goTo(safeCurrent + 1)}
          disabled={safeCurrent === safeTotal}
        >
          ›
        </button>
      </div>
    </div>
  );
}
