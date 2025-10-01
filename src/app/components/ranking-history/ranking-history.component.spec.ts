import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RankingHistoryComponent } from './ranking-history.component';

describe('RankingHistoryComponent', () => {
  let component: RankingHistoryComponent;
  let fixture: ComponentFixture<RankingHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RankingHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RankingHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
