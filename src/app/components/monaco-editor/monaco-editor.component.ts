import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MonacoEditorService } from './monaco-editor.service';

@Component({
  selector: 'monaco-editor',
  template: require('./monaco-editor.template.html'),
  styles: [require('./monaco-editor.style.scss')]
})

export class MonacoEditorComponent {
  @Input() private monaco: any;
  @Output() private monacoChange = new EventEmitter<any>();
  @Input() private editor: any;
  @Output() private editorChange = new EventEmitter<any>();
  @Input() private model: any;
  @Output() private modelChange = new EventEmitter<any>();
  @Input() private text: string;
  @Input() private fileName: string;
  @ViewChild('monacoEditor') editorElement: ElementRef;
  @Output() private onDidChangeModelDecorations = new EventEmitter<any>();
  @Output() private onDidChangeModel = new EventEmitter<any>();
  @Output() private onDidCreateModel = new EventEmitter<any>();
  @Output() private onDidCreateEditor = new EventEmitter<any>();
  @Output() private onDidChangeModelContent = new EventEmitter<any>();
  // @Output() private editor: any;

  constructor(private monacoEditor: MonacoEditorService) {}

  initAfterMonaco(resolve?: Function, reject?: Function): Promise<any> {
    if (!resolve || !reject) {
      return new Promise<void>((resolve, reject) => {
        return this.initAfterMonaco(resolve, reject);
      });
    } else {
      if ((<any>window).monaco) {
        resolve((<any>window).monaco);
      } else {
        setTimeout(() => {
          return this.initAfterMonaco(resolve, reject);
        }, 0);
      }
    }
  }

  ngAfterViewInit() {
    this.initAfterMonaco().then((monaco) => {
      this.monaco = monaco;
      this.monacoChange.emit(this.monaco);

      monaco.editor.onDidCreateModel(e => this.onDidCreateModel.emit(e));
      monaco.editor.onDidCreateEditor(e => this.onDidCreateEditor.emit(e));

      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: this.monacoEditor.getSchemas()
      });

      this.model = monaco.editor.createModel(this.text, 'json', `inmemory://${this.fileName}`);
      this.modelChange.emit(this.model);

      this.editor = monaco.editor.create(this.editorElement.nativeElement, {
        model: this.model,
        minimap: {
          enabled: false
        },
        automaticLayout: true
      });
      this.editorChange.emit(this.editor);

      this.editor.onDidChangeModel(e => this.onDidChangeModel.emit(e));
      this.editor.onDidChangeModelDecorations(e => this.onDidChangeModelDecorations.emit(e));
      this.editor.onDidChangeModelContent(e => this.onDidChangeModelContent.emit(e));
    });
  }

  ngOnDestroy() {
    this.editor.dispose();
    this.model.dispose();
  }
}
