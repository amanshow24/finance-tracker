import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function ViewEntries() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">View Entries</h1>
        <p className="text-muted-foreground">View, edit, and delete your entries</p>
      </div>
    </div>
  );
}