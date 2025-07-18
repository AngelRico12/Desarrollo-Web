import { TestBed } from '@angular/core/testing';
import { YoutubeService } from './youtube.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

describe('YoutubeService', () => {
  let service: YoutubeService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule], // ← Necesario para HttpClient
    });
    service = TestBed.inject(YoutubeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
