import { LightningElement } from "lwc";
import getProducts from "@salesforce/apex/ProductController.getProducts";
import getOrderItems from "@salesforce/apex/OrderController.getOrderItems";
import deleteOrderItems from "@salesforce/apex/OrderController.deleteOrderItems";
import addOrderItems from "@salesforce/apex/OrderController.addOrderItems";
import createNewOrder from "@salesforce/apex/OrderController.createNewOrder";
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
          return {
            ...foundProduct,
            orderLineItemId: item.Id,
            orderId: item.CustomOrder__c
          };
        });

        this.cartProduct = {
          records: newResult,
          totalPrice: this.calculateTotalPrice(newResult)
        };
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
        if (this.cartProduct.records.length === 0) {
          createNewOrder()
            .then((result) => {
              addOrderItems({ item: item, orderId: result });
            })
            .catch((error) => (this.error = error));
          // eslint-disable-next-line no-alert
          alert("product added to the cart");
          this.closeModal();
        } else {
          const orderId = this.cartProduct.records[0].orderId;
          addOrderItems({ item: item, orderId: orderId });
          this.cartProductCount = this.cartProduct.records.length;
          // eslint-disable-next-line no-alert
          alert("product added to the cart");
          this.closeModal();
        }
      }
    });
    this.productListQuery(this.filters);
  }

  handleRemoveFromCart(e) {
    const orderLineItemId = e.detail.orderLineItemId;
    deleteOrderItems({ orderLineItemId: orderLineItemId });
    // eslint-disable-next-line no-alert
    alert("product removed from the cart");
    this.closeModal();
    this.productListQuery(this.filters);
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

  calculateTotalPrice(cartItems) {
    let sum = 0;
    cartItems.forEach((item) => {
      sum += Number(item.price__c);
    });
    return sum;
  }

  handleMakeOrder() {
    console.log("this is amke an order");
  }
}
