// NAVA OPS - Draggable Grid System
// Custom HTML5 drag-and-drop implementation for widget rearrangement

import React, { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { GripVertical } from 'lucide-react';

export default function DraggableGrid({
  children,
  layout,
  onLayoutChange,
  columns = 4,
  isDraggable = false,
  gap = 6
}) {
  const [draggedItem, setDraggedItem] = useState(null);
  const [dropTarget, setDropTarget] = useState(null);
  const gridRef = useRef(null);

  // Calculate grid column width
  const getColumnWidth = () => {
    if (!gridRef.current) return 0;
    const gridWidth = gridRef.current.offsetWidth;
    const gapWidth = (columns - 1) * (gap * 4); // gap * 4px (Tailwind spacing)
    return (gridWidth - gapWidth) / columns;
  };

  // Handle drag start
  const handleDragStart = useCallback((e, item) => {
    if (!isDraggable) return;
    setDraggedItem(item);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target);

    // Add ghost image styling
    e.target.style.opacity = '0.5';
  }, [isDraggable]);

  // Handle drag over
  const handleDragOver = useCallback((e, item) => {
    if (!isDraggable || !draggedItem) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';

    if (item.i !== draggedItem.i) {
      setDropTarget(item);
    }
  }, [isDraggable, draggedItem]);

  // Handle drag end
  const handleDragEnd = useCallback((e) => {
    e.target.style.opacity = '1';
    setDraggedItem(null);
    setDropTarget(null);
  }, []);

  // Handle drop
  const handleDrop = useCallback((e, targetItem) => {
    if (!isDraggable || !draggedItem || !targetItem) return;
    e.preventDefault();

    if (draggedItem.i === targetItem.i) {
      setDraggedItem(null);
      setDropTarget(null);
      return;
    }

    // Swap positions in layout
    const newLayout = layout.map(item => {
      if (item.i === draggedItem.i) {
        return { ...item, x: targetItem.x, y: targetItem.y };
      }
      if (item.i === targetItem.i) {
        return { ...item, x: draggedItem.x, y: draggedItem.y };
      }
      return item;
    });

    onLayoutChange(newLayout);
    setDraggedItem(null);
    setDropTarget(null);
  }, [isDraggable, draggedItem, layout, onLayoutChange]);

  return (
    <div
      ref={gridRef}
      className={`grid gap-${gap} auto-rows-auto`}
      style={{
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridAutoRows: 'minmax(200px, auto)'
      }}
    >
      {layout.map((item) => {
        const child = React.Children.toArray(children).find(
          (c) => c.key === item.i || c.props?.widgetId === item.i
        );

        const isBeingDragged = draggedItem?.i === item.i;
        const isDropTarget = dropTarget?.i === item.i;

        return (
          <motion.div
            key={item.i}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{
              opacity: isBeingDragged ? 0.5 : 1,
              scale: isDropTarget ? 1.05 : 1
            }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              layout: { duration: 0.3 },
              opacity: { duration: 0.2 }
            }}
            draggable={isDraggable}
            onDragStart={(e) => handleDragStart(e, item)}
            onDragOver={(e) => handleDragOver(e, item)}
            onDragEnd={handleDragEnd}
            onDrop={(e) => handleDrop(e, item)}
            className={`
              relative
              ${isDraggable ? 'cursor-move' : 'cursor-default'}
              ${isDropTarget ? 'ring-2 ring-primary-500 ring-offset-2 dark:ring-offset-gray-900' : ''}
            `}
            style={{
              gridColumn: `span ${item.w}`,
              gridRow: `span ${item.h}`
            }}
          >
            {isDraggable && (
              <div className="absolute top-2 left-2 z-10 p-1 bg-gray-800/80 rounded cursor-move
                            opacity-0 hover:opacity-100 transition-opacity duration-200">
                <GripVertical className="w-4 h-4 text-white" />
              </div>
            )}
            {child}
          </motion.div>
        );
      })}
    </div>
  );
}

// Grid item wrapper for consistent styling
export function DraggableGridItem({
  children,
  widgetId,
  isDraggable = false,
  className = ''
}) {
  return (
    <div
      className={`
        h-full w-full
        ${isDraggable ? 'cursor-move' : ''}
        ${className}
      `}
    >
      {children}
    </div>
  );
}
