import { Component, ChangeDetectorRef } from '@angular/core';
// const monaco = require('monaco-editor/min/vs/editor/editor.main');
const Ajv = require('ajv');
const ajv = new Ajv({ format: 'full', allErrors: true, verbose: true });

ajv.addMetaSchema(require('ajv/lib/refs/json-schema-draft-04.json'));
ajv.addSchema(require('../../../schemas/2.0.0.json'), '2.0.0');

function initAfterMonaco(resolve?: Function, reject?: Function): Promise<any> {
  if (!resolve || !reject) {
    return new Promise<void>(function (resolve, reject) {
      return initAfterMonaco(resolve, reject);
    });
  } else {
    if ((<any>window).monaco) {
      resolve((<any>window).monaco);
    } else {
      setTimeout(function () {
        return initAfterMonaco(resolve, reject);
      }, 0);
    }
  }
}

@Component({
  selector: 'schema-validator',
  template: require('./schema-validator.template.html'),
  styles: [require('./schema-validator.style.scss')],
})

export class SchemaValidatorComponent {
  private codeJson: string = '';
  private errors: Array<Object> = null;
  private model: any;
  private editor: any;

  constructor(private changeDetectorRef: ChangeDetectorRef) {}

  setCodeJson(value) {
    this.codeJson = value;

    try {
      ajv.validate('2.0.0', JSON.parse(value));

      this.errors = ajv.errors;
    } catch(e) {
      this.errors = [{
        keyword: '',
        message: 'Code.json is invalid JSON.'
      }];
    }
  }

  ngAfterViewInit() {
    initAfterMonaco().then((monaco) => {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        schemas: [{
          fileMatch: ['foo.json'],
          schema: require('../../../schemas/2.0.0.json')
        }]
      });

      const jsonCode = require('./1.0.1-example.json');

      const model = monaco.editor.createModel(JSON.stringify(jsonCode, null, '\t'), 'json', 'internal://server/foo.json');
      (<any>window).model = model;

      const editor = monaco.editor.create(document.getElementById('codeJsonInput'), {
        model: model
      });
      (<any>window).editor = editor;
      this.editor = editor;

      this.model = model;

      model.onDidChangeDecorations(() => {
        this.errors = this.model.getAllDecorations().filter(decoration => Array.isArray(decoration.options.hoverMessage));
        this.changeDetectorRef.detectChanges();
      });
    });
  }

  getErrors() {
    if (this.model) {
      return this.model.getAllDecorations().filter(decoration => Array.isArray(decoration.options.hoverMessage));
    } else {
      return [];
    }
  }

  scrollToError(error) {
    this.editor.revealLine(error.startMarker.position.lineNumber);
  }

  hasInput() {
    return this.codeJson.length > 0;
  }

  isValid() {
    return this.errors === null;
  }
}
