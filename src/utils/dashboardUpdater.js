// Utility to trigger dashboard updates from any component

/**
 * Trigger a dashboard update
 * Call this after any action that should update the dashboard
 * (e.g., solving a problem, completing a goal, earning a certificate)
 */
export const triggerDashboardUpdate = () => {
  // Dispatch custom event for same-tab updates
  window.dispatchEvent(new Event('dashboardUpdate'));
  
  console.log('📊 Dashboard update triggered');
};

/**
 * Update localStorage and trigger dashboard refresh
 * @param {string} key - localStorage key
 * @param {any} value - value to store
 */
export const updateAndRefresh = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
  triggerDashboardUpdate();
};

export default {
  triggerDashboardUpdate,
  updateAndRefresh
};
