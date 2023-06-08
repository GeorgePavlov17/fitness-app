// import { Component, OnInit, OnDestroy } from "@angular/core";
// import { ProductsService } from "./products.service";
// import { Subscription } from "rxjs";

// @Component({
//     selector: 'app-products',
//     templateUrl: './products.component.html'
// })

// export class ProductsComponent implements OnInit, OnDestroy {
//     productName = 'a book';
//     isDisabled = true;
//     products: string[] = [];
//     private productsSubscription?: Subscription;

//     constructor(private productsService: ProductsService) {

//         setTimeout(() => {
//             // this.productName = 'a tree';
//             this.isDisabled = false;
//         }, 2000);
//     }

//     ngOnInit(): void {
//         this.products = this.productsService.getProduct();
//         this.productsSubscription = this.productsService.productsUpdated.subscribe(() => {
//             this.products = this.productsService.getProduct();
//         });
//     }

//     onAddProduct(form: any) {
//         // this.products.push(this.productName);
//         if(form.valid) {
//             // this.products.push(form.value.productName);
//             this.productsService.addProduct(form.value.productName);
//         }
//     }

//     onRemoveProduct(productName: string) {
//         this.products = this.products.filter(p => p !== productName);
//     }

//     ngOnDestroy(): void {
//         this.productsSubscription?.unsubscribe();
//     }
// }