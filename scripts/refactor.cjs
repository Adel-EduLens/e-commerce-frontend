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

const sidebarItemsRegex = /const sidebarItems = \[\s*\{.*?\}\s*\] as const;/gs;
const traderAssetRegex = /const traderAsset = \(file: string\) =>[\s\S]*?;/;

for (const file of files) {
  const filePath = path.join(dashboardsPath, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Strip sidebar items and traderAsset if they exist (only globally)
  content = content.replace(sidebarItemsRegex, '');
  content = content.replace(traderAssetRegex, '');

  // Regex to match the start of the layout wrapper:
  // <div className="min-h-screen ...">
  //   <div className="mx-auto flex ...">
  //     <aside ...> ... </aside>
  //     <main ...>
  // We want to remove everything from `<div className="min-h-screen` up to and including `<main className="min-w-0 flex-1 space-y-5">`
  
  // Actually, wait, some files might have `space-y-6` for main.
  // A robust way is to just find `<main` and replace everything before it up to the return statement.
  
  // The structure is usually:
  // return (
  //   <div className="min-h-screen ...">
  //     <div ...>
  //       <aside ...>
  //       ...
  //       </aside>
  //       <main className="...">
  
  // Some files have a top header inside `<main>`:
  //         {/* Top Header */}
  //         <div className="flex h-20 items-center justify-between rounded-3xl border border-[#E5E7EB] bg-white px-6">
  //           ...
  //         </div>
  
  // Let's replace the whole `<aside> ... </aside>` block with empty string
  const asideRegex = /<aside.*?<\/aside>/s;
  content = content.replace(asideRegex, '');

  // Now the top-level divs `<div className="min-h-screen ..."><div className="mx-auto flex ...">`
  // And the closing `</div></div>` at the very end before `);`
  const topDiv1Regex = /<div className="min-h-screen[^"]*">\s*<div className="mx-auto flex[^"]*">/s;
  content = content.replace(topDiv1Regex, '<>');
  
  // Match the closing tags at the end
  const closingRegex = /<\/div>\s*<\/div>\s*\);\s*\}\s*$/s;
  content = content.replace(closingRegex, '</>\n  );\n}');

  // Remove the <main ...> tag and its corresponding closing </main>
  // But TraderAnalyticsPage has <main> and we want to keep it if we just removed it?
  // Wait, if I just replace `<main ...>` with `<div className="flex-1 space-y-5">` it keeps the structure safe.
  const mainRegex = /<main className="min-w-0 flex-1([^"]*)">/s;
  content = content.replace(mainRegex, '<div className="flex-1$1">');
  const endMainRegex = /<\/main>\s*<\/>\s*\);\s*\}\s*$/s;
  content = content.replace(endMainRegex, '</div>\n    </>\n  );\n}');

  // Remove the Top Header block inside main
  const topHeaderRegex = /{\/\*\s*Top Header\s*\*\/}\s*<div className="flex h-20 items-center justify-between[^>]*>.*?<\/div>\s*<\/div>\s*<\/div>/s;
  // This top header regex is tricky because it has nested divs. 
  // Let's use a known string for the top header.
  // It starts with `<div className="flex h-20 items-center justify-between` and ends with `alt="Profile" /></div></div>`
  const topHeaderStringRegex = /{\/\*\s*Top Header\s*\*\/}\s*<div className="flex h-20 items-center justify-between.*?alt="Profile"( \/)?><\/div>\s*<\/div>/s;
  content = content.replace(topHeaderStringRegex, '');

  // If the file is TraderDashboard, it doesn't have the top header, it has `Dashboard Overview`.
  // So the top header regex won't match, which is fine.

  // Also remove `useNavigate`, `useAuthStore`, `toast` if they are not used anymore.
  // Let's just leave the imports for now to avoid breaking things, we can fix TS errors later.
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed ${file}`);
}
