import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { index } from '../pages/index/index';
import {choice_destin} from "../pages/choice_destin/choice_destin";

@NgModule({
  declarations: [
    MyApp,
    choice_destin,
    index
  ],
  imports: [
    IonicModule.forRoot(MyApp,{
      mode:'ios',
  backButtonText:'返回上页',
  pageTransition:'ios',
  })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    choice_destin,
    index
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}]
})
export class AppModule {}
