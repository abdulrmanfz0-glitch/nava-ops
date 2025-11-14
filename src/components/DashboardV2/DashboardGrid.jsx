// NAVA OPS - Dashboard Grid System
// Responsive grid layout for widgets

import React from 'react';
import { motion } from 'framer-motion';

export default function DashboardGrid({ children, columns = 4, gap = 6 }) {
  return (
    <div
      className={`
        grid gap-${gap}
        grid-cols-1
        md:grid-cols-2
        lg:grid-cols-${columns}
        auto-rows-auto
      `}
      style={{
        gridAutoRows: 'minmax(min-content, max-content)'
      }}
    >
      {children}
    </div>
  );
}

// Grid item with responsive sizing
export function GridItem({ children, colSpan = 1, rowSpan = 1, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`
        col-span-1
        md:col-span-${Math.min(colSpan, 2)}
        lg:col-span-${colSpan}
        row-span-${rowSpan}
        ${className}
      `}
      style={{
        gridColumn: `span ${colSpan}`,
        gridRow: `span ${rowSpan}`
      }}
    >
      {children}
    </motion.div>
  );
}
