public class OrderController {
  static Integer PAGE_SIZE = 9;

  @AuraEnabled
  public static void addOrderItems(Id productId, Id orderId) {
    try {
      Order_Line_Item__c orderItemLine = new Order_Line_Item__c(
        CustomOrder__c = orderId,
        Product__c = productId
      );
      insert orderItemLine;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static Id createNewOrder() {
    try {
      Id accId = [
        SELECT contact.AccountId
        FROM User
        WHERE Id = :Userinfo.getUserId()
      ]
      .Id;
      CustomOrder__c order = new CustomOrder__c(Account__c = accId);
      insert order;
      return order.Id;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static PagedResult getOrderItems(Id orderId) {
    try {
      Integer pageNumber = 1;
      String key, size, whereClause = 'WHERE CustomOrder__c = :orderId';
      Integer pageSize = OrderController.PAGE_SIZE;
      Integer offset = (pageNumber - 1) * pageSize;
      PagedResult result = new PagedResult();
      result.pageSize = pageSize;
      result.pageNumber = pageNumber;
      result.totalItemCount = Database.countQuery(
        'SELECT count() FROM Order_Line_Item__c ' + whereClause
      );
      result.records = Database.query(
        'SELECT Id, CustomOrder__c, Product__c FROM Order_Line_Item__c ' +
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
  public static void deleteOrderItems(Id orderLineItemId) {
    try {
      Order_Line_Item__c[] itemToBeDeleted = [
        SELECT Id
        FROM Order_Line_Item__c
        WHERE Id = :orderLineItemId
      ];
      delete itemToBeDeleted;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static void makeOrder(Id orderId) {
    try {
      List<CustomOrder__c> orderToMake = [
        SELECT Id
        FROM CustomOrder__c
        WHERE Id = :orderId
      ];
      for (CustomOrder__c item : orderToMake) {
        item.OrderMade__c = true;
        item.OrderMadeTimestamp__c = datetime.now();
      }
      update orderToMake;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static Id getActiveOrder() {
    try {
      CustomOrder__c orderToMake = [
        SELECT Id
        FROM CustomOrder__c
        WHERE OrderMade__c = FALSE
      ];
      return orderToMake.Id;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }

  @AuraEnabled
  public static PagedResult getOrderHistory() {
    try {
      Integer pageNumber = 1;
      String key, size, whereClause = 'WHERE OrderMade__c = true';
      Integer pageSize = OrderController.PAGE_SIZE;
      Integer offset = (pageNumber - 1) * pageSize;
      PagedResult result = new PagedResult();
      result.pageSize = pageSize;
      result.pageNumber = pageNumber;
      result.totalItemCount = Database.countQuery(
        'SELECT count() FROM CustomOrder__c ' + whereClause
      );
      result.records = Database.query(
        'SELECT Id, OrderMade__c, OrderMadeTimestamp__c FROM CustomOrder__c ' +
        whereClause +
        ' WITH SECURITY_ENFORCED' +
        ' LIMIT :pageSize OFFSET :offset'
      );
      return result;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
