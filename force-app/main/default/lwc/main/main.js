import { LightningElement } from "lwc";
import getProducts from "@salesforce/apex/ProductController.getProducts";
import getOrderItems from "@salesforce/apex/OrderController.getOrderItems";
import deleteOrderItems from "@salesforce/apex/OrderController.deleteOrderItems";
import addOrderItems from "@salesforce/apex/OrderController.addOrderItems";

export default class Main extends LightningElement {
  error;
  price = 1000;
  brand = [""];
  size;
  filters = {
    searchKey: ""
  };

  isModalOpen = false;
  isCartOpen = false;
  clickedProductId;
  clickedOrderLineId;
  cartProduct;
  cartProductCount;

  connectedCallback() {
    this.productListQuery(this.filters);
  }

  products;
  productListQuery(filters) {
    getProducts({ filters: filters })
      .then((result) => {
        this.products = result.records;
      })
      .catch((error) => (this.error = error));
    getOrderItems()
      .then((result) => {
        const newRecords = result.records;
        const newResult = newRecords.map((item) => {
          const foundProduct = this.products.find(
            (ele) => ele.Id === item.CustomProduct__c
          );
          return { ...foundProduct, orderLineItemId: item.Id };
        });
        this.cartProduct = newResult;
        this.cartProductCount = result.totalItemCount;
      })
      .catch((error) => (this.error = error));
  }

  clickedProduct;
  handleClickedProduct(e) {
    this.clickedProductId = e.detail;
    this.products.forEach((item) => {
      if (item.Id === this.clickedProductId) {
        this.clickedProduct = item;
        this.isModalOpen = !this.isModalOpen;
      }
    });
  }

  handleClickedCartProduct(e) {
    console.log(JSON.stringify(e.detail));
    this.clickedProductId = e.detail.Id;
    this.clickedOrderLineId = e.detail.orderLineItemId;
    this.products.forEach((item) => {
      if (item.Id === this.clickedProductId) {
        this.clickedProduct = item;
        this.isModalOpen = !this.isModalOpen;
      }
    });
  }

  handleAddToCart() {
    this.products.forEach((item) => {
      if (item.Id === this.clickedProductId) {
        addOrderItems({ item: item });
        this.cartProductCount = this.cartProduct.length;
        // eslint-disable-next-line no-alert
        alert("product added to the cart");
        this.closeModal();
      }
    });
  }

  handleRemoveFromCart() {
    console.log("I reached here", this.clickedOrderLineId);
    deleteOrderItems({ orderId: this.clickedOrderLineId });
    // eslint-disable-next-line no-alert
    alert("product removed from the cart");
    this.closeModal();
  }

  handleBrandChange(e) {
    this.brand = e.detail.target.value;
    this.filters.brand = this.brand;
    if (this.filters.brand.length <= 0) {
      delete this.filters.brand;
      this.productListQuery(this.filters);
    }
    this.productListQuery(this.filters);
  }

  handleSearchByNameChange(e) {
    this.filters.searchKey = e.detail.target.value;
    this.productListQuery(this.filters);
  }

  handleOnPriceChange(e) {
    this.filters.price = e.detail.target.value;
    this.productListQuery(this.filters);
  }

  handleOnSizeChange(e) {
    this.size = e.detail.value;
    this.filters.size = e.detail.value;
    this.productListQuery(this.filters);
  }

  closeModal() {
    this.isModalOpen = false;
  }

  toogleCart() {
    this.isCartOpen = !this.isCartOpen;
    this.productListQuery(this.filters);
  }
}
