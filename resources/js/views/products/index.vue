<template>
    <div class="container">
        <h2 class="text-center my-4">Products</h2>
        <div class="row mb-2 row-gap-4">
            <div v-for="product in products.data" :key="product.id" class="col-md-4">
                <div
                    class="row g-0 border rounded overflow-hidden flex-md-row shadow-sm h-md-250 position-relative h-100">
                    <div class="col-auto d-none d-lg-block d-md-block">
                        <img :src="getImageUrl(product)" class="img-fluid"/>
                    </div>
                    <div class="col p-4 d-flex flex-column position-static">
                        <div class="d-flex justify-content-between align-items-center flex-wrap">
                            <h3 class="mb-0 text-capitalize">{{ product.name }}</h3>
                            <FormatNumber :amount="product.price" />
                        </div>
                        <div class="mb-1 text-muted">Nov 12</div>
                        <div class="card-text mb-auto" v-html="product.excerpt"></div>
                        <router-link :to="{ name: 'public-products.details', params: { slug: product.slug } }"
                                     class="stretched-link">Continue reading
                        </router-link>
                    </div>
                </div>
            </div>
            
            <div class="card-footer">
                <Pagination :data="products" :limit="products.per_page"
                    @pagination-change-page="page => getProducts(page)"
                    class="mt-4 justify-content-center" />
            </div>
        </div>
    </div>
</template>

<script setup>
import {onMounted} from 'vue'
import useProducts from "@/composables/products";
import FormatNumber from "@/components/FormatNumber.vue"

const {products, getProducts} = useProducts();

function getImageUrl(product) {
    return product.image;
}

onMounted(() => {
    getProducts();
})

</script>
