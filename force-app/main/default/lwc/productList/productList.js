import { LightningElement, api } from 'lwc';
import {NavigationMixin} from 'lightning/navigation';
// import getProducts from '@salesforce/apex/ProductController.getProducts';

export default class ProductList extends NavigationMixin(LightningElement) {
    @api productsFromParent;

    handleOnClick() {
        alert("button pressed")
    }

}