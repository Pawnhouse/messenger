import EmptyState from '../components/EmptyState';

export default function AppLayout({ children }: { children: React.ReactNode }) {
    return (
        <div>
            {children}
        </div>
    )
}
