import { Component, HostListener, OnInit } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {
  // Videos específicos para cada deporte
  futbolVideo: SafeResourceUrl | undefined;
  basquetVideo: SafeResourceUrl | undefined;
  beisbolVideo: SafeResourceUrl | undefined;
  tenisVideo: SafeResourceUrl | undefined;
  videoFondo: SafeResourceUrl | undefined;
  showScrollButton = false;

  constructor(private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    // Videos reales relacionados con cada deporte
    this.futbolVideo = this.getSafeUrl('https://www.youtube.com/embed/r8U2Gu4u7Xw?rel=0');
    this.basquetVideo = this.getSafeUrl('https://www.youtube.com/embed/6RfkDkzqZfI?rel=0');
    this.beisbolVideo = this.getSafeUrl('https://www.youtube.com/embed/85VwJYk3XAA?rel=0');
    this.tenisVideo = this.getSafeUrl('https://www.youtube.com/embed/8vPcN8WZz1k?rel=0');

    // Video de fondo
    this.videoFondo = this.getSafeUrl('https://www.youtube.com/embed/L3374C3OyrY?autoplay=1&mute=1&loop=1&playlist=L3374C3OyrY');
  }

  private getSafeUrl(url: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.showScrollButton = window.scrollY > 300;
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }
}