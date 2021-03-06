import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/**
 * Material imports
 */
import { CustomMaterialModule } from './custom-modules/custom-material.module';

/**
 * PrimeNg Imports
 */
import { PrimeNgModule } from './custom-modules/primeng.module';

/**
 * Firebase imports
 */
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule, FirestoreSettingsToken } from "@angular/fire/firestore";
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireStorage } from '@angular/fire/storage';
import { environment } from 'src/environments/environment';

/**
 * Components imports
 */
import { LoginComponent } from './components/views/login/login.component';
import { MenuWrapperComponent } from './components/utilities/menu-wrapper/menu-wrapper.component';
import { HomeComponent } from './components/views/home/home.component';
import { ToolbarComponent } from './components/shared/toolbar/toolbar.component';
import { SidenavComponent } from './components/shared/sidenav/sidenav.component';
import { LoginAwaitComponent } from './components/views/login-await/login-await.component';
import { IconStatComponent } from './components/ui/icon-stat/icon-stat.component';
import { NullImgUrlPipe } from './pipes/null-img-url.pipe';
import { UserProfileComponent } from './components/views/user-profile/user-profile.component';
import { NewRouteComponent } from './components/views/new-route/new-route.component';
import { CurrentRoutesComponent } from './components/views/current-routes/current-routes.component';
import { ChallengesComponent } from './components/views/challenges/challenges.component';
import { HttpClientModule } from '@angular/common/http';
import { RouteCardComponent } from './components/ui/route-card/route-card.component';
import { RouteFinderComponent } from './components/views/route-finder/route-finder.component';
import { RouteViewComponent } from './components/views/route-view/route-view.component';
import { LoadingIconComponent } from './components/utilities/loading-icon/loading-icon.component';
import { GlobalLoadingComponent } from './components/utilities/global-loading/global-loading.component';
import { BugReportComponent } from './components/views/bug-report/bug-report.component';
import { VideoTutorialComponent } from './components/utilities/video-tutorial/video-tutorial.component';
import { ImgUrlPipe } from './pipes/img-url.pipe';
import { PartnerFinderComponent } from './components/views/partner-finder/partner-finder.component';
import { VersionNotesComponent } from './components/views/version-notes/version-notes.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuWrapperComponent,
    HomeComponent,
    ToolbarComponent,
    SidenavComponent,
    LoginAwaitComponent,
    IconStatComponent,
    NullImgUrlPipe,
    UserProfileComponent,
    NewRouteComponent,
    CurrentRoutesComponent,
    ChallengesComponent,
    RouteCardComponent,
    RouteFinderComponent,
    RouteViewComponent,
    LoadingIconComponent,
    GlobalLoadingComponent,
    BugReportComponent,
    VideoTutorialComponent,
    ImgUrlPipe,
    PartnerFinderComponent,
    VersionNotesComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp( environment.firebaseConfig ),
    AngularFirestoreModule,
    CustomMaterialModule,
    PrimeNgModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
  ],
  providers: [
    AngularFireAuth,
    AngularFireStorage,
    {
      provide: FirestoreSettingsToken,
      useValue: {}
    }
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
