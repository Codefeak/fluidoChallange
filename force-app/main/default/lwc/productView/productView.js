import { LightningElement, wire, track } from "lwc";
import { NavigationMixin, CurrentPageReference } from "lightning/navigation";
// import { subscribe,  unsubscribe,  MessageContext} from "lightning/messageService";
import getProduct from "@salesforce/apex/ProductController.getProduct";
// import PRODUCT_SELECTED_MESSAGE from "@salesforce/messageChannel/ProductSelected__c";
import createNewOrder from "@salesforce/apex/OrderController.createNewOrder";
import addOrderItems from "@salesforce/apex/OrderController.addOrderItems";
import getActiveOrder from "@salesforce/apex/OrderController.getActiveOrder";
import { ShowToastEvent } from "lightning/platformShowToastEvent";

export default class ProductView extends NavigationMixin(LightningElement) {
  @wire(CurrentPageReference) pageRef;
  //   @wire(MessageContext) messageContext;
  product;
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
  subscription;
  @track activeOrderId;

  connectedCallback() {
    this.callbackGetActiveOrder();
    if (this.pageRef !== undefined) {
      const product = this.pageRef.attributes.product;
      this.setValues(product);
    }
    // this.subscription = subscribe(
    //   this.messageContext,
    //   PRODUCT_SELECTED_MESSAGE,
    //   (message) => console.log(message) || this.handleSelectedProduct(message.productId)
    // );
  }

  callbackGetActiveOrder() {
    getActiveOrder().then((result) => {
      this.activeOrderId = result;
    });
  }

  //   disconnectedCallback() {
  //     unsubscribe(this.subscription);
  //   }

  handleSelectedProduct(productId) {
    getProduct({ productId: productId }).then((result) => {
      this.setValues(result);
    });
  }

  setValues(value) {
    this.product = value;
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

  handleCancel() {
    this[NavigationMixin.Navigate]({
      type: "standard__navItemPage",
      attributes: {
        apiName: "Lightning_Steps"
      }
    });
  }

  handleAddToCart() {
    // eslint-disable-next-line no-unused-vars
    if (this.activeOrderId === undefined) {
      createNewOrder().then((result) => {
        addOrderItems({ productId: this.product.Id, orderId: result });
      });
      this.callbackGetActiveOrder();
      this.showToast("Success", "product added to the cart");
    } else {
      addOrderItems({
        productId: this.product.Id,
        orderId: this.activeOrderId
      });
      this.showToast("Success", "product added to the cart");
    }
  }

  showToast(title, message) {
    const event = new ShowToastEvent({
      title: title,
      message: message
    });
    this.dispatchEvent(event);
  }
}
