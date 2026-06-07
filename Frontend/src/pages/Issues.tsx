import { useState } from 'react';
import {
  DndContext, DragOverlay,
  useSensor, useSensors, PointerSensor, closestCorners,
} from '@dnd-kit/core';
import type { DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { motion } from 'framer-motion';
import { Plus, AlertCircle, ArrowUp, Circle, ChevronDown, GripVertical, Clock } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import type { Issue } from '../types';

const COLUMNS: { id: Issue['status']; label: string; color: string }[] = [
  { id: 'todo', label: 'To Do', color: '#4D6280' },
  { id: 'in_progress', label: 'In Progress', color: '#3B82F6' },
  { id: 'in_review', label: 'In Review', color: '#7C3AED' },
  { id: 'done', label: 'Done', color: '#10B981' },
];

const PRIORITY_CONFIG = {
  critical: { label: 'Critical', color: 'text-[#EF4444]', bg: 'bg-[#EF4444]/10', icon: AlertCircle },
  high: { label: 'High', color: 'text-[#F59E0B]', bg: 'bg-[#F59E0B]/10', icon: ArrowUp },
  medium: { label: 'Medium', color: 'text-[#3B82F6]', bg: 'bg-[#3B82F6]/10', icon: Circle },
  low: { label: 'Low', color: 'text-[#4D6280]', bg: 'bg-[#4D6280]/10', icon: ChevronDown },
};

const LABEL_COLORS: Record<string, string> = {
  feature: 'text-[#3B82F6] bg-[#3B82F6]/10',
  bug: 'text-[#EF4444] bg-[#EF4444]/10',
  performance: 'text-[#10B981] bg-[#10B981]/10',
  testing: 'text-[#7C3AED] bg-[#7C3AED]/10',
  security: 'text-[#F59E0B] bg-[#F59E0B]/10',
  UX: 'text-[#06B6D4] bg-[#06B6D4]/10',
  design: 'text-[#06B6D4] bg-[#06B6D4]/10',
  mobile: 'text-[#8BA4C0] bg-[#8BA4C0]/10',
  accessibility: 'text-[#8BA4C0] bg-[#8BA4C0]/10',
  collaboration: 'text-[#7C3AED] bg-[#7C3AED]/10',
};

function IssueCard({ issue, overlay }: { issue: Issue; overlay?: boolean }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: issue.id });
  const priority = PRIORITY_CONFIG[issue.priority];
  const PriorityIcon = priority.icon;

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging && !overlay ? 0.3 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={{ ...style, background: '#111C2E' } as React.CSSProperties}
      className={`rounded-xl border border-[#1A2E48] p-3 cursor-pointer hover:border-[#243B55] transition-all group ${
        overlay ? 'shadow-2xl rotate-1 scale-105' : 'hover:shadow-lg'
      }`}
    >
      <div className="flex items-start gap-2">
        <button
          {...attributes}
          {...listeners}
          className="p-0.5 text-[#4D6280] opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing flex-shrink-0 mt-0.5"
        >
          <GripVertical size={12} />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-2">
            <div className={`flex-shrink-0 w-5 h-5 rounded flex items-center justify-center mt-0.5 ${priority.bg}`}>
              <PriorityIcon size={11} className={priority.color} />
            </div>
            <p className="text-xs font-semibold text-[#E2EEFF] leading-tight">{issue.title}</p>
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[10px] text-[#4D6280]">#{issue.number}</span>
            {issue.labels.slice(0, 2).map(l => (
              <span key={l} className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${LABEL_COLORS[l] ?? 'text-[#4D6280] bg-[#162338]'}`}>
                {l}
              </span>
            ))}
            {issue.estimate && (
              <span className="text-[10px] text-[#4D6280] flex items-center gap-0.5 ml-auto">
                <Clock size={9} />
                {issue.estimate}d
              </span>
            )}
          </div>

          {issue.assignee && (
            <div className="flex items-center gap-1.5 mt-2">
              <div
                className="w-4 h-4 rounded-full text-[8px] font-bold text-white flex items-center justify-center flex-shrink-0"
                style={{ background: issue.assignee.color }}
              >
                {issue.assignee.initials.charAt(0)}
              </div>
              <span className="text-[10px] text-[#4D6280] truncate">{issue.assignee.name.split(' ')[0]}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function Column({ column, issues }: { column: (typeof COLUMNS)[0]; issues: Issue[] }) {
  return (
    <div className="flex flex-col min-w-72 max-w-72 flex-shrink-0">
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className="w-2 h-2 rounded-full" style={{ background: column.color }} />
        <span className="text-xs font-semibold text-[#8BA4C0]">{column.label}</span>
        <span className="text-[10px] text-[#4D6280] bg-[#111C2E] px-1.5 py-0.5 rounded-full border border-[#1A2E48]">
          {issues.length}
        </span>
        <button className="ml-auto text-[#4D6280] hover:text-[#8BA4C0] transition-colors p-0.5 rounded hover:bg-[#111C2E]">
          <Plus size={13} />
        </button>
      </div>

      {/* Cards */}
      <SortableContext items={issues.map(i => i.id)} strategy={verticalListSortingStrategy}>
        <div className="flex-1 space-y-2 min-h-32 rounded-xl p-2" style={{ background: 'rgba(13,19,33,0.4)' }}>
          {issues.map(issue => (
            <IssueCard key={issue.id} issue={issue} />
          ))}
          {issues.length === 0 && (
            <div className="h-20 flex items-center justify-center rounded-xl border border-dashed border-[#1A2E48]">
              <p className="text-xs text-[#2D3F55]">No issues</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export function Issues() {
  const { issues, moveIssue } = useAppStore();
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }));

  const activeIssue = issues.find(i => i.id === activeId);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over) return;

    const overId = over.id as string;
    const column = COLUMNS.find(c => c.id === overId || issues.find(i => i.id === overId && i.status === c.id));

    // Find which column the drop target belongs to
    const targetIssue = issues.find(i => i.id === overId);
    const targetStatus = targetIssue?.status ?? (COLUMNS.find(c => c.id === overId)?.id);

    if (targetStatus && active.id !== overId) {
      moveIssue(active.id as string, targetStatus);
    }
  };

  const getColumnIssues = (status: Issue['status']) => issues.filter(i => i.status === status);

  const stats = {
    total: issues.length,
    open: issues.filter(i => i.status !== 'done').length,
    done: issues.filter(i => i.status === 'done').length,
  };

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-4 px-5 py-3 border-b border-[#1A2E48] flex-shrink-0" style={{ background: '#0D1321' }}>
        <div>
          <h2 className="text-sm font-bold text-[#E2EEFF]">Issues</h2>
          <p className="text-xs text-[#4D6280] mt-0.5">{stats.open} open · {stats.done} closed</p>
        </div>
        <div className="flex items-center gap-2 ml-auto">
          <button className="flex items-center gap-1 text-xs text-[#8BA4C0] hover:text-[#E2EEFF] px-2.5 py-1.5 rounded-lg border border-[#1A2E48] hover:border-[#243B55] transition-all">
            Filters
          </button>
          <button className="flex items-center gap-1.5 text-xs bg-[#3B82F6] text-white px-3 py-1.5 rounded-lg hover:bg-[#2563EB] transition-colors font-medium">
            <Plus size={12} />
            New Issue
          </button>
        </div>
      </div>

      {/* Kanban board */}
      <div className="flex-1 overflow-x-auto overflow-y-auto p-5">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-5 min-h-full">
            {COLUMNS.map(col => (
              <Column key={col.id} column={col} issues={getColumnIssues(col.id)} />
            ))}
          </div>

          <DragOverlay>
            {activeIssue && <IssueCard issue={activeIssue} overlay />}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}
