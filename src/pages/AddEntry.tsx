import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function AddEntry() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">Add Entry</h1>
        <p className="text-muted-foreground">Add new income or expense entry</p>
      </div>
    </div>
  );
}