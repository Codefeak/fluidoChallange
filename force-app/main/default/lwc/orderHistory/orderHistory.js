import { LightningElement } from "lwc";
import getOrderHistory from "@salesforce/apex/OrderController.getOrderHistory";

export default class OrderHistory extends LightningElement {
  orderHistoryItems;

  connectedCallback() {
    this.callback();
  }

  callback() {
    getOrderHistory().then((result) => {
      this.orderHistoryItems = result.records;
    });
  }
  viewCartItems() {
    this.dispatchEvent(new CustomEvent("viewcartitems"));
  }
}
