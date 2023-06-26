import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthForm from '@/app/auth/components/AuthForm';
import { rest } from 'msw'
import { setupServer } from 'msw/node'

const server = setupServer(
    rest.post('/api/signin', async (req, res, ctx) => {
        const { email, password } = await req.json()
        if (email === 'john@mail.com' && password === 'password') {
            return res(ctx.status(200))
        }
        return res(ctx.status(400))
    }),
)
beforeAll(() => {
    server.listen()
})
afterAll(() => {
    server.close()
})

jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            pathname: '/auth',
        };
    },
}));

jest.mock('next-auth/react', () => ({
    useSession() {
        return {
            session: {
                status: 'unauthenticated'
            },
        };
    },
    signIn() {
        return null;
    }
}));

describe('Authentication page', () => {
    beforeEach(() => {
        render(
            <AuthForm />
        );
    })

    it('should render propely', () => {
        const title = screen.getByRole('heading');
        expect(title).toHaveTextContent(/sign in/i);
        screen.getByText(/email/i);
        screen.getByText(/^password$/i);
        const buttons = screen.getAllByRole('button');
        expect(buttons.length).toEqual(2);
        expect(buttons[0]).toHaveTextContent(/continue/i);
    })

    it('changes state', () => {
        const title = screen.getByRole('heading');
        const change = screen.getByText(/^sign up$/i);
        fireEvent.click(change);
        expect(title).toHaveTextContent(/registration/i);
    })

    it('sign in', async () => {
        const emailInput = screen.getByTestId('loginEmail');
        const passwordInput = screen.getByTestId('loginPassword');
        const continueButton = screen.getAllByRole('button')[0];
        await waitFor(() => {
            fireEvent.change(emailInput, { target: { value: 'john@mail.com' } });
            fireEvent.change(passwordInput, { target: { value: 'password' } });
            fireEvent.click(continueButton);
        })
        if (process.env.NEXT_PUBLIC_EMAIL_VERIFICATION === 'verify') {
            await screen.findByText(/^code$/i);
        }

    })
})