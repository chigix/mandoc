import { DOCUMENT } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Inject, Injectable, Optional } from '@angular/core';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable()
export class CustomIconRegistry extends MatIconRegistry {

  constructor(@Optional() _httpClient: HttpClient,
    private sanitizer: DomSanitizer,
    @Optional() @Inject(DOCUMENT) document: any) {
    super(_httpClient, sanitizer, document);
    this.loadSvgElements();
  }

  private loadSvgElements() {
    this.addSvgIcon('close',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icon-image-set/close.svg'));
    this.addSvgIcon('error_outline',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icon-image-set/error_outline.svg'));
    this.addSvgIcon('insert_comment',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icon-image-set/insert_comment.svg'));
    this.addSvgIcon('keyboard_arrow_right',
      this.sanitizer
        .bypassSecurityTrustResourceUrl('assets/icon-image-set/keyboard_arrow_right.svg'));
    this.addSvgIcon('menu',
      this.sanitizer.bypassSecurityTrustResourceUrl('assets/icon-image-set/menu.svg'));
  }

}
