import { TestBed } from '@angular/core/testing';

import { ImageuploadService } from './imageupload.service';

describe('ImageuploadService', () => {
  let service: ImageuploadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageuploadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
