import {Routes} from '@angular/router';
import {AuthGuard} from '../auth/auth.guard';
import {IntroComponent} from '../intro/intro.component';
import {LoginComponent} from '../loginsignup/login/login.component';
import {SignupComponent} from '../loginsignup/signup/signup.component';
import {WordpuzzleComponent} from '../student/wordpuzzle/wordpuzzle.component';
import {TeacherdictionaryComponent} from '../teacher/teacherdictionary/teacherdictionary.component';
import {DictionaryComponent} from '../student/dictionary/dictionary.component';
import {MentoringComponent} from '../student/mentoring/mentoring.component';
import {TeacherdictionarychatComponent} from '../teacher/teacherdictionarychat/teacherdictionarychat.component';

export const routes: Routes = [
  {
    path: '',
    component: IntroComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  // STUDENT ROUTES
  {
    path: 'wordpuzzle',
    component: WordpuzzleComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'dictionary',
    component: DictionaryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'mentoring',
    component: MentoringComponent,
    canActivate: [AuthGuard]
  },
  // TEACHER ROUTES
  {
    path: 'teacherdictionary',
    component: TeacherdictionaryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'teacherdictionarychat',
    component: TeacherdictionarychatComponent,
    canActivate: [AuthGuard]
  },
  // Catch-all route for non-existing paths
  {
    path: '**',
    redirectTo: ''
  }
];
