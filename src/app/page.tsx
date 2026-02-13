import { KanbanBoard } from '@/components/KanbanBoard';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <KanbanBoard />
      </div>
    </main>
  );
}
