import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'

export default function useProducts() {
    const products = ref({})
    const product = ref({
        name: '',
        description: '',
        excerpt: '',
        image: '',
        price: ''
    })
    const router = useRouter()
    const validationErrors = ref({})
    const isLoading = ref(false)
    const swal = inject('$swal')

    const getProducts = async (
        page = 1,
    ) => {
        axios.get('/api/products?page=' + page)
            .then(response => {
                products.value = response.data;
            })
    }

    const getProduct = async (id) => {
        axios.get('/api/products/' + id)
            .then(response => {
                post.value = response.data.data;
            })
    }

    const storeProduct = async (post) => {
        if (isLoading.value) return;

        isLoading.value = true
        validationErrors.value = {}

        let serializedProduct = new FormData()
        for (let item in post) {
            if (post.hasOwnProperty(item)) {
                serializedProduct.append(item, post[item])
            }
        }

        axios.post('/api/products', serializedProduct,{
            headers: {
                "content-type": "multipart/form-data"
            }
        })
            .then(response => {
                router.push({name: 'products.index'})
                swal({
                    icon: 'success',
                    title: 'Product saved successfully'
                })
            })
            .catch(error => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors
                }
            })
            .finally(() => isLoading.value = false)
    }

    const updateProduct = async (post) => {
        if (isLoading.value) return;

        isLoading.value = true
        validationErrors.value = {}

        axios.put('/api/products/' + post.id, post)
            .then(response => {
                router.push({name: 'products.index'})
                swal({
                    icon: 'success',
                    title: 'Product updated successfully'
                })
            })
            .catch(error => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors
                }
            })
            .finally(() => isLoading.value = false)
    }

    const deleteProduct = async (id) => {
        swal({
            title: 'Are you sure?',
            text: 'You won\'t be able to revert this action!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            confirmButtonColor: '#ef4444',
            timer: 20000,
            timerProgressBar: true,
            reverseButtons: true
        })
            .then(result => {
                if (result.isConfirmed) {
                    axios.delete('/api/products/' + id)
                        .then(response => {
                            getProducts()
                            router.push({name: 'products.index'})
                            swal({
                                icon: 'success',
                                title: 'Product deleted successfully'
                            })
                        })
                        .catch(error => {
                            swal({
                                icon: 'error',
                                title: 'Something went wrong'
                            })
                        })
                }
            })

    }

    return {
        products,
        product,
        getProducts,
        getProduct,
        storeProduct,
        updateProduct,
        deleteProduct,
        validationErrors,
        isLoading
    }
}
