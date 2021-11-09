public class OrderController {
  static Integer PAGE_SIZE = 9;

  @AuraEnabled
  public static void addOrderItems(CustomProduct__c item) {
    try {
      Id accId = [
        SELECT contact.AccountId
        FROM User
        WHERE Id = :Userinfo.getUserId()
      ]
      .Id;
      CustomOrder__c order = new CustomOrder__c(Account__c = accId);
      insert order;
      Order_Line_Item__c orderItemLine = new Order_Line_Item__c(
        CustomOrder__c = order.Id,
        CustomProduct__c = item.Id
      );
      insert orderItemLine;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
  @AuraEnabled
  public static PagedResult getOrderItems() {
    try {
      Integer pageNumber = 1;
      String key, size, whereClause = '';
      Integer pageSize = OrderController.PAGE_SIZE;
      Integer offset = (pageNumber - 1) * pageSize;
      PagedResult result = new PagedResult();
      result.pageSize = pageSize;
      result.pageNumber = pageNumber;
      result.totalItemCount = Database.countQuery(
        'SELECT count() FROM Order_Line_Item__c ' + whereClause
      );
      result.records = Database.query(
        'SELECT Id, CustomOrder__c, CustomProduct__c FROM Order_Line_Item__c ' +
        whereClause +
        ' WITH SECURITY_ENFORCED' +
        ' LIMIT :pageSize OFFSET :offset'
      );
      return result;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static void deleteOrderItems(Id orderId) {
    try {
      Order_Line_Item__c[] itemToBeDeleted = [
        SELECT Id, CustomOrder__c
        FROM Order_Line_Item__c
        WHERE Id = :orderId
      ];
      system.debug(itemToBeDeleted);
      // delete itemToBeDeleted;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
