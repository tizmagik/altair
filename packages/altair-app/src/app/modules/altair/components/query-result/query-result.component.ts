import {
  Component,
  OnInit,
  Input,
  Output,
  ViewChild,
  EventEmitter,
  OnChanges,
  ElementRef,
  SimpleChanges,
  DoCheck,
} from '@angular/core';

// Import the codemirror packages
import * as Codemirror from 'codemirror';
import 'codemirror/addon/hint/show-hint';
import 'codemirror/addon/lint/lint';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/indent-fold';
// import 'codemirror/addon/display/autorefresh';
import 'codemirror/addon/dialog/dialog';
import 'codemirror/addon/search/search';
import 'codemirror/addon/search/searchcursor';
import 'codemirror/addon/search/matchesonscrollbar';
import 'codemirror/addon/search/jump-to-line';
import 'codemirror/addon/scroll/annotatescrollbar';
import 'codemirror-graphql/results/mode';
import { SubscriptionResponse } from '../../store/query/query.reducer';
import { handleEditorRefresh } from '../../utils/codemirror/refresh-editor';
import isElectron from '../../utils/is_electron';

@Component({
  selector: 'app-query-result',
  templateUrl: './query-result.component.html',
  styleUrls: ['./query-result.component.scss']
})
export class QueryResultComponent implements OnChanges, DoCheck {

  @Input() queryResult = '';
  @Input() responseTime = 0;
  @Input() responseStatus = 0;
  @Input() responseStatusText = '';
  @Input() responseHeaders = {};
  @Input() isSubscribed = false;
  @Input() subscriptionResponses: SubscriptionResponse[] = [];
  @Input() subscriptionUrl = '';
  @Input() tabSize = 2;
  @Input() autoscrollSubscriptionResponses = false;
  @Input() uiActions = [];

  @Output() downloadResultChange = new EventEmitter();
  @Output() stopSubscriptionChange = new EventEmitter();
  @Output() clearSubscriptionChange = new EventEmitter();
  @Output() autoscrollSubscriptionResponsesChange = new EventEmitter();
  @Output() uiActionExecuteChange = new EventEmitter();

  @ViewChild('editor', { static: true }) editor: ElementRef & { codeMirror: CodeMirror.Editor };
  @ViewChild('subscriptionResponseList', { static: true }) subscriptionResponseList: ElementRef;

  isElectron = isElectron;

  selectedIndex = 0;

  resultEditorConfig = {
    mode: 'graphql-results',
    json: true,
    tabSize: this.tabSize,
    indentUnit: this.tabSize,
    lineWrapping: true,
    lineNumbers: true,
    foldGutter: true,
    readOnly: true,
    dragDrop: false,
    autoRefresh: true,
    theme: 'default query-result',
    gutters: ['CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
    extraKeys: {
      'Alt-F': 'findPersistent',
      'Ctrl-F': 'findPersistent',
    },
  };

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes?.subscriptionResponses?.currentValue) {
      const scrollTopTimeout = setTimeout(() => {
        if (this.subscriptionResponseList && this.autoscrollSubscriptionResponses) {
          this.subscriptionResponseList.nativeElement.scrollTop = this.subscriptionResponseList.nativeElement.scrollHeight;
        }
        clearTimeout(scrollTopTimeout);
      }, 50);
    }

    if (changes?.queryResult?.currentValue) {
      setTimeout(() => handleEditorRefresh(this.editor?.codeMirror, true), 10);
    }

    if (changes?.isSubscribed) {
      if (changes.isSubscribed.currentValue) {
        // select subscription result tab is subscribed
        this.selectedIndex = 1;
      } else {
        // if unsubscribed and no subscription result yet, select initial tab instead
        if (!this.subscriptionResponses.length) {
          this.selectedIndex = 0;
        }
      }
    }
  }

  ngDoCheck() {
    // Refresh the query result editor view when there are any changes
    // to fix any broken UI issues in it
    handleEditorRefresh(this.editor?.codeMirror);
  }

  subscriptionResponseTrackBy(index: number, response: SubscriptionResponse) {
    return response.responseTime;
  }
}
