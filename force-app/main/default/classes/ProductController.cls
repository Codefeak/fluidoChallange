public class ProductController {
  static Integer PAGE_SIZE = 9;
  public class Filters {
    @AuraEnabled
    public String searchKey { get; set; }
    @AuraEnabled
    public Decimal price { get; set; }
    @AuraEnabled
    public String size { get; set; }
    @AuraEnabled
    public Decimal heelHeight { get; set; }
    @AuraEnabled
    public String category { get; set; }
    @AuraEnabled
    public String[] brand { get; set; }
    @AuraEnabled
    public String color { get; set; }
    @AuraEnabled
    public String width { get; set; }
    @AuraEnabled
    public String gender { get; set; }
  }

  @AuraEnabled(Cacheable=true)
  public static PagedResult getProducts(Filters filters) {
    Integer pageNumber = 1;
    String key, size, whereClause = '';
    Decimal price, heelHeight;
    String category, color, width, gender;
    String[] brand, criteria = new List<String>{};
    if (filters != null) {
      price = filters.price;
      size = filters.size;
      heelHeight = filters.heelHeight;
      brand = filters.brand;
      color = filters.color;
      width = filters.width;
      gender = filters.gender;
      if (!String.isEmpty(filters.searchKey)) {
        key = '%' + filters.searchKey + '%';
        criteria.add(
          '(Name LIKE :key OR category__c LIKE :key OR gender__c LIKE :key OR color__c LIKE :key OR brand__c LIKE :key)'
        );
      }
      if (filters.price >= 0) {
        price = filters.price;
        criteria.add('price__c <= :price');
      }
      if (!String.isEmpty(filters.size)) {
        size = filters.size;
        criteria.add('size__c <= :size');
      }
      if (filters.heelHeight >= 0) {
        heelHeight = filters.heelHeight;
        criteria.add('heel_height__c <= :heelHeight');
      }
      if (!String.isEmpty(filters.category)) {
        key = '%' + filters.category + '%';
        criteria.add('category__c LIKE :key');
      }
      if (filters.brand != null) {
        brand = filters.brand;
        criteria.add('brand__c IN :brand');
      }
      if (!String.isEmpty(filters.color)) {
        key = '%' + filters.color + '%';
        criteria.add('color__c LIKE :key');
      }
      if (!String.isEmpty(filters.width)) {
        key = '%' + filters.width + '%';
        criteria.add('width__c LIKE :key');
      }
      if (!String.isEmpty(filters.gender)) {
        key = '%' + filters.gender + '%';
        criteria.add('gender__c LIKE :key');
      }
      if (criteria.size() > 0) {
        whereClause = 'WHERE ' + String.join(criteria, ' AND ');
      }
    }

    Integer pageSize = ProductController.PAGE_SIZE;
    Integer offset = (pageNumber - 1) * pageSize;
    PagedResult result = new PagedResult();
    result.pageSize = pageSize;
    result.pageNumber = pageNumber;
    result.totalItemCount = Database.countQuery(
      'SELECT count() FROM Product__c ' + whereClause
    );
    result.records = Database.query(
      'SELECT Id, Name, price__c, color__c, size__c, brand__c, gender__c, width__c, heel_height__c, category__c, imageUrl__c FROM Product__c ' +
      whereClause +
      ' WITH SECURITY_ENFORCED' +
      ' ORDER BY Name LIMIT :pageSize OFFSET :offset'
    );

    return result;
  }

  @AuraEnabled
  public static Product__c getProduct(Id productId) {
    try {
      Product__c result = [
        SELECT
          Id,
          Name,
          price__c,
          color__c,
          size__c,
          brand__c,
          gender__c,
          width__c,
          heel_height__c,
          category__c,
          imageUrl__c
        FROM Product__c
        WHERE Id = :productId
      ];
      return result;
    } catch (Exception e) {
      throw new AuraHandledException(e.getMessage());
    }
  }
}
