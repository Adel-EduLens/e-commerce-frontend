const fs = require('fs');
const path = require('path');

const dashboardsPath = path.join(__dirname, 'src', 'pages', 'dashboards');

const files = [
  'TraderBrandPartnersPage.tsx',
  'TraderCustomersPage.tsx',
  'TraderDashboard.tsx',
  'TraderDropshippingPage.tsx',
  'TraderFinancePage.tsx',
  'TraderInventoryPage.tsx',
  'TraderNotificationsPage.tsx',
  'TraderOrdersPage.tsx',
  'TraderProductsPage.tsx',
  'TraderWholesalePage.tsx',
];

const sidebarItemsStr = `
const sidebarItems = [
  { label: "Overview", icon: "si_dashboard-line.svg", path: "/dashboard/trader" },
  { label: "Retail", icon: "fluent_building-retail-20-regular.svg", path: "/dashboard/trader/retail" },
  { label: "Dropshipping", icon: "streamline-flex_shipping-box-2.svg", path: "/dashboard/trader/dropshipping" },
  { label: "Wholesale", icon: "system-uicons_boxes.svg", path: "/dashboard/trader/wholesale" },
  { label: "Brand Partners", icon: "mdi_partnership-outline.svg", path: "/dashboard/trader/brand-partners" },
  { label: "Products", icon: "streamline-ultimate_products-gifts.svg", path: "/dashboard/trader/products" },
  { label: "Orders", icon: "carbon_follow-up-work-order.svg", path: "/dashboard/trader/orders" },
  { label: "Inventory", icon: "material-symbols_inventory.svg", path: "/dashboard/trader/inventory" },
  { label: "Customers", icon: "carbon_customer.svg", path: "/dashboard/trader/customers" },
  { label: "Finance", icon: "material-symbols_finance-rounded.svg", path: "/dashboard/trader/finance" },
  { label: "Notifications", icon: "ion_notifications-outline.svg", path: "/dashboard/trader/notifications" },
  { label: "Analytics", icon: "grommet-icons_analytics.svg", path: "/dashboard/trader/analytics" },
  { label: "Store Settings", icon: "solar_settings-linear.svg", path: "/dashboard/trader/settings" },
] as const;
`;

for (const file of files) {
  const filePath = path.join(dashboardsPath, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Insert after traderAsset definition
  if (!content.includes('const sidebarItems =')) {
    const idx = content.indexOf('const traderAsset');
    if (idx !== -1) {
      const endIdx = content.indexOf(';', idx) + 1;
      content = content.slice(0, endIdx) + sidebarItemsStr + content.slice(endIdx);
      fs.writeFileSync(filePath, content, 'utf8');
    }
  }
}
console.log('Done restoring sidebarItems');
