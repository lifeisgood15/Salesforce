import { LightningElement, api } from "lwc";

export default class SearchRecords extends LightningElement {
  @api apiName;
  @api listViewApiName;
  matchingInfo = {
    primaryField: { fieldPath: "Name" },
    additionalFields: [{ fieldPath: "Owner.Name" }]
  };
  displayInfo = {
    primaryField: "Name",
    additionalFields: ["Phone"]
  };
  handleOnChange(e) {
    console.debug("Selected record", e.detail.recordId);
    this.dispatchEvent(
      new CustomEvent("itemselected", {
        detail: { recordId: e.detail.recordId, apiName: this.apiName }
      })
    );
  }
}
