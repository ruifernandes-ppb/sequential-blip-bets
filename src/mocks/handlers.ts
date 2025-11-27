import { http, HttpResponse } from 'msw';
import { getMatchPlayers } from '../fixtures/players';

export const handlers = [
  // Get all matches
  http.get('/api/matches', () => {
    return HttpResponse.json({
      success: true,
      data: {
        live: [],
        upcoming: [
          {
            id: 'chelsea-arsenal-2025',
            date: '2025-11-30T16:30:00Z',
            homeTeam: 'Chelsea',
            awayTeam: 'Arsenal',
            tournament: 'Premier League',
            status: 'scheduled',
          },
          {
            id: 'manchester-city-leeds-2025',
            date: '2025-12-01T15:00:00Z',
            homeTeam: 'Manchester City',
            awayTeam: 'Leeds United',
            tournament: 'Premier League',
            status: 'scheduled',
          },
        ],
      },
    });
  }),

  // Get players for a specific match
  http.get('/api/players/:matchId', ({ params }) => {
    const { matchId } = params;

    // Get actual players for the match
    const { team1Players, team2Players } = getMatchPlayers(String(matchId));

    return HttpResponse.json({
      success: true,
      matchId,
      data: {
        homeTeam: {
          name: team1Players[0]?.team || 'Home Team',
          players: team1Players,
        },
        awayTeam: {
          name: team2Players[0]?.team || 'Away Team',
          players: team2Players,
        },
      },
    });
  }),

  // Get match events (for live updates)
  http.get('/api/matches/:matchId/events', ({ params }) => {
    const { matchId } = params;

    return HttpResponse.json({
      success: true,
      matchId,
      data: {
        events: [],
        score: { home: 0, away: 0 },
        status: 'in_progress',
      },
    });
  }),

  // Place a bet
  http.post('/api/bets', async ({ request }) => {
    const body = (await request.json()) as Record<string, unknown>;

    return HttpResponse.json({
      success: true,
      data: {
        betId: `bet_${Date.now()}`,
        status: 'pending',
        ...body,
      },
    });
  }),

  // Get user bets
  http.get('/api/bets', () => {
    return HttpResponse.json({
      success: true,
      data: {
        bets: [],
      },
    });
  }),
];
