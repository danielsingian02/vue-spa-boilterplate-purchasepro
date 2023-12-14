import axios from 'axios';

export default {
    namespaced: true,
    state: {
        cart: {}
    },
    getters: {
        cartItems(state) {
            return state.cartItems
        }
    },
    mutations: {
        SET_CART_ITEMS(state, value) {
            state.cartItems = value
        }
    },
    actions: {
        getUser({commit}) {
            return axios.get('/api/user').then(({data}) => {
                if (data.success) {
                    commit('SET_USER', data.data)
                    commit('SET_AUTHENTICATED', true)
                    // router.push({name: 'dashboard'})
                }
            }).catch(({res}) => {
                commit('SET_USER', {})
                commit('SET_AUTHENTICATED', false)
            })
        },
        async removeCartItem({commit}) {
            return axios.get(`/api/cart/${cartItemKey}`).then(({data}) => {
                if (data.success) {
                    commit('SET_USER', data.data)
                    commit('SET_AUTHENTICATED', true)
                    // router.push({name: 'dashboard'})
                }
            }).catch(({res}) => {
                commit('SET_USER', {})
                commit('SET_AUTHENTICATED', false)
            })
        }
    }
}
