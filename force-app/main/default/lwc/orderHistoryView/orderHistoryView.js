import { LightningElement, track } from "lwc";
import getOrderHistory from "@salesforce/apex/OrderController.getOrderHistory";

export default class OrderHistoryView extends LightningElement {
  @track orderHistoryItems;
  connectedCallback() {
    this.callback();
  }

  callback() {
    getOrderHistory().then((result) => {
      this.orderHistoryItems = result.records;
    });
  }
}
