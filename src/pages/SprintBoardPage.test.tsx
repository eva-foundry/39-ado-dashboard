// EVA-STORY: F39-04-002
// EVA-STORY: F39-UI-002
// EVA-STORY: F39-01-003
/**
 * SprintBoardPage.test.tsx -- 39-ado-dashboard unit tests (WI-4 + WI-5)
 *
 * Covers: renders, H1, loading state, error state, no-data message,
 * feature sections render after API call, WI card present, jest-axe 0 violations.
 *
 * Mock strategy: vi.mock('../api/scrumApi') -- no real fetch runs.
 */
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { axe } from 'jest-axe';
import { SprintBoardPage } from './SprintBoardPage';
import type { ScrumDashboardResponse } from '../types/scrum';

// ---------------------------------------------------------------------------
// Module mock
// ---------------------------------------------------------------------------

vi.mock('../api/scrumApi', () => ({
  fetchSprintSummaries: vi.fn(),
  fetchScrumDashboard: vi.fn(),
}));

import { fetchScrumDashboard } from '../api/scrumApi';
const mockFetch = vi.mocked(fetchScrumDashboard);

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_DASHBOARD: ScrumDashboardResponse = {
  refreshed_at: '2026-02-25T10:00:00Z',
  epic: {
    id: 4,
    title: 'EVA Platform',
    features: [
      {
        id: 101,
        title: 'Backend API (brain-v2)',
        project: 'brain-v2',
        work_items: [
          {
            ado_id: 201,
            wi_tag: 'WI-0',
            title: 'Scrum dashboard endpoint',
            sprint: 'Sprint-6',
            state: 'Active',
            dod: 'GET /v1/scrum/dashboard returns shaped ADO data',
            test_count: 5,
            coverage_pct: 72,
            closed_at: null,
            entities_affected: ['ScrumContext', 'BrainRoute'],
          },
          {
            ado_id: 202,
            wi_tag: 'WI-1',
            title: 'APIM route registration',
            sprint: 'Sprint-6',
            state: 'New',
            dod: 'APIM routes live',
            test_count: null,
            coverage_pct: null,
            closed_at: null,
            entities_affected: [],
          },
        ],
      },
      {
        id: 102,
        title: 'Portal pages (faces)',
        project: 'faces',
        work_items: [
          {
            ado_id: 203,
            wi_tag: 'WI-2',
            title: 'EVAHomePage static tiles',
            sprint: 'Sprint-6',
            state: 'Resolved',
            dod: 'Renders 23 product tiles',
            test_count: 10,
            coverage_pct: 82,
            closed_at: '2026-02-23T18:00:00Z',
            entities_affected: ['EVAHomePage'],
          },
        ],
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function renderPageLoaded() {
  const result = render(<SprintBoardPage />);
  await waitFor(() => expect(mockFetch).toHaveBeenCalled());
  await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
  return result;
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('SprintBoardPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue(MOCK_DASHBOARD);
  });

  it('renders the main landmark without crashing', async () => {
    render(<SprintBoardPage />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('shows H1 "Sprint Board" after data loads', async () => {
    await renderPageLoaded();
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Sprint Board');
  });

  it('shows loading status while fetch is in-flight', () => {
    mockFetch.mockReturnValue(new Promise(() => {}));
    render(<SprintBoardPage />);
    expect(screen.getByRole('status')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent(/loading/i);
  });

  it('hides loading indicator after data resolves', async () => {
    await renderPageLoaded();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('shows error alert when fetch fails', async () => {
    mockFetch.mockRejectedValue(new Error('[scrumApi] GET /v1/scrum/dashboard failed: 503 Service Unavailable'));
    render(<SprintBoardPage />);
    await waitFor(() => screen.getByRole('alert'));
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('shows no-data message when features are empty', async () => {
    mockFetch.mockResolvedValue({
      refreshed_at: '2026-02-25T10:00:00Z',
      epic: { id: 4, title: 'EVA Platform', features: [] },
    });
    await renderPageLoaded();
    expect(screen.getByText(/no data for the selected filters/i)).toBeInTheDocument();
  });

  it('renders feature titles after data loads', async () => {
    await renderPageLoaded();
    expect(screen.getByText('Backend API (brain-v2)')).toBeInTheDocument();
    expect(screen.getByText('Portal pages (faces)')).toBeInTheDocument();
  });

  it('renders work item titles after data loads', async () => {
    await renderPageLoaded();
    expect(screen.getByText('Scrum dashboard endpoint')).toBeInTheDocument();
    expect(screen.getByText('EVAHomePage static tiles')).toBeInTheDocument();
  });

  it('calls fetchScrumDashboard with project=all sprint=all on mount', async () => {
    await renderPageLoaded();
    expect(mockFetch).toHaveBeenCalledWith({ project: 'all', sprint: 'all' });
  });

  it('passes jest-axe accessibility audit (0 violations)', async () => {
    let container: HTMLElement;
    await act(async () => {
      const result = render(<SprintBoardPage />);
      container = result.container;
    });
    await waitFor(() => expect(mockFetch).toHaveBeenCalled());
    await new Promise((r) => setTimeout(r, 50));
    const results = await axe(container!);
    expect(results).toHaveNoViolations();
  });
});
