import { bootstrapApplication } from '@angular/platform-browser';
import { AppConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { AppInitService } from './app/core/services/app-init.service';

bootstrapApplication(AppComponent, AppConfig)
  .then(appRef => {
    const appInitService = appRef.injector.get(AppInitService);
    return appInitService.initializeApp();
  })
  .catch((err) => console.error(err));
