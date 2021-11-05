import { LightningElement, api } from 'lwc';
import {NavigationMixin} from 'lightning/navigation';
import viewAllProducts from '@salesforce/apex/ProductLists.viewAllProducts';

export default class ProductList extends NavigationMixin(LightningElement) {
    @api products;
    error;
    connectedCallback()
    {this.getProducts()};

    getProducts() {
       viewAllProducts()
        .then(result => {
            this.get
            this.products = result;
        })
        .catch(err => {
            this.error = err;
        })
        // console.log(this.products);
    };


    handleOnClick() {
        alert("button pressed")
    }

}