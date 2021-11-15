import { LightningElement, wire } from "lwc";
import { NavigationMixin } from "lightning/navigation";

import {
  // publish,
  subscribe,
  MessageContext,
  unsubscribe
} from "lightning/messageService";
import PRODUCTS_FILTERED_MESSAGE from "@salesforce/messageChannel/ProductsFiltered__c";
// import PRODUCT_SELECTED_MESSAGE from "@salesforce/messageChannel/ProductSelected__c";
import getProducts from "@salesforce/apex/ProductController.getProducts";

export default class ProductsList extends NavigationMixin(LightningElement) {
  filters = {
    searchKey: ""
  };
  productId;

  @wire(MessageContext) messageContext;
  //   @wire(getProducts, { filters: '$filters' })
  products;
  subscription;

  connectedCallback() {
    this.subscription = subscribe(
      this.messageContext,
      PRODUCTS_FILTERED_MESSAGE,
      (message) => this.handleFilterChange(message)
    );
    getProducts({ filters: this.filters }).then((result) => {
      this.products = result.records;
    });
  }

  disconnectedCallback() {
    unsubscribe(this.subscription);
  }

  handleFilterChange(message) {
    this.filters = { ...message.filters };
    getProducts({ filters: this.filters }).then((result) => {
      this.products = result.records;
    });
  }

  handleProductSelected(event) {
    const productId = event.currentTarget.dataset.value;
    const selectedProduct = this.products.filter(
      (item) => item.Id === productId && item
    )[0];
    event.preventDefault();
    // this.productId = event.currentTarget.dataset.value;
    // publish(this.messageContext, PRODUCT_SELECTED_MESSAGE, {
    //   productId: this.productId
    // });
    this[NavigationMixin.Navigate]({
      type: "standard__navItemPage",
      attributes: {
        apiName: "Product_View",
        product: selectedProduct
      }
    });
  }
}
