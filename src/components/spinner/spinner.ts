import { Component, Input } from '@angular/core';

@Component({
  selector: 'spinner',
  templateUrl: 'spinner.html'
})
export class SpinnerComponent {

  @Input('isVisible') isVisible: boolean;

}
