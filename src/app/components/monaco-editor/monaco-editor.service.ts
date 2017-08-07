import { Injectable } from '@angular/core';

@Injectable()

export class MonacoEditorService {
  private schemas = {};

  public addSchema(fileMatch, schema) {
    this.schemas[fileMatch] = schema;
  }

  public getSchemas() {
    return Object.entries(this.schemas).map(([fileMatch, schema]) => ({
      fileMatch,
      schema
    }))
  }
}
