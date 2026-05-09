import React, { useState, useMemo } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AlertCircle, CheckCircle, Clock, Wrench, User, FileText } from 'lucide-react';

const COLUMNS = [
  { id: 'submitted', label: 'Submitted', color: 'bg-blue-500/10 border-blue-500/30', icon: Clock },
  { id: 'approved', label: 'Approved', color: 'bg-yellow-500/10 border-yellow-500/30', icon: CheckCircle },
  { id: 'in_progress', label: 'In Progress', color: 'bg-purple-500/10 border-purple-500/30', icon: Wrench },
  { id: 'completed', label: 'Completed', color: 'bg-green-500/10 border-green-500/30', icon: CheckCircle },
];

const CATEGORY_ICONS = {
  work_order: Wrench,
  incident: AlertCircle,
  employee: User,
};

const PRIORITY_COLORS = {
  low: 'bg-slate-100 text-slate-700',
  medium: 'bg-amber-100 text-amber-700',
  high: 'bg-red-100 text-red-700',
  emergency: 'bg-red-200 text-red-800',
};

export default function OpxKanban() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState('all');

  // Fetch work orders
  const { data: workOrders = [] } = useQuery({
    queryKey: ['workOrders'],
    queryFn: () => base44.entities.OpxWorkOrder.list(),
  });

  // Fetch incidents
  const { data: incidents = [] } = useQuery({
    queryKey: ['incidents'],
    queryFn: () => base44.entities.OpxIncident.list(),
  });

  // Fetch employees (pending onboarding)
  const { data: employees = [] } = useQuery({
    queryKey: ['employees'],
    queryFn: () => base44.entities.OpxEmployee.list(),
  });

  // Mutation for updating status
  const updateWorkOrderMutation = useMutation({
    mutationFn: (data) => base44.entities.OpxWorkOrder.update(data.id, { status: data.status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['workOrders'] }),
  });

  const updateIncidentMutation = useMutation({
    mutationFn: (data) => base44.entities.OpxIncident.update(data.id, { status: data.status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['incidents'] }),
  });

  const updateEmployeeMutation = useMutation({
    mutationFn: (data) => base44.entities.OpxEmployee.update(data.id, { status: data.status }),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['employees'] }),
  });

  // Normalize all tasks
  const allTasks = useMemo(() => {
    const tasks = [];

    workOrders.forEach(wo => {
      tasks.push({
        id: `wo-${wo.id}`,
        title: wo.title,
        status: wo.status,
        priority: wo.priority,
        category: 'work_order',
        type: 'Work Order',
        location: wo.location_room,
        assignee: wo.assigned_to,
        entity: { id: wo.id, name: 'OpxWorkOrder' },
      });
    });

    incidents.forEach(inc => {
      tasks.push({
        id: `inc-${inc.id}`,
        title: inc.title,
        status: inc.status,
        priority: inc.severity,
        category: 'incident',
        type: 'Incident',
        location: inc.location,
        entity: { id: inc.id, name: 'OpxIncident' },
      });
    });

    employees.forEach(emp => {
      if (emp.status === 'pending_onboarding' || emp.status === 'on_leave') {
        tasks.push({
          id: `emp-${emp.id}`,
          title: `${emp.first_name} ${emp.last_name}`,
          status: emp.status === 'pending_onboarding' ? 'submitted' : 'in_progress',
          priority: 'medium',
          category: 'employee',
          type: 'Employee',
          location: emp.department,
          assignee: emp.role_title,
          entity: { id: emp.id, name: 'OpxEmployee' },
        });
      }
    });

    return tasks;
  }, [workOrders, incidents, employees]);

  // Group tasks by status
  const tasksByStatus = useMemo(() => {
    const grouped = {};
    COLUMNS.forEach(col => {
      grouped[col.id] = [];
    });

    allTasks.forEach(task => {
      if (!grouped[task.status]) {
        grouped[task.status] = [];
      }
      grouped[task.status].push(task);
    });

    return grouped;
  }, [allTasks]);

  // Handle drag end
  const handleDragEnd = (result) => {
    const { source, destination, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const task = allTasks.find(t => t.id === draggableId);
    if (!task) return;

    const newStatus = destination.droppableId;

    if (task.entity.name === 'OpxWorkOrder') {
      updateWorkOrderMutation.mutate({ id: task.entity.id, status: newStatus });
    } else if (task.entity.name === 'OpxIncident') {
      updateIncidentMutation.mutate({ id: task.entity.id, status: newStatus });
    } else if (task.entity.name === 'OpxEmployee') {
      updateEmployeeMutation.mutate({ id: task.entity.id, status: newStatus === 'submitted' ? 'pending_onboarding' : 'on_leave' });
    }
  };

  const filteredTasks = filter === 'all'
    ? tasksByStatus
    : Object.fromEntries(
      Object.entries(tasksByStatus).map(([status, tasks]) => [
        status,
        tasks.filter(t => t.category === filter),
      ])
    );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Operations Kanban</h1>
          <p className="text-white/40 text-sm mt-1">Drag tasks between columns to update status</p>
        </div>
        <div className="flex gap-2">
          {[
            { id: 'all', label: 'All Tasks' },
            { id: 'work_order', label: 'Work Orders' },
            { id: 'incident', label: 'Incidents' },
            { id: 'employee', label: 'Employees' },
          ].map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                filter === f.id
                  ? 'bg-white text-black'
                  : 'bg-white/10 text-white/60 hover:bg-white/20'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Kanban Board */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-4 gap-4 min-h-[600px]">
          {COLUMNS.map(column => {
            const ColumnIcon = column.icon;
            const tasks = filteredTasks[column.id] || [];

            return (
              <Droppable key={column.id} droppableId={column.id}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`rounded-xl p-4 min-h-[600px] transition-all ${
                      snapshot.isDraggingOver
                        ? 'bg-white/5 border-2 border-white/30'
                        : column.color + ' border'
                    }`}
                  >
                    {/* Column Header */}
                    <div className="flex items-center gap-2 mb-4">
                      <ColumnIcon className="w-4 h-4 text-white/60" />
                      <h2 className="font-bold text-white text-sm">{column.label}</h2>
                      <span className="ml-auto text-xs text-white/40 bg-white/5 px-2 py-1 rounded">{tasks.length}</span>
                    </div>

                    {/* Tasks */}
                    <div className="space-y-3">
                      {tasks.map((task, index) => {
                        const CategoryIcon = CATEGORY_ICONS[task.category] || FileText;
                        return (
                          <Draggable key={task.id} draggableId={task.id} index={index}>
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                className={`p-3 rounded-lg border transition-all ${
                                  snapshot.isDragging
                                    ? 'bg-white/20 border-white/40 shadow-lg shadow-white/20'
                                    : 'bg-black/20 border-white/10 hover:border-white/20 hover:bg-black/30'
                                }`}
                              >
                                <div className="flex items-start gap-2 mb-2">
                                  <CategoryIcon className="w-3.5 h-3.5 text-white/50 mt-0.5 flex-shrink-0" />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-xs font-semibold text-white truncate">{task.title}</p>
                                    <p className="text-[10px] text-white/40 truncate">{task.type}</p>
                                  </div>
                                </div>

                                {/* Metadata */}
                                <div className="space-y-1.5 text-[10px]">
                                  {task.location && (
                                    <p className="text-white/50">{task.location}</p>
                                  )}
                                  {task.assignee && (
                                    <p className="text-white/50">→ {task.assignee}</p>
                                  )}
                                </div>

                                {/* Priority Badge */}
                                <div className="mt-2">
                                  <Badge className={`text-[10px] py-0.5 ${PRIORITY_COLORS[task.priority] || 'bg-slate-100'}`}>
                                    {task.priority}
                                  </Badge>
                                </div>
                              </div>
                            )}
                          </Draggable>
                        );
                      })}
                    </div>

                    {provided.placeholder}

                    {/* Empty State */}
                    {tasks.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-32 text-white/30">
                        <div className="text-xs text-center">No tasks</div>
                      </div>
                    )}
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 pt-4 border-t border-white/10">
        {COLUMNS.map(col => (
          <div key={col.id} className="p-4 rounded-xl bg-white/5 border border-white/10">
            <p className="text-[10px] text-white/40 uppercase tracking-wider mb-2">{col.label}</p>
            <p className="text-2xl font-black text-white">{filteredTasks[col.id]?.length || 0}</p>
          </div>
        ))}
      </div>
    </div>
  );
}