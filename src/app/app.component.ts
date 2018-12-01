import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { VersionInfo, VersionInfoService } from './shared/version-info.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.sidenav.less',
    './app.component.top-menu.less',
})
export class AppComponent implements OnInit {


  isStarting = true;
  isTransitioning = true;
  hasFloatingToc = false;

  versionInfo: VersionInfo;

  get mode() {
    return this.isSideBySide ? 'side' : 'over';
  }

  @ViewChild(MatSidenav)
  sideNav: MatSidenav;

  constructor(
    private versionInfoService: VersionInfoService,
  ) {
  }

  ngOnInit(): void {
    this.versionInfoService.versionInfo.subscribe(v => this.versionInfo = v);
  }
}
