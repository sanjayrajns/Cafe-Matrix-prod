// Menu categories and items data
import pizzaImg from "@/assets/menu/pizza-featured.jpg";
import burgerImg from "@/assets/menu/burger-featured.jpg";
import sandwichImg from "@/assets/menu/sandwich-featured.jpg";
import momosImg from "@/assets/menu/momos-featured.jpg";
import startersImg from "@/assets/menu/starters-featured.jpg";
import spiralsImg from "@/assets/menu/spirals-featured.jpg";
import dessertsImg from "@/assets/menu/desserts-featured.jpg";
import granitasImg from "@/assets/menu/granitas-featured.jpg";
import mojitosImg from "@/assets/menu/mojitos-featured.jpg";
import milkshakesImg from "@/assets/menu/milkshakes-featured.jpg";
import lassiImg from "@/assets/menu/lassi-featured.jpg";
import frappeImg from "@/assets/menu/frappe-featured.jpg";
import pastriesImg from "@/assets/menu/pastries-featured.jpg";

export const categories = [
  { id: "pizza", label: "Pizza" },
  { id: "burgers", label: "Burgers" },
  { id: "desserts", label: "Desserts" },
  { id: "mojitos", label: "Mojitos" },
  { id: "milkshakes", label: "Shakes" },
];

export const menuItems: Record<string, { name: string; price: number; featured?: boolean }[]> = {
  pizza: [
    { name: "Margarita Pizza", price: 99 },
    { name: "Cheese Corn", price: 160, featured: true },
    { name: "Paneer Tikka", price: 240, featured: true },
    { name: "Matrix Special", price: 260, featured: true },
  ],
  burgers: [
    { name: "Classic Veg Burger", price: 69 },
    { name: "Spicy Salsa Burger", price: 89, featured: true },
    { name: "Peri-Peri Paneer Burger", price: 119, featured: true },
    { name: "Matrix Special Burger", price: 149, featured: true },
  ],
  desserts: [
    { name: "Chocolate Brownie", price: 90 },
    { name: "Brownie Fudge", price: 120, featured: true },
    { name: "Brownie with Ice-Cream", price: 140, featured: true },
    { name: "Sizzling Brownie", price: 160, featured: true },
  ],
  mojitos: [
    { name: "Blue Heaven", price: 69, featured: true },
    { name: "Lemon Mint", price: 69, featured: true },
    { name: "Green Apple", price: 59 },
    { name: "Strawberry", price: 59 },
  ],
  milkshakes: [
    { name: "Chocolava", price: 80, featured: true },
    { name: "Kit-Kat", price: 80, featured: true },
    { name: "Oreo Blast", price: 85, featured: true },
    { name: "Strawberry", price: 75 },
  ],
};

export const categoryImages: Record<string, string> = {
  pizza: pizzaImg,
  burgers: burgerImg,
  sandwich: sandwichImg,
  momos: momosImg,
  starters: startersImg,
  spirals: spiralsImg,
  desserts: dessertsImg,
  granitas: granitasImg,
  mojitos: mojitosImg,
  milkshakes: milkshakesImg,
  lassi: lassiImg,
  frappe: frappeImg,
  pastries: pastriesImg,
};
