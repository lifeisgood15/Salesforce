import { LightningElement, api } from 'lwc';

export default class RecordsTable extends LightningElement {
    @api recordId;
    @api apiName;

    get selectedRecord() {
        console.debug('record: ', this.recordId);
        return this.recordId;
    }
}