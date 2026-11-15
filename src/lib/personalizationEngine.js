import { base44 } from '@/api/base44Client';

export const ROLE_MODULES = {
  principal: [
    'operationx',
    'graiedx',
    'foundaitionx',
    'xschores',
    'daida-baixed',
  ],
  teacher: [
    'graiedx',
    'classifiedx',
    'perspedxtives',
    'twotrx',
  ],
  founder: [
    'foundaitionx',
    'operationx',
    'educartx',
    'edxportante',
  ],
  tutor: [
    'twotrx',
    'edxportante',
    'coaching',
  ],
  admin: [
    'operationx',
    'xschores',
    'graiedx',
    'foundaitionx',
  ],
  investor: [
    'edvestors',
    'deal-room',
    'pipeline',
  ],
};

export const TIER_FEATURES = {
  free: {
    name: 'Essentials',
    price: 0,
    features: ['Dashboard', 'Basic Analytics', 'Email Support'],
    modules: 3,
  },
  pro: {
    name: 'Professional',
    price: 99,
    features: ['All Essentials', 'Advanced Analytics', 'Priority Support', 'Integrations', 'Custom Reports'],
    modules: 7,
  },
  enterprise: {
    name: 'Enterprise',
    price: 'Custom',
    features: ['Everything', 'Dedicated Support', 'Custom Integrations', 'API Access', 'SSO', 'SLA'],
    modules: 'All',
  },
};

export const DASHBOARD_TYPES = {
  minimal: {
    name: 'Minimal',
    description: 'Focus on 3-4 key metrics',
    cardCount: 4,
  },
  balanced: {
    name: 'Balanced',
    description: 'Mix of operations and insights',
    cardCount: 8,
  },
  comprehensive: {
    name: 'Comprehensive',
    description: 'Full operational view',
    cardCount: 12,
  },
};

export async function generatePersonalizedDashboard(userProfile, aiRecommendation) {
  const { role, organization, teamSize, priorities, timeline } = userProfile;
  const { tier, features, dashboardType, nextSteps } = aiRecommendation;

  // Get relevant modules
  const modules = ROLE_MODULES[role] || [];
  const visibleModules = modules.slice(0, TIER_FEATURES[tier]?.modules || 3);

  // Get dashboard configuration
  const dashboardConfig = DASHBOARD_TYPES[dashboardType] || DASHBOARD_TYPES.balanced;

  // Store personalization data
  await base44.auth.updateMe({
    role_type: role,
    organization_type: organization,
    team_size: teamSize,
    priorities: priorities,
    preferred_tier: tier,
    dashboard_type: dashboardType,
    visible_modules: visibleModules,
    onboarded_at: new Date().toISOString(),
  });

  return {
    visibleModules,
    dashboardConfig,
    tier,
    nextSteps,
    xschoolBox: modules.slice(visibleModules.length),
  };
}

export function getModuleIcon(moduleId) {
  const icons = {
    operationx: '⚙️',
    graiedx: '📚',
    foundaitionx: '🏛️',
    xschores: '📊',
    'daida-baixed': '🎯',
    classifiedx: '🎓',
    perspedxtives: '♿',
    twotrx: '🎓',
    educartx: '🛒',
    edxportante: '✍️',
    coaching: '👨‍🏫',
    edvestors: '💰',
    'deal-room': '📈',
    pipeline: '🎯',
  };
  return icons[moduleId] || '⭐';
}

export function getModuleName(moduleId) {
  const names = {
    operationx: 'OperationX™',
    graiedx: 'Graiedx™',
    foundaitionx: 'Foundaitionx™',
    xschores: 'Xschores™',
    'daida-baixed': 'Daida Baixed™',
    classifiedx: 'Classifiedx™',
    perspedxtives: 'PerSpEdxtives™',
    twotrx: 'TwotrX™',
    educartx: 'EduCartx™',
    edxportante: 'EdXportante™',
    coaching: 'Coaching',
    edvestors: 'EdVestors',
    'deal-room': 'Deal Room',
    pipeline: 'Pipeline',
  };
  return names[moduleId] || moduleId;
}