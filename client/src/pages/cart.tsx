import { useEffect, useState } from "react";
import { Link } from "wouter";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

const Cart = () => {
  useEffect(() => {
    document.title = "Your Cart | KavinoRa";
  }, []);

  // In a real app, this would come from context or state management
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "MotionMist™ Anti-Chafing Spray",
      price: 24.99,
      quantity: 2,
      image: "https://pixabay.com/get/gbd20e1f06248868b2321297688b4c6d759a99b67d53173f852fb2cd83347348017d39e1f97d3a9c0a72d23e2a146826858308734326d6e60642e3760b60e2a8c_1280.jpg",
    },
    {
      id: 2,
      name: "KavinoRa Gift Set",
      price: 59.99,
      quantity: 1,
      image: "https://pixabay.com/get/g35d6b45c0b4cce7ae6afdb5fe6b0f5f2e2d94ad95ec5c5f38c9a8b95ad16e0e7b4c1fa4dd13f5cfe43c50b5b16e98c81f2fe51ebdb3a86d7a82b93b56d24ebca_1280.jpg",
    },
  ]);

  const increaseQuantity = (id: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const decreaseQuantity = (id: number) => {
    setCartItems(
      cartItems.map((item) =>
        item.id === id && item.quantity > 1
          ? { ...item, quantity: item.quantity - 1 }
          : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const subtotal = calculateSubtotal();
  const shipping = subtotal > 0 ? 5.99 : 0;
  const total = subtotal + shipping;

  return (
    <div className="pt-12 pb-20">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl md:text-4xl font-montserrat font-bold text-gray-800 mb-8 text-center">
          Your Cart
        </h1>

        {cartItems.length > 0 ? (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <div className="lg:w-2/3">
              <div className="bg-white rounded-xl shadow-md overflow-hidden">
                <div className="p-6">
                  <h2 className="font-montserrat font-semibold text-xl mb-4">
                    Cart Items
                  </h2>

                  <div className="divide-y divide-gray-200">
                    {cartItems.map((item) => (
                      <div key={item.id} className="py-6 flex flex-wrap md:flex-nowrap">
                        <div className="md:w-24 h-24 bg-gray-100 rounded-md overflow-hidden mr-4 mb-4 md:mb-0">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-montserrat font-medium text-lg mb-1">
                            {item.name}
                          </h3>
                          <p className="text-teal font-semibold mb-3">
                            ${item.price.toFixed(2)}
                          </p>
                          <div className="flex items-center">
                            <button
                              onClick={() => decreaseQuantity(item.id)}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                              aria-label="Decrease quantity"
                            >
                              <i className="ri-subtract-line"></i>
                            </button>
                            <span className="mx-3 w-8 text-center">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => increaseQuantity(item.id)}
                              className="bg-gray-100 hover:bg-gray-200 text-gray-700 w-8 h-8 rounded-full flex items-center justify-center transition-all"
                              aria-label="Increase quantity"
                            >
                              <i className="ri-add-line"></i>
                            </button>
                          </div>
                        </div>
                        <div className="w-full md:w-auto mt-4 md:mt-0 flex items-start md:items-center justify-between md:justify-end">
                          <p className="font-semibold text-lg md:mr-8">
                            ${(item.price * item.quantity).toFixed(2)}
                          </p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-gray-400 hover:text-red-500 transition-all"
                            aria-label="Remove item"
                          >
                            <i className="ri-delete-bin-line text-xl"></i>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex justify-between">
                <Link href="/">
                  <a className="inline-flex items-center text-teal hover:text-teal-dark transition-all">
                    <i className="ri-arrow-left-line mr-2"></i>
                    Continue Shopping
                  </a>
                </Link>
                <button
                  onClick={() => setCartItems([])}
                  className="inline-flex items-center text-gray-500 hover:text-red-500 transition-all"
                >
                  <i className="ri-delete-bin-line mr-2"></i>
                  Clear Cart
                </button>
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:w-1/3">
              <div className="bg-white rounded-xl shadow-md p-6">
                <h2 className="font-montserrat font-semibold text-xl mb-6">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="font-montserrat font-semibold">Total</span>
                    <span className="font-montserrat font-semibold">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full bg-teal hover:bg-teal-dark text-white font-montserrat font-medium py-3 rounded-full transition-all flex items-center justify-center"
                >
                  <i className="ri-secure-payment-line mr-2"></i>
                  Proceed to Checkout
                </button>

                <div className="mt-6">
                  <div className="text-sm text-gray-500 text-center mb-4">
                    We accept
                  </div>
                  <div className="flex justify-center space-x-3">
                    <i className="ri-visa-line text-3xl text-gray-600"></i>
                    <i className="ri-mastercard-line text-3xl text-gray-600"></i>
                    <i className="ri-paypal-line text-3xl text-gray-600"></i>
                    <i className="ri-amazon-pay-line text-3xl text-gray-600"></i>
                  </div>
                </div>
              </div>

              <div className="bg-beige-light rounded-xl p-4 mt-6">
                <div className="flex items-start">
                  <i className="ri-truck-line text-teal text-xl mr-3 mt-1"></i>
                  <div>
                    <h4 className="font-montserrat font-medium mb-1">
                      Free shipping on orders over $75
                    </h4>
                    <p className="text-sm text-gray-600">
                      Add ${(75 - subtotal).toFixed(2)} more to qualify for free
                      shipping!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="mb-6 inline-block p-5 bg-beige-light rounded-full">
              <i className="ri-shopping-cart-line text-teal text-4xl"></i>
            </div>
            <h2 className="text-2xl font-montserrat font-semibold mb-4">
              Your cart is empty
            </h2>
            <p className="text-gray-600 mb-8">
              Looks like you haven't added any products to your cart yet.
            </p>
            <Link href="/product">
              <a className="inline-block bg-teal hover:bg-teal-dark text-white font-montserrat font-medium py-3 px-8 rounded-full transition-all">
                Browse Products
              </a>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;