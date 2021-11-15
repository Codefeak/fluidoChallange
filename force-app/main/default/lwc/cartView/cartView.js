import { LightningElement, track } from "lwc";
import getActiveOrder from "@salesforce/apex/OrderController.getActiveOrder";
import getOrderItems from "@salesforce/apex/OrderController.getOrderItems";
import getProducts from "@salesforce/apex/ProductController.getProducts";
import makeOrder from "@salesforce/apex/OrderController.makeOrder";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class CartView extends LightningElement {
  activeOrderId;
  @track cartProducts;
  products;
  filters = {
    searchKey: ""
  };
  connectedCallback() {
    this.cbGetProducts();
    this.cbGetActiveOrder();
  }
  cbGetActiveOrder() {
    getActiveOrder().then((result) => {
      this.cbGetOrderItems(result);
      this.activeOrderId = result;
    });
  }
  cbGetProducts() {
    getProducts({ filters: this.filters }).then((response) => {
      this.products = response.records;
    });
  }
  cbGetOrderItems(value) {
    getOrderItems({ orderId: value }).then((result) => {
      const newRecords = result.records;
      const newResult = newRecords.map((item) => {
        const foundProduct = this.products.find(
          (ele) => ele.Id === item.Product__c
        );
        return {
          ...foundProduct,
          orderLineItemId: item.Id,
          orderId: item.CustomOrder__c
        };
      });

      this.cartProducts = {
        records: newResult,
        totalPrice: this.calculateTotalPrice(newResult)
      };
      this.cartProductCount = result.totalItemCount;
    });
  }

  calculateTotalPrice(cartItems) {
    let sum = 0;
    cartItems.forEach((item) => {
      sum += Number(item.price__c);
    });
    return sum;
  }

  handleMakeOrder() {
    const orderId = this.cartProducts.records[0].orderId;
    makeOrder({ orderId: orderId });
    this.showToast(
      "Success",
      "Order successfully made navigate back to Product List"
    );
  }

  showToast(title, message) {
    const event = new ShowToastEvent({
      title: title,
      message: message
    });
    this.dispatchEvent(event);
  }
}
