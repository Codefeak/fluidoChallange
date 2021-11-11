import { LightningElement, api } from "lwc";
import SVG_LOGO from "@salesforce/resourceUrl/logo";

export default class Header extends LightningElement {
  svgURL = `${SVG_LOGO}#logo`;
  @api isCartOpen;

  handleCartClick() {
    this.dispatchEvent(new CustomEvent("togglecart"));
  }

  handleOrderHistoryClick() {
    this.dispatchEvent(new CustomEvent("openorderhistory"));
  }
}
