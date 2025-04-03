'use client';

import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/auth.store';

export default function Home() {
    const { login } = useAuthStore();

    return (
        <div>
            Hello World
            <Button
                onClick={() =>
                    login({
                        email: 'Helowd@Dwad.com',
                        password: 'wdaw',
                    })
                }
            >
                Login{' '}
            </Button>
        </div>
    );
}
