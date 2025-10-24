import {mergeApplicationConfig, ApplicationConfig} from '@angular/core';
import {AppConfig} from './app.config';

const AppServerConfig: ApplicationConfig = {
    providers: [],
};

export const config = mergeApplicationConfig(AppConfig, AppServerConfig);
