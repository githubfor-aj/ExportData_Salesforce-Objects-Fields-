public with sharing class ExportUtility {
    
    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getObjects() {
        List<Map<String, String>> objectList = new List<Map<String, String>>();
        
        try {
            for (Schema.SObjectType objType : Schema.getGlobalDescribe().values()) {
                Schema.DescribeSObjectResult objDesc = objType.getDescribe();
                objectList.add(new Map<String, String>{
                    'label' => objDesc.getLabel(),
                    'apiName' => objDesc.getName()
                });
            }
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching objects: ' + e.getMessage());
        }

        return objectList;
    }

    @AuraEnabled(cacheable=true)
    public static List<Map<String, String>> getFields(String objectName) {
        if (String.isEmpty(objectName)) {
            throw new AuraHandledException('Object name cannot be empty.');
        }

        List<Map<String, String>> fieldList = new List<Map<String, String>>();
        
        try {
            Schema.DescribeSObjectResult objDesc = Schema.getGlobalDescribe().get(objectName).getDescribe();
            
            for (Schema.SObjectField field : objDesc.fields.getMap().values()) {
                Schema.DescribeFieldResult fieldDesc = field.getDescribe();
                fieldList.add(new Map<String, String>{
                    'label' => fieldDesc.getLabel(),
                    'apiName' => fieldDesc.getName()
                });
            }
        } catch (Exception e) {
            throw new AuraHandledException('Error fetching fields: ' + e.getMessage());
        }

        return fieldList;
    }

    @AuraEnabled
    public static String initiateExport(String objectName, List<String> fields) {
        if (String.isEmpty(objectName) || fields == null || fields.isEmpty()) {
            throw new AuraHandledException('Invalid input: Object name and fields are required.');
        }

        try {
            return '707J1000022nRLo';
        } catch (Exception e) {
            throw new AuraHandledException('Error initiating export: ' + e.getMessage());
        }
    }

    @AuraEnabled(cacheable=false)
    public static String getJobStatus(String jobId) {
        if (String.isEmpty(jobId)) {
            throw new AuraHandledException('Invalid Job Id');
        }

        try {
            AsyncApexJob job = [SELECT Id, Status FROM AsyncApexJob WHERE Id = :jobId LIMIT 1];
            return job.Status;
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());

        }
    }

}
