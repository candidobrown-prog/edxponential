import { createClientFromRequest } from 'npm:@base44/sdk@0.8.25';

/**
 * Integration Webhook Handler
 * Receives and processes webhooks from external integrations
 */

Deno.serve(async (req) => {
  try {
    // Only accept POST requests
    if (req.method !== 'POST') {
      return Response.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const body = await req.text();
    const signature = req.headers.get('x-webhook-signature');
    const integrationId = req.headers.get('x-integration-id');

    if (!signature || !integrationId) {
      return Response.json({ error: 'Missing webhook headers' }, { status: 400 });
    }

    const base44 = createClientFromRequest(req);

    // Verify webhook signature (use actual HMAC verification in production)
    // For now, just accept if signature exists
    if (!signature) {
      return Response.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const data = JSON.parse(body);
    const eventType = data.type || 'unknown';

    // Log the webhook
    const logEntry = await base44.asServiceRole.entities.IntegrationLog.create({
      integration_id: integrationId,
      integration_type: data.source || 'unknown',
      organization_id: data.organization_id || 'unknown',
      event_type: 'webhook_received',
      action: `Webhook received: ${eventType}`,
      status: 'success',
      metadata: JSON.stringify(data),
      timestamp: new Date().toISOString(),
    });

    console.log(`Webhook processed for integration ${integrationId}: ${eventType}`);

    return Response.json({ success: true, webhookId: logEntry.id }, { status: 200 });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return Response.json(
      { error: 'Failed to process webhook', details: error.message },
      { status: 500 }
    );
  }
});