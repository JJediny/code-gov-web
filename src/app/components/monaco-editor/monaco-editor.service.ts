import { Injectable } from '@angular/core';
import { map } from 'lodash';

@Injectable()

export class MonacoEditorService {
  private schemas = {};

  public addSchema(fileMatch, schema) {
    this.schemas[fileMatch] = {
      fileMatch,
      schema
    };
  }

  public getSchemas() {
    return map(this.schemas, ({ fileMatch, schema }) => ({
      fileMatch,
      schema
    }));
  }
}
