import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TranslateModule } from '@ngx-translate/core';
import { DocViewerComponent } from './doc-viewer.component';
import { DocViewerModule } from '../doc-viewer.module';
import { AltairConfig } from '../../../config';
import { Mock } from 'ts-mocks';
import { GqlService } from '../../../services';

let mockGqlService: Mock<GqlService>;

describe('DocViewerComponent', () => {
  let component: DocViewerComponent;
  let fixture: ComponentFixture<DocViewerComponent>;

  beforeEach(waitForAsync(() => {
    mockGqlService = new Mock();
    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot(),
        // Just import DocViewerModule since it contains all doc viewer component and dependencies
        DocViewerModule
      ],
      providers: [
        {
          provide: GqlService,
          useFactory: () => mockGqlService.Object,
        },
        {
          provide: AltairConfig,
          useValue: new AltairConfig(),
        },
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocViewerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
