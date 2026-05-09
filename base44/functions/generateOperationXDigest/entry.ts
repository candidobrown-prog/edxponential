import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();

    if (user?.role !== 'admin') {
      return Response.json({ error: 'Forbidden: Admin access required' }, { status: 403 });
    }

    // Fetch all relevant data
    const [workOrders, incidents, budgets, employees, inventory] = await Promise.all([
      base44.entities.OpxWorkOrder.list('-updated_date', 100),
      base44.entities.OpxIncident.list('-incident_date', 50),
      base44.entities.OpxBudget.filter({ status: 'active' }, '-created_date', 50),
      base44.entities.OpxEmployee.filter({ status: 'active' }, '-created_date', 50),
      base44.entities.OpxInventoryItem.list('-last_audited', 50),
    ]);

    // Calculate metrics
    const activeWorkOrders = workOrders.filter(w => w.status === 'in_progress').length;
    const pendingWorkOrders = workOrders.filter(w => w.status === 'submitted').length;
    const completedThisWeek = workOrders.filter(w => 
      w.status === 'completed' && 
      new Date(w.completed_date) > new Date(Date.now() - 7*24*60*60*1000)
    ).length;

    const openIncidents = incidents.filter(i => i.status === 'open').length;
    const criticalIncidents = incidents.filter(i => i.severity === 'critical').length;

    const budgetVariance = budgets.reduce((sum, b) => sum + (b.variance || 0), 0);
    const totalBudgeted = budgets.reduce((sum, b) => sum + (b.budgeted_amount || 0), 0);
    const totalSpent = budgets.reduce((sum, b) => sum + (b.actual_amount || 0), 0);

    const staffOnLeave = employees.filter(e => e.status === 'on_leave').length;
    const pendingOnboarding = employees.filter(e => e.status === 'pending_onboarding').length;

    const lostItems = inventory.filter(i => i.status === 'lost').length;
    const maintenanceItems = inventory.filter(i => i.status === 'maintenance').length;

    // Get all admin users for notification
    const adminUsers = await base44.entities.User.filter({ role: 'admin' }, '-created_date', 100);

    // Build summary
    const summary = {
      weekOf: new Date().toLocaleDateString(),
      workOrders: {
        active: activeWorkOrders,
        pending: pendingWorkOrders,
        completedThisWeek: completedThisWeek,
        total: workOrders.length,
      },
      incidents: {
        open: openIncidents,
        critical: criticalIncidents,
        total: incidents.length,
      },
      budget: {
        totalBudgeted: totalBudgeted.toFixed(2),
        totalSpent: totalSpent.toFixed(2),
        variance: budgetVariance.toFixed(2),
        variancePercent: ((budgetVariance / totalBudgeted) * 100).toFixed(1),
      },
      staffing: {
        active: employees.length,
        onLeave: staffOnLeave,
        pendingOnboarding: pendingOnboarding,
      },
      inventory: {
        total: inventory.length,
        maintenance: maintenanceItems,
        lost: lostItems,
      },
      health: getHealthScore({
        workOrdersBacklog: pendingWorkOrders,
        openIncidents: openIncidents,
        criticalIncidents: criticalIncidents,
        staffIssues: staffOnLeave + pendingOnboarding,
        inventoryIssues: lostItems + maintenanceItems,
      }),
    };

    // Send emails to all admins
    const emailPromises = adminUsers.map(admin =>
      base44.integrations.Core.SendEmail({
        to: admin.email,
        subject: `OperationX Weekly Health Digest - ${summary.weekOf}`,
        body: formatEmailBody(summary),
        from_name: 'OperationX',
      }).catch(err => console.error(`Failed to send email to ${admin.email}:`, err))
    );

    await Promise.all(emailPromises);

    return Response.json({
      success: true,
      digest: summary,
      emailsSent: adminUsers.length,
    });
  } catch (error) {
    console.error('Error generating digest:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
});

function getHealthScore(metrics) {
  let score = 100;
  score -= metrics.workOrdersBacklog * 2;
  score -= metrics.openIncidents * 3;
  score -= metrics.criticalIncidents * 10;
  score -= metrics.staffIssues * 1;
  score -= metrics.inventoryIssues * 2;
  return Math.max(0, Math.min(100, score));
}

function formatEmailBody(summary) {
  const healthColor = summary.health >= 80 ? '🟢' : summary.health >= 50 ? '🟡' : '🔴';
  return `
<!DOCTYPE html>
<html>
<head><style>
  body { font-family: Arial, sans-serif; color: #333; }
  .container { max-width: 600px; margin: 0 auto; }
  .header { background: #0a0a0a; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
  .metric-row { display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #eee; }
  .metric-label { font-weight: bold; }
  .alert { background: #fff3cd; padding: 12px; border-radius: 4px; margin: 10px 0; border-left: 4px solid #ffc107; }
  .critical { background: #f8d7da; border-left-color: #dc3545; }
</style></head>
<body>
  <div class="container">
    <div class="header">
      <h1>OperationX Weekly Health Digest</h1>
      <p style="color: #aaa; margin: 0;">Week of ${summary.weekOf}</p>
    </div>

    <h3>System Health: ${healthColor} ${summary.health}/100</h3>

    <h4>Work Orders</h4>
    <div class="metric-row">
      <span class="metric-label">Active (In Progress)</span>
      <span>${summary.workOrders.active}</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">Pending Approval</span>
      <span>${summary.workOrders.pending}</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">Completed This Week</span>
      <span>${summary.workOrders.completedThisWeek}</span>
    </div>

    <h4>Incidents & Safety</h4>
    <div class="metric-row">
      <span class="metric-label">Open Incidents</span>
      <span>${summary.incidents.open}</span>
    </div>
    ${summary.incidents.critical > 0 ? `
    <div class="alert critical">
      ⚠️ ${summary.incidents.critical} CRITICAL incident(s) require immediate attention
    </div>
    ` : ''}

    <h4>Budget & Finance</h4>
    <div class="metric-row">
      <span class="metric-label">Total Budgeted</span>
      <span>$${summary.budget.totalBudgeted}</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">Total Spent</span>
      <span>$${summary.budget.totalSpent}</span>
    </div>
    <div class="metric-row">
      <span class="metric-label">Variance</span>
      <span>${summary.budget.variance} (${summary.budget.variancePercent}%)</span>
    </div>

    <h4>Staffing</h4>
    <div class="metric-row">
      <span class="metric-label">Active Staff</span>
      <span>${summary.staffing.active}</span>
    </div>
    ${summary.staffing.onLeave > 0 ? `
    <div class="metric-row">
      <span class="metric-label">On Leave</span>
      <span>${summary.staffing.onLeave}</span>
    </div>
    ` : ''}
    ${summary.staffing.pendingOnboarding > 0 ? `
    <div class="alert">
      ℹ️ ${summary.staffing.pendingOnboarding} new hire(s) pending onboarding
    </div>
    ` : ''}

    <h4>Inventory</h4>
    <div class="metric-row">
      <span class="metric-label">Total Items</span>
      <span>${summary.inventory.total}</span>
    </div>
    ${summary.inventory.lost > 0 ? `
    <div class="alert critical">
      ⚠️ ${summary.inventory.lost} item(s) marked as lost
    </div>
    ` : ''}
    ${summary.inventory.maintenance > 0 ? `
    <div class="metric-row">
      <span class="metric-label">In Maintenance</span>
      <span>${summary.inventory.maintenance}</span>
    </div>
    ` : ''}

    <hr style="margin-top: 30px;">
    <p style="color: #999; font-size: 12px;">This is an automated digest. Log into OperationX for detailed views and actions.</p>
  </div>
</body>
</html>
  `;
}