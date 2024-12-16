import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MapviewPage } from './mapview.page';

describe('MapviewPage', () => {
  let component: MapviewPage;
  let fixture: ComponentFixture<MapviewPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MapviewPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
