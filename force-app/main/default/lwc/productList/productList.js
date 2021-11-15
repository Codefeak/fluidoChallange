import { LightningElement } from "lwc";
// import getProducts from '@salesforce/apex/ProductController.getProducts';

export default class ProductList extends LightningElement {
  handleOnClick(e) {
    const productId = e.currentTarget.dataset.value;
    this.dispatchEvent(
      new CustomEvent("productclicked", { detail: productId })
    );
  }
}
