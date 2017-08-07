import { Component, ChangeDetectorRef } from '@angular/core';
import { MonacoEditorService } from '../../monaco-editor';
const _ = require('lodash');

@Component({
  selector: 'schema-validator',
  template: require('./schema-validator.template.html'),
  styles: [require('./schema-validator.style.scss')],
})

export class SchemaValidatorComponent {
  private errors: Array<Object> = [];
  private codeJson = JSON.stringify(require('./1.0.1-example.json'), null, '\t');
  private monaco: any;
  private model: any;
  private editor: any;

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private monacoEditor: MonacoEditorService
  ) {
    monacoEditor.addSchema(['*-2.0.0.json'], require('../../../schemas/2.0.0.json'));
  }

  onDidCreateEditor(editor) {
    this.editor = editor;
  }

  onDidCreateModel(model) {
    this.model = model;
  }

  onDidChangeModel(event) {

  }

  onDidChangeModelDecorations(event) {
    const errors = this.errors = this.model.getAllDecorations().filter(decoration => decoration.isForValidation);
    this.changeDetectorRef.detectChanges();
  }

  scrollToError(error) {
    const { startMarker, endMarker } = error;
    const range = new this.monaco.Range(
      startMarker.position.lineNumber,
      startMarker.position.column,
      endMarker.position.lineNumber,
      endMarker.position.column,
    );
    this.editor.revealRange(range);
    this.editor.setPosition(startMarker.position);
    this.editor.focus();
  }

  hasInput() {
    return this.codeJson.length > 0;
  }

  isValid() {
    return this.errors === null;
  }
}
