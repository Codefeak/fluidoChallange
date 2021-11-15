import { LightningElement } from "lwc";
import { NavigationMixin } from "lightning/navigation";
import SVG_LOGO from "@salesforce/resourceUrl/logo";

export default class HeaderComponent extends NavigationMixin(LightningElement) {
  svgURL = `${SVG_LOGO}#logo`;

  handleOnClickCartView() {
    this[NavigationMixin.Navigate]({
      type: "standard__navItemPage",
      attributes: {
        apiName: "Cart_View"
      }
    });
  }

  handleOnClickProductList() {
    this[NavigationMixin.Navigate]({
      type: "standard__navItemPage",
      attributes: {
        apiName: "Lightning_Steps"
      }
    });
  }

  handleOrderHistoryClick() {
    this[NavigationMixin.Navigate]({
      type: "standard__navItemPage",
      attributes: {
        apiName: "Order_History"
      }
    });
  }
}
