import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Signup from '../components/Signup';

const WrappedSignup = () => {
    return (
        <BrowserRouter>
            <Signup />
        </BrowserRouter>
    );
};

describe('Signup Component', () => {
    test('handles form submission', async () => {
        render(<WrappedSignup />);
        
        await act(async () => {
            // Your test implementation
        });
    });
});
