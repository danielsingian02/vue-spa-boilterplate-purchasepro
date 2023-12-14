<template>
    <section class="bg-light py-5">
        <div class="container"> 
            <div class="row">
                <div class="col">
                    <h1 class="text-center">Checkout</h1>
                </div>
            </div>
        </div>
    </section>
    <div class="checkout py-5">
        <div class="container">
            <div class="row">
                <div class="col-md-6 offset-md-1">
                    <form @submit.prevent="submitOrder" class="px-5">
                        <p>Please fill out the information below.</p>

                        <!-- Customer Information -->
                        <section class="customer-information">
                            <h2>Contact</h2>
                            <input required type="email" v-model="order.email" placeholder="Email" class="form-control form-control-lg">
                        </section>

                        <!-- Delivery Details -->
                        <section class="shipping-address row-gap-2 d-flex flex-wrap mt-5 flex-column">
                            <h2>Delivery</h2>

                            <input required type="text" v-model="order.address.country" class="form-control form-control-lg" placeholder="Country">

                            <div class="row">
                                <div class="col">
                                    <input type="text" v-model="order.first_name" class="form-control form-control-lg" placeholder="First name">
                                </div>
                                <div class="col">
                                    <input required type="text" v-model="order.last_name" class="form-control form-control-lg" placeholder="Last name">
                                </div>
                            </div>

                            <div class="row">
                                <div class="col">
                                    <input type="text" v-model="order.address.address_line_1" class="form-control form-control-lg" placeholder="Address Line 1">
                                </div>
                            </div>

                            <div class="row">
                                <div class="col">
                                    <input required type="text" v-model="order.address.city" class="form-control form-control-lg" placeholder="City">
                                </div>
                                <div class="col">
                                    <input required type="text" v-model="order.address.state" class="form-control form-control-lg" placeholder="State">
                                </div>
                                <div class="col">
                                    <input required type="text" v-model="order.address.zip" class="form-control form-control-lg" placeholder="ZIP Code">
                                </div>
                            </div>

                            <button type="submit" class="btn btn-primary btn-lg mt-5">Place Order</button>
                        </section>
                    </form>
                </div>
                <div class="col-md-4">
                    <section class="d-flex flex-column row-gap-4">
                        <div v-for="item in cartItems?.data" :key="item.id" class="d-flex gap-4 align-items-center">
                            <div class="position-relative">
                                <img :src="getImageUrl(item.product)" width="64" height="64">
                                <span class="item-quantity position-absolute">{{ item.quantity }}</span>
                            </div>
                            <div>
                                <p class="text-capitalize">{{ item.product.name }}</p>
                            </div>
                            <div class="ms-auto">
                                <p><FormatNumber :amount="(item.product.price * item.quantity)" /></p>
                            </div>
                        </div>
                    </section>
                    <section class="d-flex flex-column mt-4">
                        <div class="d-flex justify-content-between gap-2">
                            <span>Subtotal</span>
                            <strong><FormatNumber :amount="cartTotal" class="text-dark" /></strong>
                        </div>
                        <div class="d-flex justify-content-between gap-2">
                            <strong>Total</strong>
                            <strong><FormatNumber :amount="cartTotal" class="text-dark" /></strong>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue';
import useCart from '@/composables/cart';
import FormatNumber from "@/components/FormatNumber.vue"

const { cartCheckout, cartItems, getCartItems, cartTotal } = useCart();

const order = reactive({
    email: '',
    first_name: '',
    last_name: '',
    address: {
        address_line_1: '',
        city: '',
        state: '',
        zip: '',
        country: ''
    },
});

const submitOrder = () => {
    cartCheckout(order);
};

const getImageUrl = (product) => {
    return product.image;
}

onMounted(() => {
    getCartItems();
});
</script>

<style scoped>
.checkout {
    background-image: linear-gradient(to right, #fff 0, #fff 54.5%, #f0f2fc 54.5%);
    min-height: calc(100vh - 208px);
}
section .row {
    --bs-gutter-x: .5rem;
}
.item-quantity {
    background-color: #666;
    min-block-size: 2.2rem;
    min-height: 2.2rem;
    min-inline-size: 2.2rem;
    min-width: 2.2rem;
    padding-left: 0.7rem;
    padding-right: 0.7rem;
    padding-inline: 0.7rem;
    border-radius: 50%;
    color: #fff;
    display: flex;
    align-items: center;
    justify-content: center;
    top: -15px;
    right: -15px;
}
</style>
