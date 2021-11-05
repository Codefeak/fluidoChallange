public class ProductController {
    static Integer PAGE_SIZE = 100;
    public class Filters {
        @AuraEnabled
        public String searchKey {get; set;}
        @AuraEnabled
        public Decimal maxPrice {get; set;}
        @AuraEnabled
        public Decimal size {get; set;}
        @AuraEnabled
        public Decimal heelHeight {get; set;}
        @AuraEnabled
        public String category {get; set;}
        @AuraEnabled
        public String[] brand {get; set;}
        @AuraEnabled
        public String color {get; set;}
        @AuraEnabled
        public String width {get; set;}
        @AuraEnabled
        public String gender {get; set;}
    }

    @AuraEnabled(Cacheable=true)
    public static PagedResult getProducts(Filters filters) {
        Integer pageNumber = 1;
        String key, whereClause = '';
        Decimal maxPrice, size, heelHeight;
        String category, color, width, gender;
        String[] criteria, brand = new List<String>{};
        if(filters != null) {
            system.debug(filters);
            maxPrice = filters.maxPrice;
			size = filters.size;
            heelHeight = filters.heelHeight;
            brand = filters.brand;
            color = filters.color;
            width = filters.width;
            gender = filters.gender;
            if (!String.isEmpty(filters.searchKey)) {
                key = '%' + filters.searchKey + '%';
                criteria.add('Name LIKE :key');
            }
            if (filters.maxPrice >= 0) {
                maxPrice = filters.maxPrice;
                criteria.add('price__c <= :maxPrice');
            }
            if (filters.size >= 0) {
                size = filters.size;
                criteria.add('size__c <= :size');
            }
            if (filters.heelHeight >= 0) {
                heelHeight = filters.heelHeight;
                criteria.add('heel_height__c <= :heelHeight');
            }
            if (!String.isEmpty(filters.category)){
                key = '%' + filters.category + '%';
                criteria.add('category__c LIKE :key');
            }
            if (filters.brand != null){
                brand = filters.brand;
                criteria.add('brand__c IN :brand');
            }
            if (!String.isEmpty(filters.color)){
                key = '%' + filters.color + '%';
                criteria.add('color__c LIKE :key');
            }
            if (!String.isEmpty(filters.width)){
                key = '%' + filters.width + '%';
                criteria.add('width__c LIKE :key');
            }
            if (!String.isEmpty(filters.gender)){
                key = '%' + filters.gender + '%';
                criteria.add('gender__c LIKE :key');
            }
            system.debug(String.join(criteria, 'AND '));
            if (criteria.size() > 0) {
                whereClause = 'WHERE ' + String.join(criteria, ' AND ');
            }
        }
        
        Integer pageSize = ProductController.PAGE_SIZE;
        Integer offset = (pageNumber - 1) * pageSize; 
        PagedResult result = new PagedResult();
        result.totalItemCount = Database.countQuery(
            'SELECT count() FROM CustomProduct__c ' + whereClause
        );
        result.records = Database.query(
        	'SELECT Id, Name FROM CustomProduct__c ' +
            whereClause +
            ' WITH SECURITY_ENFORCED' +
            ' ORDER BY Name LIMIT :pageSize OFFSET :offset'
        );
        
        return result;
    } 
}