import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  DetachedRouteHandle,
  RouteReuseStrategy,
} from '@angular/router';
import { AuthService } from './auth.service';

@Injectable()
export class CustomRouteReuseStrategy implements RouteReuseStrategy {
  private readonly cache = new Map<string, DetachedRouteHandle>();

  constructor(private readonly auth: AuthService) {}

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    if (!this.shouldKeep(route)) {
      this.cache.clear();
      return false;
    }

    return true;
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle | null): void {
    if (!this.shouldKeep(route) || !handle) {
      this.cache.delete(this.getKey(route));
      return;
    }

    this.cache.set(this.getKey(route), handle);
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    if (!this.shouldKeep(route)) {
      this.cache.clear();
      return false;
    }

    return this.cache.has(this.getKey(route));
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle | null {
    if (!this.shouldKeep(route)) {
      this.cache.clear();
      return null;
    }

    return this.cache.get(this.getKey(route)) ?? null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, current: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === current.routeConfig;
  }

  private shouldKeep(route: ActivatedRouteSnapshot): boolean {
    const isTrackedRoute = route.routeConfig?.path === 'tracks';
    const keepAlive = route.routeConfig?.data?.['keepAlive'] === true;
    return isTrackedRoute && keepAlive && !!this.auth.token();
  }

  private getKey(route: ActivatedRouteSnapshot): string {
    const path = route.pathFromRoot
      .map((segment) => segment.url.map((part) => part.path).join('/'))
      .join('/');

    return path || route.routeConfig?.path || 'root';
  }
}
