import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Upload from '../components/Upload';

// Create a wrapper component that provides Router context
const WrappedUpload = () => {
    return (
        <BrowserRouter>
            <Upload />
        </BrowserRouter>
    );
};

describe('Upload Component', () => {
    test('handleCapture: handle button click', () => {
        render(<WrappedUpload />);
        
        const captureButton = screen.getByText(/Take a Picture/i);
        fireEvent.click(captureButton);
        // Add your assertions here
    });

    test('handleFileSelect: handle file selection', () => {
        render(<WrappedUpload />);
        
        // Your test implementation
    });

    // Add more tests as needed
});
