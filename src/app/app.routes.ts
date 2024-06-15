import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { Error404Component } from './pages/error404/error404.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { NotificationsComponent } from './pages/notifications/notifications.component';
import { ExploreComponent } from './pages/explore/explore.component';
import { OptionsComponent } from './pages/options/options.component';
import { LoginComponent } from './pages/auth/login/login.component';
import { RegisterComponent } from './pages/auth/register/register.component';
import { PublishComponent } from './records/event/publish/publish.component';
import { authGuard } from './auth.guard';
import { GuestGuard } from './guest.guard';
import { PostComponent } from './pages/post/post.component';
import { ProfileEditComponent } from './pages/profile-edit/profile-edit.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [GuestGuard] },
    { path: 'register', component: RegisterComponent, canActivate: [GuestGuard] },
    { path: 'home', component: HomeComponent },
    { path: 'search', component: ExploreComponent },
    { path: 'notifications', component: NotificationsComponent, canActivate: [authGuard] },
    { path: 'profile', component: ProfileComponent, canActivate: [authGuard] },
    // { path: 'options', component: OptionsComponent, canActivate: [authGuard] },
    { path: '404', component: Error404Component },

    { path: 'user/:username', component: ProfileComponent },
    { path: 'event/:id', component: PostComponent },
    { path: 'post', component: PublishComponent, canActivate: [authGuard] },
    { path: 'profile/edit', component: ProfileEditComponent, canActivate: [authGuard] },

    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: '**', redirectTo: '404', pathMatch: 'full' },

];
