import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

/**
 * Material imports
 */
import { CustomMaterialModule } from './custom-modules/custom-material.module';

/**
 * Firebase imports
 */
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore";
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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuWrapperComponent,
    HomeComponent,
    ToolbarComponent,
    SidenavComponent,
    LoginAwaitComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp( environment.firebaseConfig ),
    AngularFirestoreModule,
    CustomMaterialModule,
    BrowserAnimationsModule
  ],
  providers: [
    AngularFireAuth,
    AngularFireStorage
  ],
  bootstrap: [ AppComponent ]
})
export class AppModule { }
