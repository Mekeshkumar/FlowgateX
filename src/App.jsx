import { Suspense } from 'react';
import AppRoutes from './routes';
import LoadingSpinner from './components/common/LoadingSpinner';
import { useAuth } from './hooks/useAuth';

function App() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <LoadingSpinner size="lg" />
        </div>
      }
    >
      <AppRoutes />
    </Suspense>
  );
}

export default App;
