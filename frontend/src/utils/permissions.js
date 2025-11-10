export const ROLES = {
  OWNER: 'owner',
  ADMIN: 'admin',
  MARKETING: 'marketing_associate',
  SALES: 'sales_associate'
};

export const PERMISSIONS = {
  LEADS_READ: 'leads:read',
  LEADS_WRITE: 'leads:write',
  BOOKINGS_READ: 'bookings:read',
  BOOKINGS_WRITE: 'bookings:write',
  CAMPAIGNS_READ: 'campaigns:read',
  CAMPAIGNS_WRITE: 'campaigns:write',
  BLOG_WRITE: 'blog:write',
  DISCOUNTS_GENERATE_5: 'discounts:generate_5',
  DISCOUNTS_GENERATE_10: 'discounts:generate_10',
  DISCOUNTS_GENERATE_15: 'discounts:generate_15',
  LOTIONS_MANAGE: 'lotions:manage',
  FIZZE_MANAGE: 'fizze:manage',
  ANALYTICS_VIEW: 'analytics:view',
  ANALYTICS_FINANCIAL: 'analytics:financial',
  SOCIAL_WRITE: 'social:write',
  USERS_MANAGE: 'users:manage',
  SYSTEM_CONFIG: 'system:config',
  VOICE_READ: 'voice:read'
};

const ROLE_PERMISSIONS = {
  [ROLES.OWNER]: ['*'],
  [ROLES.ADMIN]: [
    PERMISSIONS.LEADS_READ, PERMISSIONS.LEADS_WRITE,
    PERMISSIONS.BOOKINGS_READ, PERMISSIONS.BOOKINGS_WRITE,
    PERMISSIONS.CAMPAIGNS_READ, PERMISSIONS.CAMPAIGNS_WRITE,
    PERMISSIONS.BLOG_WRITE,
    PERMISSIONS.DISCOUNTS_GENERATE_5, PERMISSIONS.DISCOUNTS_GENERATE_10, PERMISSIONS.DISCOUNTS_GENERATE_15,
    PERMISSIONS.LOTIONS_MANAGE, PERMISSIONS.FIZZE_MANAGE,
    PERMISSIONS.ANALYTICS_VIEW, PERMISSIONS.VOICE_READ
  ],
  [ROLES.MARKETING]: [
    PERMISSIONS.CAMPAIGNS_READ, PERMISSIONS.CAMPAIGNS_WRITE,
    PERMISSIONS.BLOG_WRITE, PERMISSIONS.SOCIAL_WRITE,
    PERMISSIONS.ANALYTICS_VIEW
  ],
  [ROLES.SALES]: [
    PERMISSIONS.LEADS_READ, PERMISSIONS.LEADS_WRITE,
    PERMISSIONS.BOOKINGS_READ, PERMISSIONS.BOOKINGS_WRITE,
    PERMISSIONS.DISCOUNTS_GENERATE_5,
    PERMISSIONS.ANALYTICS_VIEW
  ]
};

export const hasPermission = (userRole, permission) => {
  if (!userRole) return false;
  if (userRole === ROLES.OWNER) return true;
  
  const rolePerms = ROLE_PERMISSIONS[userRole] || [];
  return rolePerms.includes('*') || rolePerms.includes(permission);
};

export const canAccessTab = (userRole, tabName) => {
  const tabPermissions = {
    'Leads': PERMISSIONS.LEADS_READ,
    'Bookings': PERMISSIONS.BOOKINGS_READ,
    'Campaigns': PERMISSIONS.CAMPAIGNS_READ,
    'Blog': PERMISSIONS.BLOG_WRITE,
    'Lotions': PERMISSIONS.LOTIONS_MANAGE,
    'Voice Calls': PERMISSIONS.VOICE_READ,
    'Fizze': PERMISSIONS.FIZZE_MANAGE,
    'Social Media': PERMISSIONS.SOCIAL_WRITE,
    'Analytics': PERMISSIONS.ANALYTICS_VIEW,
    'Financial Reports': PERMISSIONS.ANALYTICS_FINANCIAL,
    'User Management': PERMISSIONS.USERS_MANAGE,
    'System Settings': PERMISSIONS.SYSTEM_CONFIG
  };
  
  const requiredPermission = tabPermissions[tabName];
  if (!requiredPermission) return true; // No restriction
  
  return hasPermission(userRole, requiredPermission);
};

export const getVisibleTabs = (userRole) => {
  const allTabs = [
    'recommendations', 'campaigns', 'leads', 'discounts', 'lotions', 'voicecalls', 'fizze'
  ];
  
  // Map internal tab names to display names for permission check
  const tabDisplayNames = {
    'recommendations': 'Analytics',  // AI recommendations visible to all with analytics
    'campaigns': 'Campaigns',
    'leads': 'Leads',
    'discounts': 'Analytics',  // Discounts visible to all with analytics
    'lotions': 'Lotions',
    'voicecalls': 'Voice Calls',
    'fizze': 'Fizze'
  };
  
  return allTabs.filter(tab => {
    const displayName = tabDisplayNames[tab];
    return canAccessTab(userRole, displayName);
  });
};

export const canGenerateDiscount = (userRole, percentage) => {
  if (userRole === ROLES.OWNER || userRole === ROLES.ADMIN) return true;
  if (userRole === ROLES.SALES && percentage === 5) return true;
  return false;
};
