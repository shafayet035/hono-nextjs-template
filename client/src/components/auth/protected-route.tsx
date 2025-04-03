'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2 } from 'lucide-react';
import { useAuthStore } from '@/store/auth.store';
import { toast } from 'sonner';

interface ProtectedRouteProps {
    children: React.ReactNode;
    adminOnly?: boolean;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated } = useAuthStore();

    const router = useRouter();

    useEffect(() => {
        if (!isAuthenticated) {
            toast('Please login to access this page');
            router.push('/login');
        }
    }, [isAuthenticated]);

    if (!isAuthenticated) {
        return (
            <div className='flex items-center justify-center min-h-screen'>
                <Loader2 className='h-8 w-8 animate-spin text-primary' />
                <span className='ml-2 text-xl font-medium'>Protected Route Only for Authenticated Users</span>
            </div>
        );
    }

    return isAuthenticated ? <>{children}</> : null;
}
