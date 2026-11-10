/**
 * products.js
 * Source data for the menu carousel. `gradient` drives the color-matched
 * backdrop wash behind the active drink (2–3 stops, matches its dominant
 * garnish/ingredient color as requested). Edit freely — carousel.js reads
 * this array on load.
 */
const PRODUCTS = [
  {
    id: "affogato",
    name: "Vanilla Affogato",
    tagline:
      "A double espresso poured over a scoop of vanilla — dessert and coffee in one glass.",
    price: "4.80",
    image: "assets/products/Affogato.webp",
    gradient: ["#fbd9b7", "#f3b6a3", "#e9d3c3"],
    ingredients: [
      { icon: "espresso", label: "Double espresso" },
      { icon: "iceCream", label: "Vanilla ice cream" },
      { icon: "cream", label: "Whipped cream" },
      { icon: "berry", label: "Raspberry" },
    ],
  },
  {
    id: "coconut",
    name: "Coconut Cold Brew",
    tagline:
      "Slow-steeped cold brew with coconut milk for a light, tropical sweetness.",
    price: "4.30",
    image: "assets/products/Coconut.webp",
    gradient: ["#fdf6ec", "#c9a06a", "#8b5e3c"],
    ingredients: [
      { icon: "espresso", label: "Cold brew" },
      { icon: "coconut", label: "Coconut milk" },
      { icon: "coconut", label: "Coconut flakes" },
      { icon: "ice", label: "Ice" },
    ],
  },
  {
    id: "dalgona",
    name: "Dalgona",
    tagline:
      "Whipped coffee cream layered over cold milk — a drink you sip with your eyes first.",
    price: "3.90",
    image: "assets/products/Dalgona.webp",
    gradient: ["#f0c892", "#c78a4a", "#6f3f1e"],
    ingredients: [
      { icon: "espresso", label: "Whipped coffee" },
      { icon: "milk", label: "Milk" },
      { icon: "ice", label: "Ice" },
    ],
  },
  {
    id: "honey-cinnamon",
    name: "Honey Cinnamon Latte",
    tagline:
      "Warm spice, honey and a soft foam top — a cosy cup for a cold day.",
    price: "4.50",
    image: "assets/products/HoneyCinnamon.webp",
    gradient: ["#f5c451", "#c98a3a", "#7a4a1f"],
    ingredients: [
      { icon: "espresso", label: "Espresso" },
      { icon: "honey", label: "Honey" },
      { icon: "cinnamon", label: "Cinnamon" },
      { icon: "cream", label: "Whipped cream" },
    ],
  },
  {
    id: "mocha-iced",
    name: "Iced Mocha",
    tagline:
      "Espresso and dark chocolate, finished with a cloud of whipped cream.",
    price: "4.60",
    image: "assets/products/MochaIced.webp",
    gradient: ["#c9a27a", "#7a4f34", "#3b2418"],
    ingredients: [
      { icon: "espresso", label: "Espresso" },
      { icon: "chocolate", label: "Dark chocolate" },
      { icon: "milk", label: "Milk" },
      { icon: "cream", label: "Whipped cream" },
    ],
  },
  {
    id: "smoothie",
    name: "Banana Smoothie",
    tagline:
      "Banana, rolled oats and almond milk blended thick — hearty and filling.",
    price: "4.20",
    image: "assets/products/Smoothie.webp",
    gradient: ["#f6e27a", "#e3c268", "#fbf3dc"],
    ingredients: [
      { icon: "banana", label: "Banana" },
      { icon: "oats", label: "Rolled oats" },
      { icon: "almond", label: "Almond milk" },
      { icon: "honey", label: "Honey" },
    ],
  },
  {
    id: "strawberry",
    name: "Strawberry Latte",
    tagline: "Strawberry purée, milk and espresso layered fresh and bright.",
    price: "4.40",
    image: "assets/products/Strawberry.webp",
    gradient: ["#e85c6b", "#f0a0a8", "#fbe7df"],
    ingredients: [
      { icon: "espresso", label: "Espresso" },
      { icon: "berry", label: "Strawberry purée" },
      { icon: "milk", label: "Milk" },
      { icon: "ice", label: "Ice" },
    ],
  },
  {
    id: "vanilla-latte",
    name: "Vanilla Latte",
    tagline:
      "Soft vanilla syrup and steamed milk — a quiet harbour for those who like things simple.",
    price: "4.00",
    image: "assets/products/VanilLatte.webp",
    gradient: ["#ebd9a8", "#d8b978", "#fffdf8"],
    ingredients: [
      { icon: "espresso", label: "Espresso" },
      { icon: "syrup", label: "Vanilla syrup" },
      { icon: "milk", label: "Milk" },
      { icon: "ice", label: "Ice" },
    ],
  },

  {
    id: "espresso",
    name: "Espresso",
    tagline: "Small Cup, Unmatched Intensity.",
    price: "3.00",
    image: "assets/products/Espresso.webp",
    gradient: ["#e0d6d6", "#352910", "#111111"],
    ingredients: [{ icon: "espresso", label: "Espresso" }],
  },
];
