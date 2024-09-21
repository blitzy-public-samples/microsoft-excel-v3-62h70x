import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import { Button } from 'src/frontend/components/common/Button';

describe('Button component', () => {
  it('renders button with correct text', () => {
    const { getByText } = render(<Button>Click me</Button>);
    const buttonElement = getByText('Click me');
    expect(buttonElement).toBeInTheDocument();
  });

  it('calls onClick handler when clicked', () => {
    const mockOnClick = jest.fn();
    const { getByRole } = render(<Button onClick={mockOnClick}>Click me</Button>);
    const buttonElement = getByRole('button');
    fireEvent.click(buttonElement);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('applies correct CSS classes based on props', () => {
    const { getByRole } = render(
      <>
        <Button variant="primary" size="small">Primary Small</Button>
        <Button variant="secondary" size="large" fullWidth>Secondary Large Full</Button>
      </>
    );
    const primaryButton = getByRole('button', { name: 'Primary Small' });
    const secondaryButton = getByRole('button', { name: 'Secondary Large Full' });

    expect(primaryButton).toHaveClass('btn-primary', 'btn-small');
    expect(secondaryButton).toHaveClass('btn-secondary', 'btn-large', 'btn-full-width');
  });

  it('renders disabled button correctly', () => {
    const { getByRole } = render(<Button disabled>Disabled Button</Button>);
    const buttonElement = getByRole('button');
    expect(buttonElement).toBeDisabled();
    expect(buttonElement).toHaveClass('btn-disabled');
  });

  it('renders button with start and end icons', () => {
    const StartIcon = () => <span data-testid="start-icon">Start</span>;
    const EndIcon = () => <span data-testid="end-icon">End</span>;
    const { getByTestId } = render(
      <Button startIcon={<StartIcon />} endIcon={<EndIcon />}>
        Icon Button
      </Button>
    );
    expect(getByTestId('start-icon')).toBeInTheDocument();
    expect(getByTestId('end-icon')).toBeInTheDocument();
  });
});