import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePurchaseOrderComponent } from './create-purchase-order.component';

describe('CreatePurchaseOrderComponent', () => {
  let component: CreatePurchaseOrderComponent;
  let fixture: ComponentFixture<CreatePurchaseOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreatePurchaseOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
