'use client';

interface Project {
  id: string;
  name: string;
  icon: string;
  count: number;
}

interface ProjectSidebarProps {
  projects: Project[];
  selectedProject: string | null;
  onSelectProject: (projectId: string | null) => void;
}

export function ProjectSidebar({ projects, selectedProject, onSelectProject }: ProjectSidebarProps) {
  return (
    <div className="w-64 bg-gray-900 border-r border-gray-800 flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-gray-800">
        <h2 className="text-white font-bold text-lg flex items-center gap-2">
          📁 Projects
        </h2>
      </div>

      {/* Projects List */}
      <div className="flex-1 overflow-y-auto p-4">
        {/* All Projects */}
        <button
          onClick={() => onSelectProject(null)}
          className={`w-full flex items-center justify-between px-4 py-3 rounded-lg mb-2 transition-all ${
            selectedProject === null
              ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-white'
              : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
          }`}
        >
          <span className="flex items-center gap-3">
            <span className="text-xl">📊</span>
            <span className="font-medium">All Projects</span>
          </span>
          <span className="text-sm bg-gray-700 px-2 py-1 rounded-full">
            {projects.reduce((sum, p) => sum + p.count, 0)}
          </span>
        </button>

        <div className="h-px bg-gray-800 my-4" />

        {/* Individual Projects */}
        {projects.map(project => (
          <button
            key={project.id}
            onClick={() => onSelectProject(project.id)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-lg mb-2 transition-all ${
              selectedProject === project.id
                ? 'bg-gradient-to-r from-purple-600/20 to-blue-600/20 border border-purple-500/30 text-white'
                : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/50'
            }`}
          >
            <span className="flex items-center gap-3">
              <span className="text-xl">{project.icon}</span>
              <span className="font-medium text-sm">{project.name}</span>
            </span>
            {project.count > 0 && (
              <span className="text-xs bg-gray-700 px-2 py-1 rounded-full">
                {project.count}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-500 text-center">
          🎬 Powered by Pacino
        </div>
      </div>
    </div>
  );
}
