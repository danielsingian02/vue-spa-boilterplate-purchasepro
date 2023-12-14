<template>
    <div class="container">
        <div class="row g-5 mt-4" v-if="product">
            <div class="col-md-7">
                <div>
                    <img :src="product.image" class="img-fluid w-100"/>
                </div>

                <div>
                    
                </div>
            </div>

            <div class="col-md-4">
                <div class="position-sticky" style="top: 2rem;">
                    <div class="p-4 mb-3 bg-light rounded">
                        <h3 class="pb-4 mb-2 fst-italic border-bottom text-capitalize">
                            {{ product.name }}
                        </h3>
                        <FormatNumber :class="'fs-4'" :amount="product.price" />
                        <p class="mt-4">{{ product.description }}</p>

                        <p>Availability: <ProductStock :quantity="product.stock" /></p>

                        <div class="d-flex align-items-center gap-2">
                            <input type="number" v-model="quantity" min="1" class="form-control w-100" />
                            <button @click="addToCart" class="btn btn-primary w-50">Add to Cart</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted, inject } from 'vue';
    import { useRoute, useRouter } from "vue-router";
    import axios from 'axios';
    import FormatNumber from '@/components/FormatNumber.vue';
    import ProductStock from '@/components/ProductStock.vue';
    import useCart from '@/composables/cart';

    import store from "@/store";
    const swal = inject('$swal')

    const { addCartItems } = useCart();
    const route = useRoute();
    const router = useRouter();

    const product = ref();
    const quantity = ref(1);

    const Toast = swal.mixin({
        toast: true,
        position: "top-right",
        iconColor: "white",
        customClass: {
            popup: "colored-toast"
        },
        showConfirmButton: false,
        timer: 1500,
        timerProgressBar: true
    });

    function isAuthenticated() {
        // Check if the user is authenticated
        return !!store.state.auth.authenticated; 
    }

    function redirectToLogin() {
        // Redirect to the login page
        router.push({ name: 'auth.login' });
    }
    
    function addToCart() {
        addCartItems({
            product_id: product.value.id,
            quantity: quantity.value
        })
    }

    onMounted(() => {
        axios.get('/api/products/' + route.params.slug).then(({ data }) => {
            product.value = data.data
        })
    })
</script>
