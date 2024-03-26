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
      query searchfinAcc($searchKey: ID = "", $includeFinAcc :Boolean!) {
        uiapi {
          query {
            Account(
              where: { Id: { eq: $searchKey } }
            ) {
              edges {
                node {
                  Id
                  Name {
                    value
                  }
                  FinServ__ClientFinancialAccounts__r @include(if: $includeFinAcc) {
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
          }
        }
      }
    `,
    variables: "$variables"
  })
  records;
  /*
  {
    "data": {
        "uiapi": {
            "query": {
                "Account": {
                    "edges": [
                        {
                            "node": {
                                "Id": "0012y000008FupjAAC",
                                "Name": {
                                    "value": "Rachel Adams (Sample)"
                                },
                                "FinServ__ClientFinancialAccounts__r": {
                                    "edges": [
                                        {
                                            "node": {
                                                "Id": "a0F2y000002Cag4EAC",
                                                "Name": {
                                                    "value": "Investment Account (Sample)"
                                                },
                                                "FinServ__Balance__c": {
                                                    "value": 995000
                                                },
                                                "FinServ__TaxStatus__c": {
                                                    "value": "Nonqualified"
                                                }
                                            }
                                        },
                                        {
                                            "node": {
                                                "Id": "a0F2y000002Cag5EAC",
                                                "Name": {
                                                    "value": "Mutual Fund Investment (Sample)"
                                                },
                                                "FinServ__Balance__c": {
                                                    "value": 142000
                                                },
                                                "FinServ__TaxStatus__c": {
                                                    "value": "Nonqualified"
                                                }
                                            }
                                        },
                                        {
                                            "node": {
                                                "Id": "a0F2y000002Cag8EAC",
                                                "Name": {
                                                    "value": "Bank of BAS Checking Account (Sample)"
                                                },
                                                "FinServ__Balance__c": {
                                                    "value": 100000
                                                },
                                                "FinServ__TaxStatus__c": {
                                                    "value": "Nonqualified"
                                                }
                                            }
                                        },
                                        {
                                            "node": {
                                                "Id": "a0F2y000002CagAEAS",
                                                "Name": {
                                                    "value": "Life Insurance $2M (Sample)"
                                                },
                                                "FinServ__Balance__c": {
                                                    "value": null
                                                },
                                                "FinServ__TaxStatus__c": {
                                                    "value": null
                                                }
                                            }
                                        },
                                        {
                                            "node": {
                                                "Id": "a0F2y000002CagBEAS",
                                                "Name": {
                                                    "value": "Personal Loan (Sample)"
                                                },
                                                "FinServ__Balance__c": {
                                                    "value": 12377.65
                                                },
                                                "FinServ__TaxStatus__c": {
                                                    "value": null
                                                }
                                            }
                                        },
                                        {
                                            "node": {
                                                "Id": "a0F2y000002CagCEAS",
                                                "Name": {
                                                    "value": "HELOC Account (Sample)"
                                                },
                                                "FinServ__Balance__c": {
                                                    "value": 7100
                                                },
                                                "FinServ__TaxStatus__c": {
                                                    "value": null
                                                }
                                            }
                                        },
                                        {
                                            "node": {
                                                "Id": "a0F2y000002CagDEAS",
                                                "Name": {
                                                    "value": "Checking Account (Sample)"
                                                },
                                                "FinServ__Balance__c": {
                                                    "value": 7106.57
                                                },
                                                "FinServ__TaxStatus__c": {
                                                    "value": null
                                                }
                                            }
                                        }
                                    ]
                                }
                            }
                        }
                    ]
                }
            }
        }
    }
} 2 recordsTable.js: 1: 1662
*/
  get variables() {
    return {
      searchKey: this.selectedRecord ?? "",
      includeFinAcc: this.objApiName?.includes('FinServ__FinancialAccount__c') ? true : false,
    };
  }

  get finAccData() {
    console.log(JSON.stringify(this.records));
    // return this.records?.data?.uiapi.query.Account.edges.map((objs) => {
    //   return objs.edges.map(
    //     (edge) => ({
    //       Id: edge.node.Id,
    //       Name: edge.node.Name.value,
    //       Balance: edge.node.FinServ__Balance__c.value,
    //       FinServ__TaxStatus__c: edge.node.FinServ__TaxStatus__c.value
    //     }))
    // })
    return [];
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
