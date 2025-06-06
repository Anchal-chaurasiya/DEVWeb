import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateItemGroupComponent } from './create-item-group.component';

describe('CreateItemGroupComponent', () => {
  let component: CreateItemGroupComponent;
  let fixture: ComponentFixture<CreateItemGroupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateItemGroupComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateItemGroupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
