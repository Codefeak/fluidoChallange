import { api, LightningElement } from "lwc";

export default class Product extends LightningElement {
  @api productFromParent;
  imageUrl;
  name;
  price;
  category;
  width;
  heelHeight;
  gender;
  brand;
  size;
  color;

  connectedCallback() {
    this.setValues(this.productFromParent);
  }

  setValues(value) {
    this.imageUrl = value.imageUrl__c;
    this.name = value.Name;
    this.price = value.price__c;
    this.category = value.category__c;
    this.width = value.width__c.slice(0, 1);
    this.heelHeight = value.heelHeight__c;
    this.gender = value.gender__c;
    this.brand = value.brand__c;
    this.size = value.size__c;
    this.color = value.color__c;
  }

  handleOnClick() {
    console.log("i reached here");
    console.log(this.productFromParent.imageUrl__c);
  }
}
