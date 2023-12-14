import { ref, inject } from 'vue'
import { useRouter } from 'vue-router'
import store from "../store";
import Swal from 'sweetalert2';

export default function useToast() {
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 1200,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer);
            toast.addEventListener('mouseleave', Swal.resumeTimer);
        }
    });

    const showToast = (icon, title = "", text = '') => {
        Toast.fire({
            icon,
            title,
            text
        });
    };

    const showToastSuccess = (text = '') => {
        showToast('success', text);
    }

    const showToastError = (text = '') => {
        showToast('error', 'Error', text);
    }

    return {
        showToast,
        showToastSuccess,
        showToastError,
    }
}