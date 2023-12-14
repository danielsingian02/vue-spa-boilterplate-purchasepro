import { ref, reactive, inject } from 'vue'
import { useRouter } from "vue-router";
import { AbilityBuilder, createMongoAbility } from '@casl/ability';
import { ABILITY_TOKEN } from '@casl/vue';
import store from '../store'

let user = reactive({
    name: '',
    email: '',
})

export default function useAuth() {
    const processing = ref(false)
    const validationErrors = ref({})
    const router = useRouter()
    const swal = inject('$swal')
    const ability = inject(ABILITY_TOKEN)

    const loginForm = reactive({
        email: '',
        password: '',
        remember: false
    })

    const forgotForm = reactive({
        email: '',
    })

    const resetForm = reactive({
        email: '',
        token: '',
        password: '',
        password_confirmation: ''
    })

    const registerForm = reactive({
        name: '',
        email: '',
        password: '',
        password_confirmation: ''
    })

    const submitLogin = async () => {
        if (processing.value) return

        processing.value = true
        validationErrors.value = {}

         axios.get('/sanctum/csrf-cookie').then(async () => {
            await axios.post('/login', loginForm)
                .then(async response => {
                    await store.dispatch('auth/getUser')
                    await loginUser()

                    await router.push({ name: 'public-products.index' })
                })
                .catch(error => {
                    if (error.response?.data) {
                        validationErrors.value = error.response.data.errors
                    }
                })
                .finally(() => processing.value = false)
        });
    }

    const submitRegister = async () => {
        if (processing.value) return

        processing.value = true
        validationErrors.value = {}

        await axios.post('/register', registerForm)
            .then(async response => {
                // await store.dispatch('auth/getUser')
                // await loginUser()
                swal({
                    icon: 'success',
                    title: 'Registration successfully',
                    showConfirmButton: false,
                    timer: 1500
                })
                await router.push({ name: 'auth.login' })
            })
            .catch(error => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors
                }
            })
            .finally(() => processing.value = false)
    }

    const submitForgotPassword = async () => {
        if (processing.value) return

        processing.value = true
        validationErrors.value = {}

        await axios.post('/api/forget-password', forgotForm)
            .then(async response => {
                swal({
                    icon: 'success',
                    title: 'We have emailed your password reset link! Please check your mail inbox.',
                    showConfirmButton: false,
                    timer: 1500
                })
                // await router.push({ name: 'admin.index' })
            })
            .catch(error => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors
                }
            })
            .finally(() => processing.value = false)
    }

    const submitResetPassword = async () => {
        if (processing.value) return

        processing.value = true
        validationErrors.value = {}

        await axios.post('/api/reset-password', resetForm)
            .then(async response => {
                swal({
                    icon: 'success',
                    title: 'Password successfully changed.',
                    showConfirmButton: false,
                    timer: 1500
                })
                await router.push({ name: 'auth.login' })
            })
            .catch(error => {
                if (error.response?.data) {
                    validationErrors.value = error.response.data.errors
                }
            })
            .finally(() => processing.value = false)
    }

    const loginUser = async () => {
        user = store.state.auth.user
        // Cookies.set('loggedIn', true)

        getAbilities()
    }

    const getUser = async () => {
        if (store.getters['auth/authenticated']) {
            await store.dispatch('auth/getUser')
            await loginUser()
        }
    }

    const logout = async () => {
        if (processing.value) return

        processing.value = true

        axios.post('/logout')
            .then(response => {
                user.name = ''
                user.email = ''
                store.dispatch('auth/logout')
                router.push({ name: 'auth.login' })
            })
            .catch(error => {
                // swal({
                //     icon: 'error',
                //     title: error.response.status,
                //     text: error.response.statusText
                // })
            })
            .finally(() => {
                processing.value = false
                // Cookies.remove('loggedIn')
            })
    }

    const getAbilities = async() => {
        await axios.get('/api/abilities')
            .then(response => {
                const permissions = response.data
                const { can, rules } = new AbilityBuilder(createMongoAbility)

                can(permissions)

                ability.update(rules)
            })
    }

    const redirectToRoleBasedRoute = () => {
        // Check if there's a route to go back to
        const backRoute = router.currentRoute.value.query.back;
        if (backRoute) {
            router.push({ path: backRoute });
            return;
        }

        let routeName;
    
        switch (role) {
            case 'admin':
                routeName = 'admin.index';
                break;
            case 'user':
                routeName = 'user.dashboard';
                break;
            // Add more cases as needed for other roles
            default:
                routeName = 'default.route'; // Fallback route
        }
    
        router.push({ name: routeName });
    }

    return {
        loginForm,
        registerForm,
        forgotForm,
        resetForm,
        validationErrors,
        processing,
        submitLogin,
        submitRegister,
        submitForgotPassword,
        submitResetPassword,
        user,
        getUser,
        logout,
        getAbilities
    }
}
