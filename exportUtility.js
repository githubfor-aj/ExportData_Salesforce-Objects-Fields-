import { LightningElement, track, wire } from 'lwc';
import getObjects from '@salesforce/apex/ExportUtility.getObjects';
import getFields from '@salesforce/apex/ExportUtility.getFields';
import initiateExport from '@salesforce/apex/ExportUtility.initiateExport';
import './exportUtility.css';

export default class ExportUtility extends LightningElement {
    @track objectOptions = [];
    @track fieldOptions = [];
    @track selectedObject = '';
    @track selectedFields = ['Id', 'Name',];
    @track jobId;
   
    @wire(getObjects)
    wiredObjects({ error, data }) {
        if (data) {
            this.objectOptions = data.map(({ label, apiName }) => ({ label, value: apiName }));
        } else if (error) {
            console.error('Error fetching objects:', error);
        }
    }

    handleObjectChange({ detail: { value } }) {
        this.selectedObject = value;
        this.selectedFields = ['Id', 'Name'];

        getFields({ objectName: value })
            .then(data => this.fieldOptions = data.map(({ label, apiName }) => ({ label, value: apiName })))
            .catch(console.error);
    }

    handleFieldChange({ detail: { value } }) {
        this.selectedFields = [...new Set(['Id', 'Name', ...value])];
    }

    handleExport() {
        initiateExport({ objectName: this.selectedObject, fields: this.selectedFields })
            .then(result => this.jobId = result)
            .catch(console.error);
    }
}
