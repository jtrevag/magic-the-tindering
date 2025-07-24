import React from 'react';
import { render, screen } from '@testing-library/react';
import Timer from './Timer';

describe('Timer', () => {
  test('renders timer with seconds value', () => {
    render(<Timer seconds={15} />);
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('seconds')).toBeInTheDocument();
  });

  test('formats single digit seconds with leading zero', () => {
    render(<Timer seconds={5} />);
    expect(screen.getByText('05')).toBeInTheDocument();
  });

  test('formats double digit seconds without leading zero', () => {
    render(<Timer seconds={15} />);
    expect(screen.getByText('15')).toBeInTheDocument();
  });

  test('applies normal timer class for higher values', () => {
    render(<Timer seconds={15} />);
    const timerElement = screen.getByText('15').parentElement;
    expect(timerElement).toHaveClass('timer', 'timer-normal');
  });

  test('applies warning timer class for mid-range values', () => {
    render(<Timer seconds={7} />);
    const timerElement = screen.getByText('07').parentElement;
    expect(timerElement).toHaveClass('timer', 'timer-warning');
  });

  test('applies warning timer class for values between 4-7', () => {
    render(<Timer seconds={5} />);
    const timerElement = screen.getByText('05').parentElement;
    expect(timerElement).toHaveClass('timer', 'timer-warning');
  });

  test('applies critical timer class for low values', () => {
    render(<Timer seconds={3} />);
    const timerElement = screen.getByText('03').parentElement;
    expect(timerElement).toHaveClass('timer', 'timer-critical');
  });

  test('applies critical timer class for values 1-3', () => {
    render(<Timer seconds={1} />);
    const timerElement = screen.getByText('01').parentElement;
    expect(timerElement).toHaveClass('timer', 'timer-critical');
  });

  test('handles zero seconds', () => {
    render(<Timer seconds={0} />);
    expect(screen.getByText('00')).toBeInTheDocument();
    const timerElement = screen.getByText('00').parentElement;
    expect(timerElement).toHaveClass('timer', 'timer-critical');
  });
});