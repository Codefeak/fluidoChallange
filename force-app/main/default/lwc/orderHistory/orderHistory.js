import { LightningElement } from "lwc";

export default class OrderHistory extends LightningElement {
  viewCartItems() {
    this.dispatchEvent(new CustomEvent("viewcartitems"));
  }
}
