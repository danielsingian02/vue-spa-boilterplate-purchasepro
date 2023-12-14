import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import store from "../store";
import useToast from "../helpers/useToast"

export default function useCart() {
    const cartItems = ref([]);
    const cartTotal = ref(0);

    const cartItem = ref({
        id: '',
        product: null,
        quantity: ''
    });

    const router = useRouter()
    const isLoading = ref(false)
    const { showToastSuccess, showToastError } = useToast();

    const getCartItems = async () => {
        axios.get('/api/cart')
            .then(response => {
                cartItems.value = response.data;

                cartTotal.value = cartItems.value.data.reduce((total, item) => {
                    return total + (item.quantity * item.product.price);
                }, 0);
            })
    }

    const isAuthenticated = () => {
        // Check if the user is authenticated
        return !!store.state.auth.authenticated; 
    }

    const addCartItems = async (data) => {
        if (!isAuthenticated()) {
            redirectToLogin();
            return;
        }

        isLoading.value = true;

        axios.post('/api/cart/add', data)
            .then(response => {
                showToastSuccess(response.data.message);
            })
            .catch(({response}) => {
                showToastError(response.data.message)
            })
            .finally(() => {
                isLoading.value = false
            })
    }

    const removeCartItem = (cartItemKey) => {
        isLoading.value = true;

        axios.post(`/api/cart/${cartItemKey}/remove`)
            .then(response => {
                showToastSuccess(response.data.message);
                getCartItems()
            })
            .catch(error => {
                console.log(error)
            })
            .finally(() => {
                isLoading.value = false
            })
    }

    const cartCheckout = (order) => {
        isLoading.value = true;

        axios.post(`/api/checkout`, order)
            .then(async (response) => {
                showToastSuccess(response.data.message);
                await router.push({ name: 'cart.checkout.thank_you' })
            })
            .catch(error => {
                showToastError('Unable to checkout.')
            })
            .finally(() => {
                isLoading.value = false
            })
    }

    return {
        cartItems,
        cartTotal,
        getCartItems,
        addCartItems,
        removeCartItem,
        cartCheckout
    }
}
