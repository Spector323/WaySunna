import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import axios from "axios";

@Injectable({
  providedIn: "root",
})
export class ProductSericeService {
  private products: any = [];
  private basket: any = [];
  apiUrl = "http://localhost:5000/product";

  constructor(private http: HttpClient) {

  }
  async getProducts() {
    try {
      const res = await fetch(`${this.apiUrl}/products`)
        .then((res) => res.json())
        .then((data) => (this.products = data));
    } catch {
      console.error();
    }
    return this.products;
  }
  async delProduct(id: any) {
    
    try {
      await axios.delete(`${this.apiUrl}/product/delproduct/${id}`);
    } catch (error) {
      console.log(error);
    }
  }
  async getProduct(id: any) {
    try {
      let res = await axios.get(`${this.apiUrl}/product/${id}`);
      return res.data;
    } catch (error) {
      console.log(error);
      return error;
    }
  }

  getBasket(): any[] {
    const storedBasket = localStorage.getItem("basket");
    if (storedBasket) {
      this.basket = JSON.parse(storedBasket);
    } else {
      this.basket = [];
    }
    return this.basket;
  }

  addProductBasket(product: any) {
    if (!this.basket.some((prod: any) => prod.id == product.id)) {
      let productBasket = {
        id: product.id,
        name: product.name,
        image: product.image,
        price: product.price,
        countBasket: 1,
      };
      this.basket.push(productBasket);
      localStorage.setItem("basket", JSON.stringify(this.basket));
    }
  }
  removeProductBasket(product: any) {
    const index = this.basket.findIndex((prod: any) => prod.id === product.id);
    if (index !== -1) {
      this.basket.splice(index, 1);
      localStorage.setItem("basket", JSON.stringify(this.basket));
    }
  }
 async editProduct(product: any, token: string) {
  const headers = {
    Authorization: `Bearer ${token}`,
    'Content-type' : 'application/json; charset=utf-8'
  };
    try {
      let res = await axios.patch(
        `http://localhost:5000/product/update/${product._id}`,
        {
          name: product.name,
          price: product.price,
          description: product.description
        },
        {
          headers
        }
      );
      return res;
    } catch (error) {
      console.log(error);
      return error
    }
  }
  addProduct(productName: any, productPrice: any, productDescription: any, productImage: any, token: any) {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`,
      'Content-type': 'application/json; charset=utf-8'
    })
    const formData = new FormData();
    formData.append('name', productName);
    formData.append('price', productPrice);
    formData.append('description', productDescription);
    formData.append('image[]', productImage);
  
    return this.http.post("http://localhost:5000/product/addProduct", formData);
  }
}
