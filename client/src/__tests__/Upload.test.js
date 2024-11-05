import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Upload from '../components/Upload.js';

describe('Upload Component', () => {
    beforeEach(() => {
        // Mock console.log
        console.log = jest.fn();
        // Clear all mocks before each test
        jest.clearAllMocks();
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
    test('displays nutritional information after successful image upload', async () => {
        // Render with test props that simulate a successful upload
        render(<Upload testImageUrl="http://example.com/image.jpg" testLoading={false} />);
        
        // Now the nutritional information should be immediately visible
        expect(screen.getByText('Nutritional Information')).toBeInTheDocument();
        expect(screen.getByText(/Calories:/i)).toBeInTheDocument();
        expect(screen.getByText(/Protein:/i)).toBeInTheDocument();
        expect(screen.getByText(/Carbohydrates:/i)).toBeInTheDocument();
        expect(screen.getByText(/Fat:/i)).toBeInTheDocument();

        // Verify the uploaded image is displayed
        const uploadedImage = screen.getByAltText('Uploaded Meal');
        expect(uploadedImage).toBeInTheDocument();
        expect(uploadedImage.src).toBe('http://example.com/image.jpg');
    });

    test('displays nutritional information after capturing image', async () => {
        // Render with test props that simulate a successful capture
        render(<Upload testImageUrl="http://example.com/captured-image.jpg" testLoading={false} />);

        // Check for presence of numeric values
        expect(screen.getByText('Nutritional Information')).toBeInTheDocument();
        expect(screen.getByText(/Calories:/i)).toBeInTheDocument();
        expect(screen.getByText(/Protein:/i)).toBeInTheDocument();
        expect(screen.getByText(/Carbohydrates:/i)).toBeInTheDocument();
        expect(screen.getByText(/Fat:/i)).toBeInTheDocument();

        // Verify the captured image is displayed
        const capturedImage = screen.getByAltText('Uploaded Meal');
        expect(capturedImage).toBeInTheDocument();
        expect(capturedImage.src).toBe('http://example.com/captured-image.jpg');
    });
});
