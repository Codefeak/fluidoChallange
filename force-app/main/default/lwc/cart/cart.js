import { LightningElement, api } from "lwc";

export default class Cart extends LightningElement {
  @api cartItemFromParent;

  handleOnClick(e) {
    const orderLineItemId = e.currentTarget.dataset.value;
    const productId = this.cartItemFromParent.find(
      (i) => i.orderLineItemId === orderLineItemId
    ).Id;
    this.dispatchEvent(
      new CustomEvent("productclicked", {
        detail: { Id: productId, orderLineItemId: orderLineItemId }
      })
    );
  }
}
