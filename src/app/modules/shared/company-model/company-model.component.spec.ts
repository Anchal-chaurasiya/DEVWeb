import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompanyModelComponent } from './company-model.component';

describe('CompanyModelComponent', () => {
  let component: CompanyModelComponent;
  let fixture: ComponentFixture<CompanyModelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CompanyModelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CompanyModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
