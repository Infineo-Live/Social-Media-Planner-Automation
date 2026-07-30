import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import App from './App';

describe('Phase 6 UI Rendering', () => {
  it('renders application initial state without crashing', async () => {
    const { container } = render(<App />);
    expect(container).toBeDefined();
    const appElements = await screen.findAllByText(/Infineo/i, {}, { timeout: 3000 });
    expect(appElements.length).toBeGreaterThan(0);
  });
});
