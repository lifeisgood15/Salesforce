import { LightningElement } from 'lwc';

export default class SearchRecords extends LightningElement {
    matchingInfo = {
        primaryField: { fieldPath: 'Name' },
        additionalFields: [{ fieldPath: 'Owner.Name' }],
    };
    displayInfo = {
        primaryField: 'Account.Name',
        additionalFields: ['Account.Phone'],
    };
    handleOnChange(e) {
        console.debug('Selected record', e.detail.recordId)
    }
}