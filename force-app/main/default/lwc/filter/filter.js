import { LightningElement, api } from 'lwc';
// import getProducts from '@salesforce/apex/ProductController.getProducts';

export default class Filter extends LightningElement {
    @api products;
    error;
    valPrice = 300;
    brand= [''];

    filters = {
        searchKey: '',
        price: 0
    }

    connectedCallback()
    {this.productListQuery()};

    productListQuery() {
        getProducts(this.filters).then(result => {
            this.products = results;
        }).catch(error => this.error = error);
    }

    get brandOptions() {

        return [
            {label: 'abc', value: 'abc'},
            {label: 'dkeo', value: 'dkeo'},
            {label: 'keke', value: 'keke'},
        ]
    }

    get selectedBrandValues () {
        const result = this.brand.map(i => {
            return {label: i, value: i}
        });
        return result;
    }

    handleBrandChange(e) {
        this.brand = e.target.value;
        this.filters.brand = e.target.value;
    }

    // handleSearchByNameChange(e) {
    //     this.filters.searchKey = e.target.value;
    // }

    // handleOnPriceChange(e) {
    //     this.filters.price = e.target.value;
    // }


}