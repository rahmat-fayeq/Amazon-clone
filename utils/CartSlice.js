import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";

const initialState = {
  cartItems: [],
  cartTotalQuantity: 0,
  cartTotalAmmount: 0,
  shippingAddress: [],
  paymentMethod: "",
};

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart(state, action) {
      const itemIndex = state.cartItems.findIndex(
        (item) => item.slug == action.payload.slug
      );

      if (itemIndex >= 0) {
        if (
          state.cartItems[itemIndex].cartQuantity >=
          state.cartItems[itemIndex].countInStock
        ) {
          toast.info("Product is out of stock!", { position: "top-left" });
          return;
        }
        state.cartItems[itemIndex].cartQuantity += 1;
        toast.info(`${action.payload.name}'s quantity increased !`, {
          position: "top-left",
        });
      } else {
        const tempProduct = { ...action.payload, cartQuantity: 1 };

        if (state.cartItems.cartQuantity > state.cartItems.countInStock) {
          toast.info("Product is out of stock!", { position: "top-left" });
          return;
        }
        state.cartItems.push(tempProduct);
        toast.success(`${action.payload.name} added to cart !`, {
          position: "top-left",
        });
      }
    },

    removeFromCart(state, action) {
      const nextCartItem = state.cartItems.filter(
        (item) => item.slug !== action.payload.slug
      );
      state.cartItems = nextCartItem;
      toast.warning(`${action.payload.name} removed from cart !`, {
        position: "top-left",
      });
    },

    decreaseCart(state, action) {
      const itemIndex = state.cartItems.findIndex(
        (cartItem) => cartItem.slug == action.payload.slug
      );
      if (state.cartItems[itemIndex].cartQuantity > 1) {
        state.cartItems[itemIndex].cartQuantity -= 1;
        toast.info(`${action.payload.name}'s quantity decreased !`, {
          position: "top-left",
        });
      } else if (state.cartItems[itemIndex].cartQuantity === 1) {
        const nextCartItem = state.cartItems.filter(
          (item) => item.slug !== action.payload.slug
        );
        state.cartItems = nextCartItem;
        toast.warning(`${action.payload.name} removed from cart !`, {
          position: "top-left",
        });
      }
    },

    getTotals(state, action) {
      const { total, quantity } = state.cartItems.reduce(
        (cartTotal, cartItem) => {
          const { price, cartQuantity } = cartItem;
          const itemTotal = price * cartQuantity;

          cartTotal.total += itemTotal;
          cartTotal.quantity += cartQuantity;
          return cartTotal;
        },
        {
          total: 0,
          quantity: 0,
        }
      );
      state.cartTotalQuantity = quantity;
      state.cartTotalAmmount = total;
    },

    cartReset(state) {
      state.cartItems = [];
      state.cartTotalQuantity = 0;
      state.cartTotalAmmount = 0;
    },

    saveShippingAddress(state, action) {
      state.shippingAddress = { ...action.payload };
    },
    savePaymentMethod(state, action) {
      state.paymentMethod = action.payload;
    },
  },
});

export const {
  addToCart,
  removeFromCart,
  decreaseCart,
  getTotals,
  cartReset,
  saveShippingAddress,
  savePaymentMethod,
} = CartSlice.actions;
export default CartSlice.reducer;
