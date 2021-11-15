public class ProductLists {
  @AuraEnabled(Cacheable=true)
  public static List<Product__c> viewAllProducts() {
    List<Product__c> listOfProducts = [
      SELECT
        price__c,
        category__c,
        width__c,
        Name,
        Id,
        heel_height__c,
        gender__c,
        brand__c,
        color__c,
        size__c,
        imageUrl__c
      FROM Product__c
      LIMIT 100
    ];
    return listOfProducts;
  }
}
