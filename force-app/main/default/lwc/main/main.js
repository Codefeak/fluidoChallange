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

  get brandOptions() {
    return [
      { label: "Timberland", value: "timberland" },
      { label: "Cat", value: "cat" },
      { label: "Adidas", value: "adidas" },
      { label: "Nike", value: "nike" },
      { label: "Fila", value: "fila" },
      { label: "Reboke", value: "reboke" }
    ];
  }
  get sizeOptions() {
    return [
      { label: "1.0", value: "1.0" },
      { label: "1.5", value: "1.5" },
      { label: "2.0", value: "2.0" },
      { label: "2.5", value: "2.5" },
      { label: "3.0", value: "3.0" },
      { label: "3.5", value: "3.5" },
      { label: "4.0", value: "4.0" },
      { label: "4.5", value: "4.5" },
      { label: "5.0", value: "5.0" },
      { label: "5.5", value: "5.5" },
      { label: "6.0", value: "6.0" },
      { label: "6.5", value: "6.5" },
      { label: "7.0", value: "7.0" },
      { label: "7.5", value: "7.5" },
      { label: "8.0", value: "8.0" },
      { label: "8.5", value: "8.5" },
      { label: "9.0", value: "9.0" },
      { label: "9.5", value: "9.5" },
      { label: "10.0", value: "10.0" },
      { label: "10.5", value: "10.5" },
      { label: "11.0", value: "11.0" }
    ];
  }

  get selectedBrandValues() {
    const result = this.brand.map((i) => {
      return { label: i, value: i };
    });
    return result;
  }

  handleBrandChange(e) {
    this.brand = e.target.value;
    this.filters.brand = this.brand;
    if (this.filters.brand.length <= 0) {
      delete this.filters.brand;
      this.productListQuery(this.filters);
    }
    this.productListQuery(this.filters);
  }

  handleSearchByNameChange(e) {
    this.filters.searchKey = e.target.value;
    this.productListQuery(this.filters);
  }

  handleOnPriceChange(e) {
    this.filters.price = e.target.value;
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
