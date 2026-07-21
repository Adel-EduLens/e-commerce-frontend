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

const traderAssetStr = `\nconst traderAsset = (file: string) => \`/trader-overview/\${file.split("/").map(encodeURIComponent).join("/")}\`;\n`;

for (const file of files) {
  const filePath = path.join(dashboardsPath, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Insert after the last import statement
  const lastImportMatch = [...content.matchAll(/import .*?from .*?;?\n/g)].pop();
  if (lastImportMatch && !content.includes('const traderAsset')) {
    const insertPos = lastImportMatch.index + lastImportMatch[0].length;
    content = content.slice(0, insertPos) + traderAssetStr + content.slice(insertPos);
    fs.writeFileSync(filePath, content, 'utf8');
  }
}
console.log('Done restoring traderAsset');
