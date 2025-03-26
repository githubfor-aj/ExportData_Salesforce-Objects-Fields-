import { LightningElement, track, wire } from 'lwc';
import getObjects from '@salesforce/apex/ExportUtility.getObjects';
import getFields from '@salesforce/apex/ExportUtility.getFields';
import initiateExport from '@salesforce/apex/ExportUtility.initiateExport';
import getJobStatus from '@salesforce/apex/ExportUtility.getJobStatus';
import './exportUtility.css';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class ExportUtility extends LightningElement {
    @track objectOptions = [];
    @track fieldOptions = [];
    @track selectedObject = '';
    @track selectedFields = ['Id', 'Name'];
    @track exportJobId = '';
    @track jobStatus = '';
   
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
        if (!this.selectedObject || this.selectedFields.length === 0) {
            this.showToast('Error', 'Please select an object and at least one field', 'error');
            return;
        }

        // Initiate Export
        initiateExport({ objectName: this.selectedObject, fields: this.selectedFields })
            .then(jobId => {
                this.exportJobId = jobId;
                this.showToast('Success', 'Export initiated successfully', 'success');
                this.trackJobStatus();
            })
            .catch(() => {
                this.showToast('Error', 'Failed to initiate export', 'error');
            });
    }

    // Track Job Status
    trackJobStatus() {
        if (!this.exportJobId) return;

        getJobStatus({ jobId: this.exportJobId })
            .then(status => {
                this.jobStatus = status;
                if (status !== 'Completed' && status !== 'Failed') {
                    setTimeout(() => this.trackJobStatus(), 3000); // Poll every 3 seconds
                }
            })
            .catch(() => {
                this.showToast('Error', 'Failed to fetch job status', 'error');
            });
    }

    // Show Toast Message
    showToast(title, message, variant) {
        this.dispatchEvent(new ShowToastEvent({ title, message, variant }));
    }
}