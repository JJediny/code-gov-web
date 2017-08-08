import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { MonacoEditorService } from './monaco-editor.service';

@Component({
  selector: 'monaco-editor',
  template: require('./monaco-editor.template.html'),
  styles: [require('./monaco-editor.style.scss')]
})

export class MonacoEditorComponent {
  private monaco: any;
  private editor: any;
  private model: any;
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

      monaco.editor.onDidCreateModel(e => this.onDidCreateModel.emit(e));
      monaco.editor.onDidCreateEditor(e => this.onDidCreateEditor.emit(e));

      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: this.monacoEditor.getSchemas()
      });

      this.model = monaco.editor.createModel(this.text, 'json', `inmemory://${this.fileName}`);

      this.editor = monaco.editor.create(this.editorElement.nativeElement, {
        model: this.model,
        minimap: {
          enabled: false
        },
        automaticLayout: true
      });

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
