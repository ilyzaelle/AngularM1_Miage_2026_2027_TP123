import { bootstrapApplication } from "@angular/platform-browser";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { provideRouter, RouteReuseStrategy } from "@angular/router";
import { AppComponent } from './app/components/app/app';
import { routes } from './app/routes';
import { AuthService } from './app/shared/services/auth.service';
import { CustomRouteReuseStrategy } from './app/shared/services/route-reuse-strategy';
import { authInterceptor } from './app/shared/interceptors/auth.interceptor';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    { provide: RouteReuseStrategy, useFactory: (auth: AuthService) => new CustomRouteReuseStrategy(auth), deps: [AuthService] },
  ],
}).catch(console.error);
