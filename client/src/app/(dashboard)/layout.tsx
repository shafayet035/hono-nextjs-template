'use client';

import ProtectedRoute from '@/components/auth/protected-route';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const { logout, isLoading } = useAuthStore();
    return (
        <ProtectedRoute>
            <header className='flex items-center justify-center py-4 px-4 sm:px-6 lg:px-8'>
                <nav>
                    <Button disabled={isLoading} onClick={logout}>
                        Logout
                    </Button>
                </nav>
            </header>
            <main className='flex-col flex-grow flex items-center justify-center p-4'>{children}</main>
        </ProtectedRoute>
    );
}
