import { Component } from '@angular/core';
import _ from 'lodash';

@Component({
  selector: 'upgrade-schema',
  template: require('./upgrade-schema.template.html'),
  styles: [require('./upgrade-schema.style.scss')]
})

export class UpgradeSchemaComponent {
  private codeJson: string = '';
  private upgradedCodeJson: string = '';

  setCodeJson(value) {
    this.codeJson = value;

    const upgradedCodeJson = JSON.parse(value);

    upgradedCodeJson.version = '2.0.0';

    upgradedCodeJson.releases = upgradedCodeJson.projects.map(project => {
      project.repositoryURL = project.repository;
      delete project.repository;

      project.homepageURL = project.homepage;
      delete project.homepage;

      project.date = project.updated;
      delete project.updated;

      project.licenses = [{
        URL: project.license,
        name: null
      }];
      delete project.license;

      project.permissions = {};

      if (project.openSourceProject === 1) {
        project.permissions.usageType = 'open';
        project.permissions.exemptionText = null;
      } else if (project.governmentWideReuseProject === 1) {
        project.permissions.usageType = 'governmentWideReuse';
        project.permissions.exemptionText = null;
      } else if (String(project.exemption) === '1') {
        project.permissions.usageType = 'exemptByLaw';
        project.permissions.exemptionText = 'The sharing of the source code is restricted by law or regulation, including—but not limited to—patent or intellectual property law, the Export Asset Regulations, the International Traffic in Arms Regulation, and the Federal laws and regulations governing classified information.';
      } else if (String(project.exemption) === '2') {
        project.permissions.usageType = 'exemptByNationalSecurity';
        project.permissions.exemptionText = 'The sharing of the source code would create an identifiable risk to the detriment of national security, confidentiality of Government information, or individual privacy.';
      } else if (String(project.exemption) === '3') {
        project.permissions.usageType = 'exemptByAgencySystem';
        project.permissions.exemptionText = 'The sharing of the source code would create an identifiable risk to the stability, security, or integrity of the agency’s systems or personnel.';
      } else if (String(project.exemption) === '4') {
        project.permissions.usageType = 'exemptByAgencyMission';
        project.permissions.exemptionText = 'The sharing of the source code would create an identifiable risk to agency mission, programs, or operations.';
      } else if (String(project.exemption) === '5') {
        project.permissions.usageType = 'exemptByCIO';
        project.permissions.exemptionText = 'The CIO believes it is in the national interest to exempt sharing the source code.';
      } else {
        project.permissions.usageType = null;
        project.permissions.exemptionText = null;
      }
      delete project.openSourceProject;
      delete project.governmentWideReuseProject;
      delete project.exemption;
      delete project.exemptionText;

      project.laborHours = null;
      project.measurementType = null;

      return project;
    });
    delete upgradedCodeJson.projects;

    this.upgradedCodeJson = JSON.stringify(upgradedCodeJson, null, '\t');
  }
}
