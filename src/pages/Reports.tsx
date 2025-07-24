import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function Reports() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-6">Reports</h1>
        <p className="text-muted-foreground">View financial reports and analytics</p>
      </div>
    </div>
  );
}