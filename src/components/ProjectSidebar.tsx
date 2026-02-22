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
  isOpen: boolean;
  onClose: () => void;
}

export function ProjectSidebar({ projects, selectedProject, onSelectProject, isOpen, onClose }: ProjectSidebarProps) {
  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />
      {/* Slide-out Panel */}
      <div className="fixed inset-y-0 right-0 w-80 z-50 transform transition-transform">
        <div className="h-full bg-gray-900 border-l border-gray-800 flex flex-col">
          {/* Header */}
          <div className="p-4 border-b border-gray-800 flex items-center justify-between">
            <h2 className="text-white font-bold text-lg flex items-center gap-2">
              📁 Projects
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Projects List */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* All Projects */}
            <button
              onClick={() => {
                onSelectProject(null);
                onClose();
              }}
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
                onClick={() => {
                  onSelectProject(project.id);
                  onClose();
                }}
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
      </div>
    </>
  );
}
