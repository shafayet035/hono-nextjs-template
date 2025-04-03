export default function AuthLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col justify-center'>
            <div className='absolute top-0 left-0 w-full p-4'>
                <div className='max-w-7xl mx-auto flex justify-between items-center'>
                    <div className='text-2xl font-bold text-gray-800 dark:text-white'>SF-Form</div>
                </div>
            </div>

            <main className='flex-grow flex items-center justify-center p-4'>{children}</main>

            <footer className='py-4 text-center text-sm text-gray-500 dark:text-gray-400'>
                &copy; {new Date().getFullYear()} SF-Form. All rights reserved.
            </footer>
        </div>
    );
}
