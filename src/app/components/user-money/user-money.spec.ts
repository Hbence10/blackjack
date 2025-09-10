import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserMoney } from './user-money';

describe('UserMoney', () => {
  let component: UserMoney;
  let fixture: ComponentFixture<UserMoney>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserMoney]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UserMoney);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
