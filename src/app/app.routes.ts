import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { Error404Component } from './pages/error404/error404.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { OptionsComponent } from './pages/options/options.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'search', component: ExploreComponent },
    { path: 'notifications', component: NotificationsComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'options', component: OptionsComponent },
    { path: '404', component: Error404Component },
];
