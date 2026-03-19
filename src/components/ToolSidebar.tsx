import { useLocation } from 'react-router-dom';
import { NavLink } from '@/components/NavLink';
import { Heart } from 'lucide-react';
import { allTools, categories, getFavorites, toggleFavorite, addRecent } from '@/lib/tools-data';
import { useI18n } from '@/hooks/useI18n';
import { useState } from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const categoryGroups = [
  { id: 'pdftools' as const, labelKey: 'cat.pdftools' },
  { id: 'converters' as const, labelKey: 'cat.converters' },
  { id: 'aitools' as const, labelKey: 'cat.aitools' },
];

const ToolSidebar = () => {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';
  const { t } = useI18n();
  const location = useLocation();
  const [favorites, setFavorites] = useState<string[]>(getFavorites());

  const handleToggleFav = (path: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorites(toggleFavorite(path));
  };

  const favTools = allTools.filter(tool => favorites.includes(tool.path));

  return (
    <Sidebar collapsible="icon" className="border-r border-border/60">
      <SidebarContent className="pt-2">
        {/* Favorites section */}
        {favTools.length > 0 && (
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              {!collapsed && '★ Favorites'}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {favTools.map(tool => (
                  <SidebarMenuItem key={tool.path}>
                    <SidebarMenuButton asChild>
                      <NavLink
                        to={tool.path}
                        onClick={() => addRecent(tool.path)}
                        className="flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                        activeClassName="bg-primary/10 text-primary font-medium"
                      >
                        <tool.icon className="h-4 w-4 shrink-0" />
                        {!collapsed && <span className="truncate">{t(tool.titleKey)}</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}

        {/* Tool categories */}
        {categoryGroups.map(cat => {
          const tools = allTools.filter(t => t.category === cat.id);
          const hasActive = tools.some(t => location.pathname === t.path);

          return (
            <SidebarGroup key={cat.id}>
              <SidebarGroupLabel className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                {!collapsed && t(cat.labelKey)}
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {tools.map(tool => (
                    <SidebarMenuItem key={tool.path}>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={tool.path}
                          onClick={() => addRecent(tool.path)}
                          className="group/item flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                          activeClassName="bg-primary/10 text-primary font-medium"
                        >
                          <tool.icon className="h-4 w-4 shrink-0" />
                          {!collapsed && (
                            <>
                              <span className="truncate flex-1">{t(tool.titleKey)}</span>
                              <button
                                onClick={(e) => handleToggleFav(tool.path, e)}
                                className="opacity-0 group-hover/item:opacity-100 p-0.5 rounded transition-opacity"
                              >
                                <Heart className={`h-3 w-3 ${favorites.includes(tool.path) ? 'fill-tool-rose text-tool-rose' : 'text-muted-foreground'}`} />
                              </button>
                            </>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          );
        })}
      </SidebarContent>
    </Sidebar>
  );
};

export default ToolSidebar;
