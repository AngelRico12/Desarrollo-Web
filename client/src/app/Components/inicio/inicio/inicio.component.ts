import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent {
  futbolVideo?: SafeResourceUrl;
  basquetVideo?: SafeResourceUrl;
  beisbolVideo?: SafeResourceUrl;
  tenisVideo?: SafeResourceUrl;
  videoFondo!: SafeResourceUrl;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.futbolVideo = this.getSafeUrl('https://www.youtube.com/embed/hbLgszfXTAY');
    this.basquetVideo = this.getSafeUrl('https://www.youtube.com/embed/fN5HV79_8B8');
    this.beisbolVideo = this.getSafeUrl('https://www.youtube.com/embed/fyT6QmBYzF0');
    this.tenisVideo = this.getSafeUrl('https://www.youtube.com/embed/jp9iCyP63ek');

    const fondoVideoId = 'L3374C3OyrY';
    this.videoFondo = this.getSafeUrl(`https://www.youtube.com/embed/${fondoVideoId}?autoplay=1&mute=1&controls=0&showinfo=0&loop=1&playlist=${fondoVideoId}`);
  }

  private getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }
}
