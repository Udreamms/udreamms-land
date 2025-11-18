
import {
  Activity,
  AlertTriangle,
  Briefcase,
  Shield,
  HardDrive,
  Globe,
  Bot,
  Folder,
  Code,
  Server,
  Key,
  FileText,
  LayoutTemplate,
  Network,
  Database,
  Users,
  Wrench,
  GitBranch,
  AreaChart,
  Book,
  CheckSquare,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

export function CtoContent() {
  return (
    <main className="flex-1 p-8 bg-neutral-900 text-white">
      <h1 className="text-4xl font-bold mb-2">CTO Dashboard</h1>
      <p className="text-neutral-400 mb-10">
        📌 Main hub for technology management. All critical information is centralized here.
      </p>

      {/* Quick Stats */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">🔷 1. Quick Stats</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="bg-neutral-800 border-neutral-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
              <Wrench className="h-4 w-4 text-neutral-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
            </CardContent>
          </Card>
          <Card className="bg-neutral-800 border-neutral-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Ongoing Projects</CardTitle>
              <Briefcase className="h-4 w-4 text-neutral-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">5</div>
            </CardContent>
          </Card>
          <Card className="bg-neutral-800 border-neutral-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Security Alerts</CardTitle>
              <Shield className="h-4 w-4 text-neutral-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-500">3</div>
            </CardContent>
          </Card>
          <Card className="bg-neutral-800 border-neutral-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
              <HardDrive className="h-4 w-4 text-neutral-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">2h ago</div>
            </CardContent>
          </Card>
          <Card className="bg-neutral-800 border-neutral-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Operational Websites</CardTitle>
              <Globe className="h-4 w-4 text-neutral-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
            </CardContent>
          </Card>
          <Card className="bg-neutral-800 border-neutral-700">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Automations</CardTitle>
              <Bot className="h-4 w-4 text-neutral-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15</div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Shortcuts */}
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">🔷 2. Shortcuts to Each Area</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center"><Folder className="mr-2" /> Area Administration</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-400 text-sm">Agenda, processes, documentation, reports.</p>
            </CardContent>
          </Card>
          <Card className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center"><Code className="mr-2" /> Web Dev & Design</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-400 text-sm">Designs, Generative AI, active websites.</p>
            </CardContent>
          </Card>
          <Card className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center"><Server className="mr-2" /> Infrastructure & Support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-400 text-sm">Servers, networks, inventory, internal tickets.</p>
            </CardContent>
          </Card>
          <Card className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center"><Shield className="mr-2" /> Security & Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-400 text-sm">Policies, access, backups, databases.</p>
            </CardContent>
          </Card>
          <Card className="bg-neutral-800 border-neutral-700 hover:bg-neutral-700 transition-colors">
            <CardHeader>
              <CardTitle className="flex items-center"><Bot className="mr-2" /> Innovation & Automation</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-neutral-400 text-sm">AI, scripts, technical improvements, prototypes.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Active Projects */}
          <section className="mb-10">
            <h2 className="text-2xl font-semibold mb-4">🔷 3. Active Projects (Quick View)</h2>
            <div className="overflow-x-auto">
                <table className="w-full text-left table-auto">
                    <thead>
                    <tr className="bg-neutral-800 border-b border-neutral-700">
                        <th className="p-4">Project</th>
                        <th className="p-4">Status</th>
                        <th className="p-4">Priority</th>
                        <th className="p-4">Owner</th>
                        <th className="p-4">Deadline</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-700">
                    <tr>
                        <td className="p-4">New E-commerce Platform</td>
                        <td className="p-4"><Badge className="bg-blue-500">In Progress</Badge></td>
                        <td className="p-4"><Badge className="bg-red-500">High</Badge></td>
                        <td className="p-4">You</td>
                        <td className="p-4">2024-12-31</td>
                    </tr>
                    <tr>
                        <td className="p-4">Internal CRM Migration</td>
                        <td className="p-4"><Badge className="bg-yellow-500">On Hold</Badge></td>
                        <td className="p-4"><Badge className="bg-yellow-500">Medium</Badge></td>
                        <td className="p-4">You</td>
                        <td className="p-4">2025-03-15</td>
                    </tr>
                    <tr>
                        <td className="p-4">Marketing Site SEO Overhaul</td>
                        <td className="p-4"><Badge className="bg-green-500">Completed</Badge></td>
                        <td className="p-4"><Badge className="bg-green-500">Low</Badge></td>
                        <td className="p-4">You</td>
                        <td className="p-4">2024-05-20</td>
                    </tr>
                    </tbody>
                </table>
            </div>
          </section>

          {/* Alerts & Risks */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">🔷 5. Alerts & Risks</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-red-900/50 border-red-700">
                    <CardHeader className="flex flex-row items-center space-x-2 pb-2">
                        <AlertTriangle className="h-5 w-5 text-red-400"/>
                        <CardTitle>Server Overload</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-red-300">API-02 server is reaching 95% CPU usage.</p>
                    </CardContent>
                </Card>
                <Card className="bg-yellow-900/50 border-yellow-700">
                    <CardHeader className="flex flex-row items-center space-x-2 pb-2">
                        <AlertTriangle className="h-5 w-5 text-yellow-400"/>
                        <CardTitle>Critical Errors</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-yellow-300">Payment gateway showing intermittent timeouts.</p>
                    </CardContent>
                </Card>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Weekly Priority Tasks */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">🔷 4. Weekly Priority Tasks</h2>
            <div className="bg-neutral-800 p-4 rounded-lg space-y-3">
              <div className="flex items-center"><CheckSquare className="h-5 w-5 mr-3 text-blue-400"/> Security: Review admin access logs</div>
              <div className="flex items-center"><CheckSquare className="h-5 w-5 mr-3 text-blue-400"/> Infrastructure: Verify server uptime</div>
              <div className="flex items-center"><CheckSquare className="h-5 w-5 mr-3"/> Development: Push staging updates for e-commerce</div>
              <div className="flex items-center"><CheckSquare className="h-5 w-5 mr-3"/> Support: Resolve high-priority tickets</div>
              <div className="flex items-center"><CheckSquare className="h-5 w-5 mr-3"/> Innovation: Test new generative AI tool</div>
            </div>
          </section>

          {/* Tools & Resources */}
          <section>
            <h2 className="text-2xl font-semibold mb-4">🔷 6. Tools & Resources</h2>
            <div className="bg-neutral-800 p-4 rounded-lg space-y-3 divide-y divide-neutral-700">
                <a href="#" className="flex items-center pt-2 hover:text-blue-400"><Bot className="h-4 w-4 mr-3"/> Generative AI for Pages</a>
                <a href="#" className="flex items-center pt-2 hover:text-blue-400"><Server className="h-4 w-4 mr-3"/> Hosting Panel</a>
                <a href="#" className="flex items-center pt-2 hover:text-blue-400"><GitBranch className="h-4 w-4 mr-3"/> GitHub Repositories</a>
                <a href="#" className="flex items-center pt-2 hover:text-blue-400"><AreaChart className="h-4 w-4 mr-3"/> Monitoring Dashboard</a>
                <a href="#" className="flex items-center pt-2 hover:text-blue-400"><HardDrive className="h-4 w-4 mr-3"/> Backup System</a>
                <a href="#" className="flex items-center pt-2 hover:text-blue-400"><Book className="h-4 w-4 mr-3"/> Internal Documentation</a>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
