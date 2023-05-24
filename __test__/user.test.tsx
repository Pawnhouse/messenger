import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserSidebar from '@/app/users/components/UserSidebar';

jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            pathname: '/users',
        };
    },
}));

describe('Authentication page', () => {
    it('should render propely', () => {
        const items = [
            { id: '1', name: 'John', image: null },
            { id: '2', name: 'Jake', image: 'http://example.com/picture.png' }
        ]
        render(
            <UserSidebar items={items} />
        );
        const label = screen.getByText('John');
        expect(label).toBeInTheDocument();
        const imgElement = screen.getAllByRole('img');
        expect(imgElement.length).toEqual(2);
    })
})