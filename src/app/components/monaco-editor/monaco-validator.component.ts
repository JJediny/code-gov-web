import { Component, ChangeDetectorRef, EventEmitter, Input, Output } from '@angular/core';
import { MonacoEditorService } from './monaco-editor.service';

@Component({
  selector: 'monaco-validator',
  template: require('./monaco-validator.template.html'),
  styles: [require('./monaco-validator.style.scss')]
})

export class MonacoValidatorComponent {
  @Input() private monaco: any;
  @Input() private editor: any;
  @Input() private model: any;
  private errors = [];

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  ngOnChanges(changes: any) {
    const model = changes.model.currentValue;

    if (model) {
      model.onDidChangeDecorations(() => {
        this.errors = this.model.getAllDecorations().filter(decoration => decoration.isForValidation);
        this.changeDetectorRef.detectChanges();
      })
    }
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
}
