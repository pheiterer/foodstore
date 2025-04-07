import { Injectable } from '@angular/core';
import { CartItem } from '../shared/models/CartItem';
import { Cart } from '../shared/models/Cats';
import { BehaviorSubject, Observable } from 'rxjs';
import { Food } from '../shared/models/Food';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cart: Cart = this.getCartFromLocalStorage();
  private cartSubject: BehaviorSubject<Cart> = new BehaviorSubject<Cart>(this.cart);
  constructor() { }

  addToCart(food: Food):void{
    let cartItem = this.cart.items.find(item => item.food.id === food.id);
    if(cartItem){
      return;
    }

    this.cart.items.push(new CartItem(food));
    this.setCartToLocalStorage();
  }

  removeFromCart(foodId: string):void{
    this.cart.items = this.cart.items.filter(item => item.food.id !== foodId);
    this.setCartToLocalStorage();
  }

  changeQuantity(foodId: string, quantity: number):void{
    let cartItem = this.cart.items.find(item => item.food.id === foodId);
    if(cartItem){
      cartItem.quantity = quantity;
      cartItem.price = cartItem.food.price * quantity;
    }
    this.setCartToLocalStorage();
  }

  clearCart():void{
    this.cart = new Cart();
    this.setCartToLocalStorage();
  }

  getCartObservable(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  getCart(): Cart {
    return this.cartSubject.value;
  }

  private setCartToLocalStorage(): void {
    this.cart.totalPrice = this.cart.items.reduce((prev, curr) => prev + curr.price, 0);
    this.cart.totalCount = this.cart.items.reduce((prev, curr) => prev + curr.quantity, 0);
    localStorage.setItem('Cart', JSON.stringify(this.cart));
    this.cartSubject.next(this.cart);
  } 

  private getCartFromLocalStorage(): Cart {
    const cartData = localStorage.getItem('Cart');
    return cartData ? JSON.parse(cartData) : new Cart();
  }
}
