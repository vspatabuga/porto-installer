const INSTALL_SCRIPT = `#!/usr/bin/env bash

set -e

BLUE='\\033[0;34m'
GREEN='\\033[0;32m'
YELLOW='\\033[1;33m'
RED='\\033[0;31m'
NC='\\033[0m'

echo -e "\${BLUE}"
cat << "BANNER"
   ██████╗ ██████╗  █████╗ ███╗   ██╗██████╗  ██████╗ ███╗  
   ██╔══██╗██╔══██╗██╔══██╗████╗  ██║██╔══██╗██╔═══██╗████╗ 
   ██████╔╝██████╔╝███████║██╔██╗ ██║██║  ██║██║   ██║██╔██╗
   ██╔══██╗██╔══██╗██╔══██║██║╚██╗██║██║  ██║██║   ██║██║╚█║
   ██████╔╝██║  ██║██║  ██║██║ ╚████║██████╔╝╚██████╔╝██║ ╚█║
   ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═════╝  ╚═════╝ ╚═╝ ╚╝
                                                              
   Porto - Portfolio Simulation Manager
BANNER
echo -e "\${NC}"

echo -e "\${YELLOW}>> Checking prerequisites...\${NC}"

# Check Node.js
if ! command -v node &> /dev/null; then
    echo -e "\${RED}✗ Node.js not found.\${NC}"
    echo "  Install: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    echo -e "\${RED}✗ Node.js 18+ required.\${NC}"
    exit 1
fi
echo -e "\${GREEN}✓\${NC} Node.js $(node -v)"

# Check Docker
if ! command -v docker &> /dev/null; then
    echo -e "\${RED}✗ Docker not found\${NC}"
    echo "  Install: https://docs.docker.com/get-docker/"
    exit 1
fi
echo -e "\${GREEN}✓\${NC} Docker"

echo -e "\${YELLOW}>> Installing @vspatabuga/porto...\${NC}"

npm install -g @vspatabuga/porto --registry https://npm.pkg.github.com

if [ $? -eq 0 ]; then
    echo -e "\n\${GREEN}✓ Installation successful!\${NC}"
    echo ""
    echo -e "Next steps:"
    echo -e "  \${BLUE}vsp-porto list\${NC}              # See available simulations"
    echo -e "  \${BLUE}vsp-porto install ai-gov\${NC}    # Install AI Governance"
    echo -e "  \${BLUE}vsp-porto start ai-gov\${NC}      # Start simulation"
    echo ""
    echo -e "Documentation: \${BLUE}https://docs.vspatabuga.io/porto\${NC}"
else
    echo -e "\${RED}✗ Installation failed\${NC}"
    exit 1
fi
`;

export default {
  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const acceptHeader = request.headers.get("Accept") || "";
    const userAgent = request.headers.get("User-Agent") || "";
    
    const isCurl = userAgent.includes("curl") || userAgent.includes("libcurl");
    const wantsScript = acceptHeader.includes("text/plain") || acceptHeader.includes("text/x-sh");
    
    if (isCurl || wantsScript) {
      return new Response(INSTALL_SCRIPT, {
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "no-store",
        },
      });
    }

    return new Response(`<!DOCTYPE html>
<html>
<head>
  <title>VSP Porto - Portfolio Simulation Manager</title>
  <style>
    body { font-family: system-ui; max-width: 800px; margin: 50px auto; padding: 20px; }
    pre { background: #f4f4f4; padding: 20px; border-radius: 8px; overflow-x: auto; }
    .success { color: #00B894; }
  </style>
</head>
<body>
  <h1>🛠️ VSP Porto Installer</h1>
  <p>Experience Sovereign Systems Locally</p>
  
  <h2>Quick Install</h2>
  <pre>curl -fsSL https://porto.vspatabuga.io/ | sh</pre>
  
  <h2>Available Packages</h2>
  <ul>
    <li><strong>ai-gov</strong> - AI Governance Stack</li>
    <li><strong>kalpataru</strong> - Waste Management</li>
    <li><strong>ledger</strong> - Blockchain Voting</li>
    <li><strong>iac</strong> - Multi-Cloud IaC</li>
    <li><strong>zero-trust</strong> - Zero-Trust Network</li>
  </ul>
  
  <h2>Documentation</h2>
  <p><a href="https://github.com/vspatabuga/vsp-porto-management">GitHub Repository</a></p>
</body>
</html>`, {
      headers: { "Content-Type": "text/html" },
    });
  },
};
