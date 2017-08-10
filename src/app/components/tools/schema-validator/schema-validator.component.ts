import { Component, ChangeDetectorRef } from '@angular/core';
import { MonacoEditorService } from '../../monaco-editor';
const _ = require('lodash');

@Component({
  selector: 'schema-validator',
  template: require('./schema-validator.template.html'),
  styles: [require('./schema-validator.style.scss')],
})

export class SchemaValidatorComponent {
  private codeJson = JSON.stringify(require('./1.0.1-example.json'), null, '\t');
  private monaco: any;
  private model: any;
  private editor: any;
  private version = '2.0.0';

  constructor(
    private monacoEditor: MonacoEditorService
  ) {
    monacoEditor.addSchema('2.0.0.json', ['*-2.0.0.json'], require('../../../schemas/2.0.0.json'));
    monacoEditor.addSchema('1.0.1.json', ['*-1.0.1.json'], require('../../../schemas/1.0.1.json'));
  }
}
