import { LightningElement } from "lwc";
import getProducts from "@salesforce/apex/ProductController.getProducts";

export default class Main extends LightningElement {
  error;
  price = 1000;
  brand = [""];
  size;
  filters = {
    searchKey: ""
  };

  isModalOpen = false;
  clickedProductId;

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
  }

  clickedProduct;
  handleClickedProduct(e) {
    const clickedProductId = e.detail;
    this.products.forEach((item) => {
      if (item.Id === clickedProductId) {
        this.clickedProduct = item;
        this.isModalOpen = !this.isModalOpen;
      }
    });
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

  openModal() {
    this.isModalOpen = true;
  }
  closeModal() {
    this.isModalOpen = false;
  }
  submitDetails() {
    this.isModalOpen = false;
  }
}
