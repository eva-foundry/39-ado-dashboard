// EVA-STORY: F39-04-001
// EVA-STORY: F39-UI-001
// EVA-STORY: F39-01-002
/**
 * EVAHomePage.test.tsx -- 39-ado-dashboard unit tests (WI-2)
 *
 * Covers: renders, H1, 5 categories, loading state, error state, skip link,
 * GC signature, 23 product tiles, sprint summary bar, jest-axe 0 violations.
 *
 * Mock strategy: vi.mock('../api/scrumApi') -- no real fetch runs.
 * No router or auth context needed (NavHeader uses inline props, not useLocation).
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { axe } from 'jest-axe';
import { EVAHomePage } from './EVAHomePage';
import type { SprintSummary } from '../types/scrum';

// ---------------------------------------------------------------------------
// Module mock — hoisted before any import that uses the module
// ---------------------------------------------------------------------------

vi.mock('../api/scrumApi', () => ({
  fetchSprintSummaries: vi.fn(),
  fetchScrumDashboard: vi.fn(),
}));

import { fetchSprintSummaries } from '../api/scrumApi';
const mockFetch = vi.mocked(fetchSprintSummaries);

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_SUMMARIES: SprintSummary[] = [
  { project: 'brain-v2',       sprint: 'Sprint-6', badge: 'Active', active_count: 2 },
  { project: 'ado-dashboard',  sprint: 'Sprint-6', badge: 'Active', active_count: 3 },
  { project: 'faces',          sprint: 'Sprint-6', badge: 'Done',   active_count: 0 },
  { project: 'foundry',        sprint: 'Sprint-5', badge: 'Done',   active_count: 0 },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function renderPageLoaded() {
  const result = render(<EVAHomePage />);
  await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
  return result;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('EVAHomePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue(MOCK_SUMMARIES);
  });

  it('renders the main landmark without crashing', async () => {
    render(<EVAHomePage />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('shows H1 "EVA Portal" heading', async () => {
    await renderPageLoaded();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('EVA Portal');
  });

  it('renders all 5 product category headings (h2)', async () => {
    await renderPageLoaded();
    const h2s = screen.getAllByRole('heading', { level: 2 });
    const categories = h2s.map((h) => h.textContent ?? '');
    expect(categories).toContain('User Products');
    expect(categories).toContain('AI Intelligence');
    expect(categories).toContain('Platform');
    expect(categories).toContain('Developer');
    expect(categories).toContain('Moonshot');
  });

  it('renders 23 product tiles as buttons', async () => {
    await renderPageLoaded();
    // Each product tile renders with role="button"; nav header adds 1 button (lang toggle)
    const allButtons = screen.getAllByRole('button');
    const tileBtns = allButtons.filter((b) =>
      (b.getAttribute('aria-label') ?? '').includes('EVA')
    );
    expect(tileBtns.length).toBe(23);
  });

  it('shows loading status while fetch is in-flight', () => {
    // Keep promise pending
    mockFetch.mockReturnValue(new Promise(() => {}));
    render(<EVAHomePage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/loading/i);
  });

  it('shows error alert when fetch fails and no loading indicator', async () => {
    mockFetch.mockRejectedValue(new Error('network error'));
    render(<EVAHomePage />);
    await waitFor(() => screen.getByRole('alert'));
    expect(screen.getByRole('alert')).toHaveTextContent(/temporarily unavailable/i);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('renders skip link pointing to #main-content', async () => {
    render(<EVAHomePage />);
    const skip = screen.getByText(/skip to main content/i);
    expect(skip).toHaveAttribute('href', '#main-content');
  });

  it('renders GC signature "Government of Canada"', async () => {
    render(<EVAHomePage />);
    expect(screen.getByText('Government of Canada')).toBeInTheDocument();
  });

  it('renders recent sprint summary bar after data loads', async () => {
    await renderPageLoaded();
    // RecentSprintSummaryBar renders as aside when entries > 0
    expect(screen.getByRole('complementary')).toBeInTheDocument();
  });

  it('passes jest-axe accessibility audit (0 violations)', async () => {
    let container: HTMLElement;
    await act(async () => {
      const result = render(<EVAHomePage />);
      container = result.container;
    });
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    // Allow async state to settle
    await new Promise((r) => setTimeout(r, 50));
    const results = await axe(container!);
    expect(results).toHaveNoViolations();
  });
});
