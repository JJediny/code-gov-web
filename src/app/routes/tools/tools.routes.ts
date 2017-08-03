import { Routes } from '@angular/router';
import {
  ToolsComponent,
  SchemaValidatorComponent,
  UpgradeSchemaComponent
} from '../../utils/app-components';

export const TOOLS_ROUTES: Routes = [
  {
    path: 'tools',
    component: ToolsComponent,
    children: [
      { path: '', redirectTo: 'schema-validator', pathMatch: 'full' },
      {
        path: 'schema-validator',
        component: SchemaValidatorComponent
      },
      {
        path: 'upgrade-schema',
        component: UpgradeSchemaComponent
      }
    ]
  }
];
