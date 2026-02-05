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
  { id: "pizza", label: "🍕 Pizza", icon: "🍕" },
  { id: "burgers", label: "🍔 Burgers", icon: "🍔" },
  { id: "sandwich", label: "🥪 Sandwich", icon: "🥪" },
  { id: "momos", label: "🥟 Momos", icon: "🥟" },
  { id: "starters", label: "🍟 Starters", icon: "🍟" },
  { id: "spirals", label: "🌀 Spirals", icon: "🌀" },
  { id: "desserts", label: "🍰 Desserts", icon: "🍰" },
  { id: "granitas", label: "🧊 Granitas", icon: "🧊" },
  { id: "mojitos", label: "🍹 Mojitos", icon: "🍹" },
  { id: "milkshakes", label: "🥤 Shakes", icon: "🥤" },
  { id: "lassi", label: "🥭 Lassi", icon: "🥭" },
  { id: "frappe", label: "☕ Frappe", icon: "☕" },
  { id: "pastries", label: "🎂 Pastries", icon: "🎂" },
];

export const menuItems: Record<string, { name: string; price: number; featured?: boolean }[]> = {
  pizza: [
    { name: "Margarita Pizza", price: 99 },
    { name: "Cheese Corn", price: 160, featured: true },
    { name: "Garden Fresh", price: 180 },
    { name: "Corn Capsicum Onion", price: 190 },
    { name: "Veg Loaded", price: 220 },
    { name: "Spicy Paneer", price: 230 },
    { name: "Paneer Tikka", price: 240, featured: true },
    { name: "BBQ Paneer", price: 250 },
    { name: "Mushroom Pizza", price: 220 },
    { name: "Matrix Special", price: 260, featured: true },
    { name: "Extra Cheese / Topping", price: 40 },
  ],
  burgers: [
    { name: "Classic Veg Burger", price: 69 },
    { name: "Veg Cheese Burger", price: 79 },
    { name: "Spicy Salsa Burger", price: 89, featured: true },
    { name: "Tandoori Veg Burger", price: 99 },
    { name: "Paneer Cheese Burger", price: 109 },
    { name: "Peri-Peri Paneer Burger", price: 119, featured: true },
    { name: "Matrix Special Burger", price: 149, featured: true },
  ],
  sandwich: [
    { name: "Roasted Veg Sandwich", price: 69 },
    { name: "Tandoori Paneer Sandwich", price: 79, featured: true },
    { name: "Sweet Corn Sandwich", price: 79 },
    { name: "Spinach Corn Sandwich", price: 79 },
    { name: "Matrix Special Sandwich", price: 120, featured: true },
  ],
  momos: [
    { name: "Veg Momos", price: 70 },
    { name: "Corn Momos", price: 80 },
    { name: "Paneer Momos", price: 90, featured: true },
  ],
  starters: [
    { name: "Salted French Fries", price: 60 },
    { name: "Masala French Fries", price: 65 },
    { name: "Peri-Peri French Fries", price: 70, featured: true },
    { name: "Smilies", price: 70 },
    { name: "Veg Nuggets", price: 85 },
    { name: "Veggy Fingers", price: 90 },
    { name: "Cheese Potato Shots", price: 85, featured: true },
    { name: "Potato Wedges", price: 90 },
  ],
  spirals: [
    { name: "Salted Spiral", price: 35 },
    { name: "Masala Spiral", price: 45 },
    { name: "Peri-Peri Spiral", price: 50, featured: true },
    { name: "Tandoori Spiral", price: 50 },
  ],
  desserts: [
    { name: "Chocolate Brownie", price: 90 },
    { name: "Brownie Fudge", price: 120, featured: true },
    { name: "Fruit Sundae", price: 120 },
    { name: "Brownie with Ice-Cream", price: 140, featured: true },
    { name: "Sizzling Brownie", price: 160, featured: true },
  ],
  granitas: [
    { name: "Cool Blue", price: 60 },
    { name: "Blood Orange", price: 60 },
    { name: "Strawberry", price: 60 },
  ],
  mojitos: [
    { name: "Blue Heaven", price: 69, featured: true },
    { name: "Lemon Mint", price: 69, featured: true },
    { name: "Green Apple", price: 59 },
    { name: "Blue Berry", price: 59 },
    { name: "Mango", price: 59 },
    { name: "Strawberry", price: 59 },
    { name: "Orange", price: 59 },
    { name: "Lemon Soda", price: 40 },
  ],
  milkshakes: [
    { name: "Black Current", price: 75 },
    { name: "Blue Berry", price: 75 },
    { name: "Mango", price: 75 },
    { name: "Green Apple", price: 75 },
    { name: "Strawberry", price: 75 },
    { name: "Vanilla", price: 75 },
    { name: "Butter Scotch", price: 75 },
    { name: "Chocolava", price: 80, featured: true },
    { name: "Kit-Kat", price: 80, featured: true },
    { name: "Oreo Blast", price: 85, featured: true },
  ],
  lassi: [
    { name: "Salt Lassi", price: 39 },
    { name: "Sweet Lassi", price: 45 },
    { name: "Mango Lassi", price: 65, featured: true },
    { name: "Orange Lassi", price: 65 },
    { name: "Strawberry Lassi", price: 65 },
    { name: "Blackcurrent Lassi", price: 69 },
    { name: "Blue Berry Lassi", price: 69 },
    { name: "Green Apple Lassi", price: 69 },
    { name: "Chocolate Lassi", price: 75, featured: true },
  ],
  frappe: [
    { name: "Cold Coffee", price: 80 },
    { name: "Café Frappe", price: 110 },
    { name: "Choco Frappe", price: 110, featured: true },
    { name: "Crunchy Frappe", price: 110 },
    { name: "Almond Frappe", price: 110, featured: true },
    { name: "Devils Own", price: 110, featured: true },
  ],
  pastries: [
    { name: "Pineapple", price: 50 },
    { name: "Strawberry", price: 50 },
    { name: "Black Forest", price: 60 },
    { name: "Choco Truffle", price: 60 },
    { name: "Belgium", price: 60 },
    { name: "Rainbow", price: 60 },
    { name: "Oreo", price: 65 },
    { name: "Red Velvet", price: 75, featured: true },
    { name: "Dry Fruits", price: 75 },
    { name: "Death by Chocolate", price: 80, featured: true },
    { name: "German Nuts", price: 65 },
    { name: "Butterscotch", price: 60 },
    { name: "Doughnuts", price: 25 },
    { name: "Chocolava", price: 40 },
    { name: "Mousse", price: 40 },
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
