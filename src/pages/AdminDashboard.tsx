import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { LogOut, BarChart3, Users, FileText, Vote, TrendingUp, Calendar } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

type TimeRange = '24h' | '7d' | '30d' | 'all';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>('7d');

  // Data
  const [surveyData, setSurveyData] = useState<{ preference: string; count: number }[]>([]);
  const [toolUsage, setToolUsage] = useState<{ tool_name: string; count: number }[]>([]);
  const [dailyTraffic, setDailyTraffic] = useState<{ date: string; views: number }[]>([]);
  const [totalViews, setTotalViews] = useState(0);
  const [totalToolUses, setTotalToolUses] = useState(0);
  const [totalSurveyVotes, setTotalSurveyVotes] = useState(0);

  useEffect(() => {
    checkAdmin();
  }, []);

  useEffect(() => {
    if (isAdmin) fetchAllData();
  }, [isAdmin, timeRange]);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate('/admin-login'); return; }

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin');

    if (!roles || roles.length === 0) {
      toast.error('Access denied');
      navigate('/admin-login');
      return;
    }
    setIsAdmin(true);
    setLoading(false);
  };

  const getDateFilter = () => {
    const now = new Date();
    if (timeRange === '24h') return new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
    if (timeRange === '7d') return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
    if (timeRange === '30d') return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString();
    return '2020-01-01T00:00:00Z';
  };

  const fetchAllData = async () => {
    const since = getDateFilter();

    // Survey data
    const { data: surveyRows } = await supabase
      .from('contact_submissions')
      .select('message')
      .like('message', 'Monetization preference:%');

    if (surveyRows) {
      const counts: Record<string, number> = {};
      for (const r of surveyRows) {
        const pref = r.message.replace('Monetization preference: ', '');
        counts[pref] = (counts[pref] || 0) + 1;
      }
      const sorted = Object.entries(counts)
        .map(([preference, count]) => ({ preference, count }))
        .sort((a, b) => b.count - a.count);
      setSurveyData(sorted);
      setTotalSurveyVotes(sorted.reduce((s, r) => s + r.count, 0));
    }

    // Tool usage
    const { data: toolRows } = await supabase
      .from('tool_usage')
      .select('tool_name, created_at')
      .gte('created_at', since);

    if (toolRows) {
      const counts: Record<string, number> = {};
      for (const r of toolRows) {
        counts[r.tool_name] = (counts[r.tool_name] || 0) + 1;
      }
      const sorted = Object.entries(counts)
        .map(([tool_name, count]) => ({ tool_name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 15);
      setToolUsage(sorted);
      setTotalToolUses(toolRows.length);
    }

    // Page views & daily traffic
    const { data: viewRows } = await supabase
      .from('page_views')
      .select('created_at')
      .gte('created_at', since);

    if (viewRows) {
      setTotalViews(viewRows.length);
      const byDay: Record<string, number> = {};
      for (const r of viewRows) {
        const day = r.created_at.slice(0, 10);
        byDay[day] = (byDay[day] || 0) + 1;
      }
      const sorted = Object.entries(byDay)
        .map(([date, views]) => ({ date, views }))
        .sort((a, b) => a.date.localeCompare(b.date));
      setDailyTraffic(sorted);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin-login');
  };

  const labelMap: Record<string, string> = {
    'free-ads': '🆓 Free with ads',
    'freemium': '💎 Freemium',
    'one-time': '💰 One-time purchase',
    'no-ads-donate': '❤️ No ads, donations',
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <p className="text-muted-foreground">Loading…</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-3">
            <BarChart3 className="h-6 w-6 text-primary" />
            <h1 className="font-display text-xl font-bold text-foreground">Admin Dashboard</h1>
          </div>
          <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" /> Logout
          </Button>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-8 px-4 py-8">
        {/* Time Range Filter */}
        <div className="flex gap-2 flex-wrap">
          {(['24h', '7d', '30d', 'all'] as TimeRange[]).map(t => (
            <Button
              key={t}
              variant={timeRange === t ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(t)}
            >
              {t === '24h' ? 'Last 24h' : t === '7d' ? 'Last 7 days' : t === '30d' ? 'Last 30 days' : 'All time'}
            </Button>
          ))}
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <StatCard icon={<Users className="h-5 w-5 text-primary" />} label="Page Views" value={totalViews} />
          <StatCard icon={<FileText className="h-5 w-5 text-primary" />} label="Tool Uses" value={totalToolUses} />
          <StatCard icon={<Vote className="h-5 w-5 text-primary" />} label="Survey Votes" value={totalSurveyVotes} />
        </div>

        {/* Traffic Chart */}
        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="font-display text-lg font-bold text-foreground">Daily Traffic</h2>
          </div>
          {dailyTraffic.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={dailyTraffic}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip />
                <Line type="monotone" dataKey="views" stroke="hsl(var(--primary))" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-12">No traffic data yet</p>
          )}
        </div>

        {/* Tool Usage & Survey side by side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Tools */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-bold text-foreground">Most Used Tools</h2>
            </div>
            {toolUsage.length > 0 ? (
              <ResponsiveContainer width="100%" height={400}>
                <BarChart data={toolUsage} layout="vertical" margin={{ left: 80 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                  <YAxis dataKey="tool_name" type="category" tick={{ fontSize: 11 }} width={100} stroke="hsl(var(--muted-foreground))" />
                  <Tooltip />
                  <Bar dataKey="count" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-12">No tool usage data yet</p>
            )}
          </div>

          {/* Survey Results */}
          <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Vote className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-bold text-foreground">Survey Results</h2>
            </div>
            {surveyData.length > 0 ? (
              <div className="space-y-3">
                {surveyData.map((item) => {
                  const pct = totalSurveyVotes > 0 ? ((item.count / totalSurveyVotes) * 100).toFixed(1) : '0';
                  return (
                    <div key={item.preference} className="space-y-1">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium text-foreground">{labelMap[item.preference] || item.preference}</span>
                        <span className="text-muted-foreground">{item.count} votes ({pct}%)</span>
                      </div>
                      <div className="h-3 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-12">No survey votes yet</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) => (
  <div className="rounded-2xl border border-border bg-card p-5 flex items-center gap-4">
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">{icon}</div>
    <div>
      <p className="text-2xl font-bold text-foreground">{value.toLocaleString()}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
    </div>
  </div>
);

export default AdminDashboard;
