import { Component, Input } from '@angular/core';
import { VersionInfo } from '../../shared/version-info.service';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.less']
})
export class FooterComponent {

  @Input() versionInfo: VersionInfo;

  constructor() { }

}
