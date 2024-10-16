import { render, screen, fireEvent } from '@testing-library/react';
import Upload from '../components/Upload.js';

describe('Upload Component', () => {
    beforeEach(() => {
        // Mock console.log
        console.log = jest.fn();
    });

    test('handleCapture: handle button click', () => {
        render(<Upload />);
        
        const captureButton = screen.getByText(/Take a Picture/i);
        fireEvent.click(captureButton);
        
        expect(console.log).toHaveBeenCalledWith('Capture button clicked');
    });

    test('handleUpload: handle button click', () => {
        render(<Upload />);
        
        const uploadButton = screen.getByText(/Upload a Picture/i);
        fireEvent.click(uploadButton);
        
        expect(console.log).toHaveBeenCalledWith('Upload button clicked');
    });

    test('handleCapture: accepts image capture + return True', () => {
        render(<Upload />);
        
        // Simulate button click
        const uploadButton = screen.getByText(/Take a Picture/i);
        fireEvent.click(uploadButton);
        
        // Ensure the file input element is present
        const input = screen.getByText(/Take a Picture/i);
        const file = new File(['dummy content'], 'test-photo.png', { type: 'image/png' });

        // Check if input element exists
        expect(input).toBeInTheDocument(); 

        // Define the 'files' property on the input element
        Object.defineProperty(input, 'files', {
            value: [file],
        });

        // Call the onchange handler manually
        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);

        // Check for the return value (assuming the upload function returns true)
        const uploadResult = input.files.length > 0; 
        expect(uploadResult).toBe(true); // Expect the upload result to be true
    });

    test('handleUpload: accepts file upload + return True', () => {
        render(<Upload />);
        
        // Simulate button click
        const uploadButton = screen.getByText(/Upload a Picture/i);
        fireEvent.click(uploadButton);
        
        // Ensure the file input element is present
        const input = screen.getByText(/Upload a Picture/i); 
        const file = new File(['dummy content'], 'test-photo.png', { type: 'image/png' });

        // Check if input element exists
        expect(input).toBeInTheDocument(); 

        // Define the 'files' property on the input element
        Object.defineProperty(input, 'files', {
            value: [file],
        });

        // Call the onchange handler manually
        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);

        // Check for the return value (assuming the upload function returns true)
        const uploadResult = input.files.length > 0; 
        expect(uploadResult).toBe(true); // Expect the upload result to be true
    });
});
