import { LightningElement, api, wire } from "lwc";
import { gql, graphql } from "lightning/uiGraphQLApi";

const columns = [
  { label: "Name", fieldName: "Name" },
  { label: "Balance", fieldName: "Balance", type: "currency" },
  {
    label: "Tax Status",
    fieldName: "FinServ__TaxStatus__c",
    type: "text"
  }
];

export default class RecordsTable extends LightningElement {
  @api recordId;
  @api apiName;

  columns = columns;
  rowOffset = 0;
  rowsLimit = 5;

  // select id, name, FinServ__Balance__c, FinServ__PrimaryOwner__c from FinServ__FinancialAccount__c where FinServ__PrimaryOwner__c =''
  @wire(graphql, {
    query: gql`
      query searchfinAcc($searchKey: ID = "", $limit: Int = 5) {
        uiapi {
          query {
            FinServ__FinancialAccount__c(
              where: { FinServ__PrimaryOwner__c: { eq: $searchKey } }
              first: $limit
              orderBy: { Name: { order: ASC } }
            ) {
              edges {
                node {
                  Id
                  Name {
                    value
                  }
                  FinServ__Balance__c {
                    value
                  }
                  FinServ__TaxStatus__c {
                    value
                  }
                }
              }
            }
          }
        }
      }
    `,
    variables: "$variables"
  })
  records;

  get variables() {
    return {
      searchKey: this.selectedRecord ?? "",
      limit: this.rowsLimit
    };
  }

  get finAccData() {
    console.log(JSON.stringify(this.records));
    return this.records?.data?.uiapi.query.FinServ__FinancialAccount__c.edges.map(
      (edge) => ({
        Id: edge.node.Id,
        Name: edge.node.Name.value,
        Balance: edge.node.FinServ__Balance__c.value,
        FinServ__TaxStatus__c: edge.node.FinServ__TaxStatus__c.value
      })
    );
  }

  get errors() {
    return {
      isError: this.records?.errors?.length > 0,
      errorType: this.records?.errors ? this.records?.errors[0].errorType : ""
    };
  }

  get hasRecords() {
    return this.finAccData?.length > 0;
  }

  get showDatatable() {
    return this.selectedRecord && this.hasRecords;
  }

  get selectedRecord() {
    return this.recordId;
  }

  get objApiName() {
    return this.apiName;
  }

  increaseRowLimit() {
    this.rowsLimit += 5;
  }
}
