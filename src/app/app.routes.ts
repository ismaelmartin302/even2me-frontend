import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { Error404Component } from './pages/error404/error404.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { OptionsComponent } from './pages/options/options.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { authGuard } from './auth.guard';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'register', component: RegisterComponent },
    { path: 'home', component: HomeComponent },
    { path: 'search', component: ExploreComponent },
    { path: 'notifications', component: NotificationsComponent },
    { path: 'profile', component: ProfileComponent },
    { path: 'options', component: OptionsComponent },
    { path: '404', component: Error404Component },

    { path: 'user/:username', component: ProfileComponent },

    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: '404', pathMatch: 'full' },

];
