/**
 * VSP Porto Installer - Cloudflare Worker
 * Serves installation scripts for vsp-porto CLI and simulation packages
 * 
 * Endpoints:
 * - / or /porto     → vsp-porto CLI installer
 * - /kalpataru      → Kalpataru simulation installer
 * - /ai-gov         → AI Governance simulation installer
 * - /ledger         → Blockchain Ledger simulation installer
 * - /iac            → Multi-Cloud IaC simulation installer
 * - /zero-trust     → Zero-Trust Network simulation installer
 */

const PACKAGES = {
  porto: {
    name: "Porto CLI",
    description: "Portfolio Simulation Manager",
    githubRepo: "vspatabuga/vsp-porto-management",
    npmPackage: "@vspatabuga/porto",
  },
  kalpataru: {
    name: "Kalpataru",
    description: "Waste Management & Circular Economy System",
    githubRepo: "vspatabuga/kalpataru-backend-configuration",
    npmPackage: "@vspatabuga/sim-kalpataru",
  },
  "ai-gov": {
    name: "AI Governance",
    description: "Private AI Orchestration Stack",
    githubRepo: "vspatabuga/ai-governance-orchestrator",
    npmPackage: "@vspatabuga/sim-ai-gov",
  },
  ledger: {
    name: "Blockchain Ledger",
    description: "Immutable Voting System",
    githubRepo: "vspatabuga/evote-blockchain-dapps",
    npmPackage: "@vspatabuga/sim-ledger",
  },
  iac: {
    name: "Multi-Cloud IaC",
    description: "Terraform Infrastructure Simulation",
    githubRepo: "vspatabuga/sovereign-cloud-fabric",
    npmPackage: "@vspatabuga/sim-iac",
  },
  "zero-trust": {
    name: "Zero-Trust Network",
    description: "Identity-Centric Security Architecture",
    githubRepo: "vspatabuga/zero-trust-network",
    npmPackage: "@vspatabuga/sim-zero-trust",
  },
};

function getCLIInstallerScript(): string {
  return `#!/usr/bin/env bash

set -e

BLUE='\\033[0;34m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
RED='\\033[0;31m'
CYAN='\\033[0;36m'
NC='\\033[0m'

echo -e "\${CYAN}"
cat << "BANNER"
/$$    /$$  /$$$$$$        /$$$$$$$   /$$$$$$  /$$$$$$$$ /$$$$$$  /$$$$$$$  /$$   /$$  /$$$$$$   /$$$$$$ 
| $$   | $$ /$$__  $$      | $$__  $$ /$$__  $$|__  $$__//$$__  $$| $$__  $$| $$  | $$ /$$__  $$ /$$__  $$
| $$   | $$| $$  \__/      | $$  \ $$| $$  \ $$   | $$  | $$  \ $$| $$  \ $$| $$  | $$| $$  \__/| $$  \ $$
|  $$ / $$/|  $$$$$$       | $$$$$$$/| $$$$$$$$   | $$  | $$$$$$$$| $$$$$$$ | $$  | $$| $$ /$$$$| $$$$$$$$
 \  $$ $$/  \____  $$      | $$____/ | $$__  $$   | $$  | $$__  $$| $$__  $$| $$  | $$| $$|_  $$| $$__  $$
  \  $$$/   /$$  \ $$      | $$      | $$  | $$   | $$  | $$  | $$| $$  \ $$| $$  | $$| $$  \ $$| $$  | $$
   \  $/   |  $$$$$$/      | $$      | $$  | $$   | $$  | $$  | $$| $$$$$$$/|  $$$$$$/|  $$$$$$/| $$  | $$
    \_/     \______/       |__/      |__/  |__/   |__/  |__/  |__/|_______/  \______/  \______/ |__/  |__/
BANNER
echo -e "\${NC}"

echo -e "\${YELLOW}VSP Porto Management System\${NC}"
echo ""

echo -e "\${YELLOW}>> Checking prerequisites...\${NC}"

# Check Node.js
NODE_PATH=$(which node 2>/dev/null || echo "")
if [ -z "$NODE_PATH" ]; then
    echo -e "\${RED}✗ Node.js not found.\${NC}"
    echo "  Install: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "\${RED}✗ Node.js 18+ required. Current: $(node -v)\${NC}"
    exit 1
fi
echo -e "\${GREEN}✓\${NC} Node.js $(node -v)"

# Check npm
NPM_PATH=$(which npm 2>/dev/null || echo "")
if [ -z "$NPM_PATH" ]; then
    echo -e "\${RED}✗ npm not found\${NC}"
    exit 1
fi
echo -e "\${GREEN}✓\${NC} npm $(npm -v)"

# Check Docker
DOCKER_PATH=$(which docker 2>/dev/null || echo "")
if [ -z "$DOCKER_PATH" ]; then
    echo -e "\${RED}✗ Docker not found\${NC}"
    echo "  Install: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo -e "\${YELLOW}⚠ Docker is installed but not running.\${NC}"
    echo "  Please start Docker before using vsp-porto."
fi
echo -e "\${GREEN}✓\${NC} Docker"

# Check GitHub CLI (optional)
GH_PATH=$(which gh 2>/dev/null || echo "")
if [ -n "$GH_PATH" ]; then
    echo -e "\${GREEN}✓\${NC} GitHub CLI (gh)"
fi

echo -e "\${YELLOW}>> Installing @vspatabuga/porto...\${NC}"

# Create temporary directory
INSTALL_DIR=$(mktemp -d)
cd "\$INSTALL_DIR"

# Download package tarball from GitHub Packages
echo "Downloading package..."
if ! npm pack @vspatabuga/porto --registry https://npm.pkg.github.com 2>/dev/null; then
    echo -e "\${RED}✗ Failed to download package\${NC}"
    exit 1
fi
TARBALL=$(ls vspatabuga-porto-*.tgz 2>/dev/null | head -1)
if [ -z "\$TARBALL" ]; then
    echo -e "\${RED}✗ Failed to download package\${NC}"
    exit 1
fi

# Extract package
tar -xzf "\$TARBALL"
rm "\$TARBALL"

  # Create user-local installation directory
  echo "Setting up user-local installation..."
  PORTO_HOME="$HOME/.local/share/vsp-porto"
  PORTO_BIN="$HOME/.local/bin"
  
  mkdir -p "\$PORTO_HOME"
  mkdir -p "\$PORTO_BIN"
  
  # Move package to installation directory
  mv package "\$PORTO_HOME/app"
  
  # Install dependencies from npmjs.org with user-local settings
  echo "Installing dependencies..."
  cd "\$PORTO_HOME/app"
  cat > .npmrc << 'EOF'
registry=https://registry.npmjs.org/
EOF
  npm install --prefix "\$PORTO_HOME/app" > /dev/null 2>&1 || {
      echo -e "\${RED}✗ Failed to install dependencies\${NC}"
      exit 1
  }

  # Create wrapper script in user bin
  cat > "\$PORTO_BIN/vsp-porto" << 'WRAPPER'
#!/usr/bin/env bash
PORTO_HOME="$HOME/.local/share/vsp-porto"
exec node "\$PORTO_HOME/app/dist/cli.cjs" "\$@"
WRAPPER
  chmod +x "\$PORTO_BIN/vsp-porto"

  # Add to PATH if not already there
  if [[ ":\$PATH:" != *":\$HOME/.local/bin:"* ]]; then
      echo "" >> "$HOME/.bashrc" 2>/dev/null || true
      echo 'export PATH="$HOME/.local/bin:$PATH"' >> "$HOME/.bashrc" 2>/dev/null || true
      export PATH="\$HOME/.local/bin:\$PATH"
  fi

  cd /tmp
  rm -rf "\$INSTALL_DIR"

  if [ -f "\$PORTO_BIN/vsp-porto" ]; then
    echo -e "\n\${GREEN}═══════════════════════════════════════════════════════════════\${NC}"
    echo -e "\${GREEN}✓\${NC} Installation successful!"
    echo -e "\${GREEN}═══════════════════════════════════════════════════════════════\${NC}"
    echo ""
    echo -e "\${YELLOW}Available Commands:\${NC}"
    echo ""
    echo -e "  \${BLUE}vsp-porto list\${NC}"
    echo -e "      → See all available simulation packages"
    echo ""
    echo -e "  \${BLUE}vsp-porto install kalpataru\${NC}"
    echo -e "      → Install Waste Management simulation"
    echo ""
    echo -e "  \${BLUE}vsp-porto install ai-gov\${NC}"
    echo -e "      → Install AI Governance simulation"
    echo ""
    echo -e "  \${BLUE}vsp-porto install ledger\${NC}"
    echo -e "      → Install Blockchain Ledger simulation"
    echo ""
    echo -e "  \${BLUE}vsp-porto install iac\${NC}"
    echo -e "      → Install Multi-Cloud IaC simulation"
    echo ""
    echo -e "  \${BLUE}vsp-porto install zero-trust\${NC}"
    echo -e "      → Install Zero-Trust Network simulation"
    echo ""
    echo -e "\${YELLOW}Quick Start:\${NC}"
    echo -e "  1. vsp-porto list"
    echo -e "  2. vsp-porto install <package>"
    echo -e "  3. vsp-porto start <package>"
    echo ""
    echo -e "Documentation: \${BLUE}https://github.com/vspatabuga/vsp-porto-management\${NC}"
    echo -e "Portfolio:      \${BLUE}https://vspatabuga.io\${NC}"
else
    echo -e "\${RED}✗ Installation failed\${NC}"
    echo ""
    echo -e "\${YELLOW}Troubleshooting:\${NC}"
    echo -e "  1. Make sure Docker is running"
    echo -e "  2. Check Node.js version (18+ required)"
    exit 1
fi
`;
}

function getSimulationInstallerScript(pkg: typeof PACKAGES[keyof typeof PACKAGES], slug: string): string {
  return `#!/usr/bin/env bash

# ============================================
# VSP Porto - Simulation Installer
# Package: ${pkg.name}
# ============================================

set -e

BLUE='\\033[0;34m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
RED='\\033[0;31m'
CYAN='\\033[0;36m'
NC='\\033[0m'

echo -e "\${CYAN}"
cat << "BANNER"
/$$    /$$  /$$$$$$        /$$$$$$$   /$$$$$$  /$$$$$$$$ /$$$$$$  /$$$$$$$  /$$   /$$  /$$$$$$   /$$$$$$ 
| $$   | $$ /$$__  $$      | $$__  $$ /$$__  $$|__  $$__//$$__  $$| $$__  $$| $$  | $$ /$$__  $$ /$$__  $$
| $$   | $$| $$  \__/      | $$  \ $$| $$  \ $$   | $$  | $$  \ $$| $$  \ $$| $$  | $$| $$  \__/| $$  \ $$
|  $$ / $$/|  $$$$$$       | $$$$$$$/| $$$$$$$$   | $$  | $$$$$$$$| $$$$$$$ | $$  | $$| $$ /$$$$| $$$$$$$$
 \  $$ $$/  \____  $$      | $$____/ | $$__  $$   | $$  | $$__  $$| $$__  $$| $$  | $$| $$|_  $$| $$__  $$
  \  $$$/   /$$  \ $$      | $$      | $$  | $$   | $$  | $$  | $$| $$  \ $$| $$  | $$| $$  \ $$| $$  | $$
   \  $/   |  $$$$$$/      | $$      | $$  | $$   | $$  | $$  | $$| $$$$$$$/|  $$$$$$/|  $$$$$$/| $$  | $$
    \_/     \______/       |__/      |__/  |__/   |__/  |__/  |__/|_______/  \______/  \______/ |__/  |__/
BANNER
echo -e "\${NC}"

echo -e "\${YELLOW}VSP Porto Management System\${NC}"
echo ""

echo -e "\${CYAN}Package: \${pkg.name}\${NC}"
echo -e "\${CYAN}Description: \${pkg.description}\${NC}"
echo -e ""

# Check prerequisites
echo -e "\${YELLOW}>> Checking prerequisites...\${NC}"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "\${RED}✗ Docker not found\${NC}"
    echo "  Install: https://docs.docker.com/get-docker/"
    exit 1
fi

if ! docker info &> /dev/null; then
    echo -e "\${YELLOW}⚠ Docker is installed but not running.\${NC}"
    echo "  Please start Docker first."
    exit 1
fi
echo -e "\${GREEN}✓\${NC} Docker"

# Install vsp-porto if not installed
if ! command -v vsp-porto &> /dev/null; then
    echo -e "\${YELLOW}>> Installing vsp-porto CLI...\${NC}"
    npm install -g @vspatabuga/porto --registry https://npm.pkg.github.com
    echo -e "\${GREEN}✓\${NC} vsp-porto installed"
fi

echo -e "\${YELLOW}>> Installing ${pkg.name}...\${NC}"

# Use vsp-porto to install
vsp-porto install ${slug}

if [ $? -eq 0 ]; then
    echo -e "\n\${GREEN}═══════════════════════════════════════════════════════════════\${NC}"
    echo -e "\${GREEN}✓\${NC} ${pkg.name} installed successfully!"
    echo -e "\${GREEN}═══════════════════════════════════════════════════════════════\${NC}"
    echo ""
    echo -e "\${YELLOW}Next Steps:\${NC}"
    echo ""
    echo -e "  1. Start the simulation:"
    echo -e "     \${BLUE}vsp-porto start ${slug}\${NC}"
    echo ""
    echo -e "  2. Open browser:"
    echo -e "     \${BLUE}vsp-porto open ${slug}\${NC}"
    echo ""
    echo -e "  3. View logs:"
    echo -e "     \${BLUE}vsp-porto logs ${slug}\${NC}"
    echo ""
    echo -e "  4. Stop simulation:"
    echo -e "     \${BLUE}vsp-porto stop ${slug}\${NC}"
    echo ""
    echo -e "\${YELLOW}Documentation:\${NC}"
    echo -e "  \${BLUE}https://github.com/${pkg.githubRepo}\${NC}"
else
    echo -e "\${RED}✗ Installation failed\${NC}"
    exit 1
fi
`;
}

function getHTMLPage(path: string): string {
  const packageList = Object.entries(PACKAGES)
    .filter(([slug]) => slug !== "porto")
    .map(
      ([slug, pkg]) => `
    <li>
      <strong>${pkg.name}</strong> - ${pkg.description}<br>
      <code>curl -fsSL https://porto.vspatabuga.io/${slug} | sh</code>
    </li>`
    )
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>VS PATABUGA - VSP Porto</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      min-height: 100vh;
      color: #fff;
      line-height: 1.6;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      padding: 60px 20px;
    }
    .logo {
      text-align: center;
      margin-bottom: 40px;
    }
    .logo h1 {
      font-size: 36px;
      font-weight: 700;
      letter-spacing: 0.15em;
      margin-bottom: 10px;
      color: #00d4aa;
    }
    .logo .subtitle {
      color: rgba(255,255,255,0.6);
      font-size: 14px;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .logo p {
      color: rgba(255,255,255,0.8);
      font-size: 16px;
      margin-top: 16px;
    }
    .install-box {
      background: rgba(255,255,255,0.05);
      border-radius: 16px;
      padding: 30px;
      margin-bottom: 40px;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .install-box h2 {
      font-size: 20px;
      margin-bottom: 20px;
      color: #00d4aa;
    }
    .command {
      background: #0d1117;
      border-radius: 8px;
      padding: 16px 20px;
      font-family: 'SF Mono', Monaco, 'Cascadia Code', monospace;
      font-size: 14px;
      overflow-x: auto;
      border: 1px solid #30363d;
    }
    .packages {
      background: rgba(255,255,255,0.03);
      border-radius: 16px;
      padding: 30px;
      border: 1px solid rgba(255,255,255,0.1);
    }
    .packages h2 {
      font-size: 20px;
      margin-bottom: 20px;
      color: #fff;
    }
    .packages ul {
      list-style: none;
    }
    .packages li {
      padding: 20px;
      background: rgba(255,255,255,0.03);
      border-radius: 12px;
      margin-bottom: 12px;
      border: 1px solid rgba(255,255,255,0.05);
    }
    .packages li:last-child { margin-bottom: 0; }
    .packages code {
      display: block;
      margin-top: 10px;
      background: #0d1117;
      padding: 10px 14px;
      border-radius: 6px;
      font-size: 13px;
      color: #00d4aa;
      border: 1px solid #30363d;
    }
    .footer {
      text-align: center;
      margin-top: 40px;
      color: rgba(255,255,255,0.4);
      font-size: 14px;
    }
    .footer a {
      color: #00d4aa;
      text-decoration: none;
    }
    .badge {
      display: inline-block;
      background: #238636;
      color: #fff;
      padding: 4px 10px;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
      margin-left: 10px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="logo">
      <h1>VS PATABUGA</h1>
      <p class="subtitle">VSP Porto Management System</p>
      <p>Experience Sovereign Systems Locally</p>
    </div>

    <div class="install-box">
      <h2>Quick Install <span class="badge">Recommended</span></h2>
      <div class="command">curl -fsSL https://porto.vspatabuga.io/ | sh</div>
      <p style="margin-top: 16px; color: rgba(255,255,255,0.6); font-size: 14px;">
        Requires: Node.js 18+, npm, Docker
      </p>
    </div>

    <div class="packages">
      <h2>Available Simulations</h2>
      <ul>
        ${packageList}
      </ul>
    </div>

    <div class="footer">
      <p>
        <a href="https://github.com/vspatabuga/vsp-porto-management">Documentation</a> ·
        <a href="https://vspatabuga.io">Portfolio</a> ·
        <a href="https://github.com/vspatabuga">GitHub</a>
      </p>
    </div>
  </div>
</body>
</html>`;
}

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/^\//, "").split("/")[0] || "";
    const acceptHeader = request.headers.get("Accept") || "";
    const userAgent = request.headers.get("User-Agent") || "";

    const isCurl = userAgent.includes("curl") || userAgent.includes("libcurl");
    const wantsScript =
      acceptHeader.includes("text/plain") || acceptHeader.includes("text/x-sh");

    // Route mapping
    const slugMap: Record<string, string> = {
      "": "porto",
      porto: "porto",
      kalpataru: "kalpataru",
      "ai-gov": "ai-gov",
      ledger: "ledger",
      iac: "iac",
      "zero-trust": "zero-trust",
    };

    const slug = slugMap[pathname] || "porto";
    const pkg = PACKAGES[slug as keyof typeof PACKAGES];

    if (isCurl || wantsScript) {
      // Return bash script for curl requests
      const script =
        slug === "porto"
          ? getCLIInstallerScript()
          : getSimulationInstallerScript(pkg, slug);

      return new Response(script, {
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "no-store",
          "X-Package": pkg.npmPackage,
          "X-GitHub-Repo": pkg.githubRepo,
        },
      });
    }

    // Return HTML for browser requests
    return new Response(getHTMLPage(pathname), {
      headers: { "Content-Type": "text/html; charset=utf-8" },
    });
  },
};
