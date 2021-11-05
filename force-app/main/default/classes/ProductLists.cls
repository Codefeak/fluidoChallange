public class ProductLists {
    @AuraEnabled(Cacheable=true)
    public static List<CustomProduct__c> viewAllProducts() {
        List<CustomProduct__c> listOfProducts = [SELECT price__c, category__c, width__c, Name, Id, heel_height__c, gender__c, brand__c, color__c, size__c, imageUrl__c FROM CustomProduct__c LIMIT 1000]; 
        return listOfProducts;
    }
}