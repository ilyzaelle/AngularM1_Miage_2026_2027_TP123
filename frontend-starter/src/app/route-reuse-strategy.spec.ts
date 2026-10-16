import { ActivatedRouteSnapshot } from '@angular/router';
import { describe, expect, it } from 'vitest';

import { CustomRouteReuseStrategy } from './shared/services/route-reuse-strategy';

describe('CustomRouteReuseStrategy', () => {
  it('should keep the tracks route alive while the session is active', () => {
    const auth = { token: () => 'token-123' } as any;
    const strategy = new CustomRouteReuseStrategy(auth);
    const route = {
      routeConfig: {
        path: 'tracks',
        data: { keepAlive: true },
      },
      pathFromRoot: [{ url: [{ path: 'tracks' }] }],
    } as unknown as ActivatedRouteSnapshot;

    expect(strategy.shouldDetach(route)).toBe(true);
    strategy.store(route, { test: 'handle' } as any);
    expect(strategy.shouldAttach(route)).toBe(true);
    expect(strategy.retrieve(route)).toEqual({ test: 'handle' });
  });

  it('should not reuse the route when the session is cleared', () => {
    const auth = { token: () => null } as any;
    const strategy = new CustomRouteReuseStrategy(auth);
    const route = {
      routeConfig: {
        path: 'tracks',
        data: { keepAlive: true },
      },
      pathFromRoot: [{ url: [{ path: 'tracks' }] }],
    } as unknown as ActivatedRouteSnapshot;

    expect(strategy.shouldDetach(route)).toBe(false);
    expect(strategy.shouldAttach(route)).toBe(false);
  });
});
