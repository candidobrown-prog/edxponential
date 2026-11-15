import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { base44 } from '@/api/base44Client';
import { Button } from '@/components/ui/button';
import { formatAmount } from '../components/dealroom/DealCard';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, ChevronRight, FileText } from 'lucide-react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

const STAGES = [
  { key: 'saved',           label: 'Saved',            dot: 'bg-slate-400' },
  { key: 'intro_requested', label: 'Intro Requested',  dot: 'bg-blue-500' },
  { key: 'in_conversation', label: 'In Conversation',  dot: 'bg-yellow-500' },
  { key: 'due_diligence',   label: 'Due Diligence',    dot: 'bg-orange-500' },
  { key: 'invested',        label: 'Invested',         dot: 'bg-green-500' },
  { key: 'passed',          label: 'Passed',           dot: 'bg-red-400' },
];

function PipelineCard({ item, index, navigate }) {
  return (
    <Draggable draggableId={item.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`bg-card border rounded-xl p-4 cursor-grab active:cursor-grabbing transition-shadow select-none ${
            snapshot.isDragging
              ? 'shadow-2xl border-foreground/30 rotate-1'
              : 'border-border/60 hover:border-foreground/20 hover:shadow-md'
          }`}
        >
          <h4
            className="font-heading font-semibold text-sm leading-snug hover:underline cursor-pointer mb-1"
            onClick={() => navigate(`/deal-room/${item.deal_id}`)}
          >
            {item.deal_title}
          </h4>
          <p className="text-[11px] text-muted-foreground">
            By <span className="text-foreground font-medium">{item.founder_name}</span>
          </p>
          {item.amount_seeking && (
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Ask: <span className="text-foreground font-medium">{formatAmount(item.amount_seeking)}</span>
            </p>
          )}
          {item.investment_interest_range && (
            <p className="text-[11px] text-muted-foreground mt-0.5">
              Interest: {item.investment_interest_range.replace(/_/g, ' ').replace('k', 'K').replace('m', 'M')}
            </p>
          )}
          {item.private_notes && (
            <div className="mt-2 pt-2 border-t border-border/40 flex items-start gap-1.5 text-[10px] text-muted-foreground">
              <FileText className="w-3 h-3 mt-0.5 shrink-0" />
              <span className="line-clamp-2">{item.private_notes}</span>
            </div>
          )}
          <div className="mt-3 flex justify-end">
            <button
              onClick={() => navigate(`/deal-room/${item.deal_id}`)}
              className="text-[10px] uppercase tracking-widest text-muted-foreground hover:text-foreground flex items-center gap-1 transition-colors"
            >
              View <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </div>
      )}
    </Draggable>
  );
}

export default function Pipeline() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [user, setUser] = useState(null);

  useEffect(() => {
    base44.auth.me().then(setUser).catch(() => {});
  }, []);

  const { data: pipeline = [], isLoading } = useQuery({
    queryKey: ['pipeline', user?.email],
    queryFn: () => base44.entities.Pipeline.filter({ investor_email: user?.email }),
    enabled: !!user?.email,
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => base44.entities.Pipeline.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pipeline'] }),
  });

  const onDragEnd = (result) => {
    const { draggableId, destination } = result;
    if (!destination) return;
    const newStage = destination.droppableId;
    const item = pipeline.find(p => p.id === draggableId);
    if (!item || item.stage === newStage) return;
    updateMutation.mutate({
      id: draggableId,
      data: { stage: newStage, last_activity: new Date().toISOString().split('T')[0] },
    });
  };

  const stageCount = (key) => pipeline.filter(p => p.stage === key).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <TrendingUp className="w-4 h-4 text-muted-foreground" />
          <span className="text-[10px] uppercase tracking-widest text-muted-foreground font-medium">Investor Dashboard</span>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-3xl font-bold">My Pipeline</h1>
          <Button variant="outline" className="rounded-xl gap-2 text-xs" onClick={() => navigate('/deal-room')}>
            Browse Deals <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
        <p className="text-muted-foreground text-sm mt-1">Drag cards between stages to update deal status.</p>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Total Deals', value: pipeline.length },
          { label: 'Intro Requested', value: stageCount('intro_requested') },
          { label: 'In Conversation', value: stageCount('in_conversation') + stageCount('due_diligence') },
          { label: 'Invested', value: stageCount('invested') },
        ].map(s => (
          <div key={s.label} className="bg-card border border-border/60 rounded-xl p-4 text-center">
            <div className="font-heading text-3xl font-bold">{s.value}</div>
            <div className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Kanban Board */}
      {isLoading ? (
        <div className="flex gap-4">
          {[1,2,3,4].map(i => <div key={i} className="flex-1 h-64 bg-muted rounded-2xl animate-pulse" />)}
        </div>
      ) : pipeline.length === 0 ? (
        <div className="text-center py-24 border border-dashed border-border rounded-2xl">
          <TrendingUp className="w-10 h-10 text-muted-foreground/20 mx-auto mb-4" />
          <h3 className="font-heading text-lg font-semibold text-muted-foreground">No deals yet</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">Save or request intros in the Deal Room to build your pipeline.</p>
          <Button variant="outline" onClick={() => navigate('/deal-room')} className="rounded-xl gap-2">
            Browse Deal Room <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-1 px-1">
            {STAGES.map(stage => {
              const cards = pipeline.filter(p => p.stage === stage.key);
              return (
                <div key={stage.key} className="flex-shrink-0 w-64 flex flex-col">
                  {/* Column header */}
                  <div className="flex items-center gap-2 mb-3 px-1">
                    <span className={`w-2 h-2 rounded-full ${stage.dot}`} />
                    <span className="text-xs font-medium">{stage.label}</span>
                    <span className="ml-auto text-[10px] text-muted-foreground bg-muted rounded-full px-2 py-0.5">
                      {cards.length}
                    </span>
                  </div>

                  {/* Drop zone */}
                  <Droppable droppableId={stage.key}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 min-h-[120px] rounded-2xl p-2 space-y-3 transition-colors ${
                          snapshot.isDraggingOver
                            ? 'bg-muted/80 border-2 border-dashed border-foreground/20'
                            : 'bg-muted/30 border-2 border-dashed border-transparent'
                        }`}
                      >
                        {cards.map((item, index) => (
                          <PipelineCard key={item.id} item={item} index={index} navigate={navigate} />
                        ))}
                        {provided.placeholder}
                        {cards.length === 0 && !snapshot.isDraggingOver && (
                          <div className="flex items-center justify-center h-20 text-[10px] text-muted-foreground/50 uppercase tracking-widest">
                            Drop here
                          </div>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
            })}
          </div>
        </DragDropContext>
      )}
    </div>
  );
}