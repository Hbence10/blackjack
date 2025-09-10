import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelearsPlace } from './delears-place';

describe('DelearsPlace', () => {
  let component: DelearsPlace;
  let fixture: ComponentFixture<DelearsPlace>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DelearsPlace]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DelearsPlace);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
