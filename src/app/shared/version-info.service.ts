import { HttpClient } from '@angular/common/http';
import { Injectable, Version } from '@angular/core';
import { ConnectableObservable, Observable } from 'rxjs';
import { publishLast } from 'rxjs/operators';
import { CONTENT_URL_PREFIX } from './paths';

const VERSION_REQ_PATH = CONTENT_URL_PREFIX + '/version.json';

export interface VersionInfo {
  raw: string;
  major: number;
  minor: number;
  patch: number;
  preRelease: string[];
  build: string;
  version: string;
  codeName: string;
  isSnapshot: boolean;
  full: string;
  branch: string;
  commitSHA: string;
}

@Injectable()
export class VersionInfoService {

  versionInfo: Observable<VersionInfo>;

  constructor(private http: HttpClient) {
    this.versionInfo = this.fetchVersionInfo();
  }

  private fetchVersionInfo(): Observable<VersionInfo> {
    // Public Release related code:
    const versionInfo = this.http
      .get<VersionInfo>(VERSION_REQ_PATH)
      .pipe<VersionInfo>(publishLast());
    (versionInfo as ConnectableObservable<VersionInfo>).connect();
    return versionInfo;
  }
}
