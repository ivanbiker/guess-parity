import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SpinnerComponent } from './spinner';

@NgModule({
  declarations: [
    SpinnerComponent,
  ],
  imports: [
    IonicModule,
  ],
  exports: [
    SpinnerComponent
  ]
})
export class SpinnerComponentModule {}
