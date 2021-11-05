import { api, LightningElement } from 'lwc';

export default class Product extends LightningElement {
    _product;

    @api
    get product() {
        return this._product;
    }

    set product(value) {
        this._product = value;
        this.imageUrl = value.imageUrl__c;
        this.name = value.Name;
        this.price = value.price__c;
        this.category = value.category__c;
        this.width = value.width__c;
        this.heelHeight = value.heel_height__c;
        this.gender = value.gender__c;
        this.brand = value.brand__c;
        this.size = value.size__c;
        this.color = value.color__c;
    }

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

    handleOnClick() {
        const selectedEvent = new CustomEvent('selected', {
            detail: this.product.Id
        });
        this.dispatchEvent(selectedEvent);
    }
}