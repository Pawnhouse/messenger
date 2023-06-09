import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import UserSidebar from '@/app/users/components/UserSidebar';
import { Contact, User } from '@prisma/client';

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
            { id: '1', username: 'john', name: 'John', image: null } as User,
            { id: '2', username: 'jake', name: 'Jake', image: 'http://example.com/picture.png' } as User,
        ]
        const currentUser = { contacts: [{ id: '1', inContactId: '1' }, { id: '2', inContactId: '2' }] } as User & {
            contacts: Contact[];
        } ;
        render(
            <UserSidebar items={items} currentUser={currentUser} />
        );
        const label = screen.getByText('John');
        expect(label).toBeInTheDocument();
        const imgElement = screen.getAllByRole('img');
        expect(imgElement.length).toEqual(2);
    })
})