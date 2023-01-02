// import { BLACK_ON_WHITE_CSS_CLASS } from '@angular/cdk/a11y/high-contrast-mode/high-contrast-mode-detector';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-loading-spinner-bars',
  templateUrl: './loading-spinner-bars.component.html',
  styleUrls: ['./loading-spinner-bars.component.css']
})
export class LoadingSpinnerBarsComponent {
  @Input() color: string = 'black';
}
