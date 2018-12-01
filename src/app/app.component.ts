import { Component, OnInit } from '@angular/core';
import { VersionInfo, VersionInfoService } from './shared/version-info.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.less']
})
export class AppComponent implements OnInit {
  versionInfo: VersionInfo;
  constructor(
    private versionInfoService: VersionInfoService,
  ) {
  }
  ngOnInit(): void {
    this.versionInfoService.versionInfo.subscribe(v => this.versionInfo = v);
  }
}
