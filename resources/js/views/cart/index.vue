<template>
    <div v-if="cartTotal">
        <section class="bg-light py-5">
            <div class="container"> 
                <div class="row">
                    <div class="col">
                        <h1 class="text-center">Shopping Cart</h1>
                    </div>
                </div>
            </div>
        </section>
        <section class="py-5">
            <div class="container">
                <h2>Your Cart</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th class="delete-action"></th>
                            <th>Product</th>
                            <th class="text-center">Price</th>
                            <th class="text-center">Quantity</th>
                            <th class="text-end">Sub Total</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="item in cartItems?.data" :key="item.id">
                            <td class="delete-action">
                                <button class="btn-outlined btn text-danger w-auto py-0" @click="removeCartItem(item.id)">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash3-fill" viewBox="0 0 16 16">
                                        <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06Zm6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528ZM8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5"/>
                                    </svg>
                                </button>
                            </td>
                            <td class="text-capitalize">{{ item.product.name }}</td>
                            <td class="text-center"><FormatNumber :amount="item.product.price" /></td>
                            <td class="text-center">{{ item.quantity }}</td>
                            <td class="text-end"><FormatNumber :amount="(item.product.price * item.quantity)" /></td>
                        </tr>
                    </tbody>
                </table>
                <div class="table-footer">
                    <div class="text-end mb-4 fs-5">
                        <p>
                            <strong>Sub Total: </strong>
                            <strong><FormatNumber :amount="cartTotal" /></strong>
                        </p>
                    </div>
                    <div class="text-end">
                        <button class="btn btn-primary btn-checkout">
                            <router-link :to="{ name: 'cart.checkout'}"
                                        class="text-white">Checkout
                            </router-link>
                            
                        </button>
                    </div>
                </div>
            </div>
        </section>
    </div>
    <div class="container py-5 cart-empty d-flex flex-column justify-content-center" v-else>
        <div class="text-center">
            <h2>Your Cart is Empty!</h2>
            <p>Looks like you haven't added anything to your cart yet.</p>
            <router-link :to="{name: 'public-products.index'}" class="btn btn-primary">Continue Shopping</router-link>
        </div>
    </div>
</template>
<script setup>
import { ref, computed, onMounted } from 'vue';
import axios from 'axios';
import useCart from '@/composables/cart';
import FormatNumber from "@/components/FormatNumber.vue"

const {
    cartItems,
    getCartItems,
    removeCartItem
} = useCart();

const cartTotal = computed(() => {
    if (! cartItems?.value?.data) return 0;

    return cartItems.value.data.reduce((total, item) => {
        return total + (item.quantity * item.product.price);
    }, 0);
});

onMounted(() => {
    getCartItems();
});
</script>
<style scoped>
.delete-action {
    width: 40px;
}
td {
    padding: 1rem;
}
.cart-empty {
    min-height: calc(100vh - 56px);
}
</style>