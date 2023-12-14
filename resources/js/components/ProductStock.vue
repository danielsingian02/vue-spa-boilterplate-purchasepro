<script setup>
const props = defineProps({
  quantity: {
    type: Number,
    required: true
  },
})

function stockLabel(quantity) {
    return quantity ? 'In Stock' : 'Out of Stock';
}

function stockLabelClass(quantity) {
    return quantity ? 'text-success' : 'text-danger';
}
</script>

<template>
  <span :class="['stock-label', stockLabelClass(props.quantity)]"><strong>{{ stockLabel(props.quantity) }}</strong></span>
</template>