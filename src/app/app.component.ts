import { Component, OnInit } from '@angular/core';
import { VersionInfo, VersionInfoService } from './shared/version-info.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.top-menu.less',
})
export class AppComponent implements OnInit {
  isTransitioning = true;
  versionInfo: VersionInfo;
  constructor(
    private versionInfoService: VersionInfoService,
  ) {
  }
  ngOnInit(): void {
    this.versionInfoService.versionInfo.subscribe(v => this.versionInfo = v);
  }
}
