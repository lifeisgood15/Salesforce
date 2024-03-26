import { LightningElement, api } from "lwc";

export default class SearchRecords extends LightningElement {
  @api apiName;
  @api listViewApiName;

  selectedRecord = "";
  selectedObjects = [];
  availableObjects = [
    {
      Label: "Financial Accounts",
      ApiName: "FinServ__FinancialAccount__c"
    },
    {
      Label: "Opportunities",
      ApiName: "Opportunity"
    },
    {
      Label: "Leads",
      ApiName: "Lead"
    },
    {
      Label: "Contacts",
      ApiName: "Contact"
    }
  ];
  matchingInfo = {
    primaryField: { fieldPath: "Name" },
    additionalFields: [{ fieldPath: "Owner.Name" }]
  };
  displayInfo = {
    primaryField: "Name",
    additionalFields: ["Phone"]
  };
  handleOnChange(e) {
    this.selectedRecord = e.detail.recordId;
    this.dispatchChange();
  }

  handleObjectChange(e) {
    if (e.target.checked) {
      this.selectedObjects.push(e.target.value);
    } else {
      this.selectedObjects = this.selectedObjects.filter(
        (obj) => obj !== e.target.value
      );
    }
    this.dispatchChange();
  }

  dispatchChange() {
    this.dispatchEvent(
      new CustomEvent("itemselected", {
        detail: { recordId: this.selectedRecord, apiName: this.selectedObjects.join(',') }
      })
    );
  }
}
