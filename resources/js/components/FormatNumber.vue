<script setup>
const props = defineProps({
  amount: {
    type: [Number, String],
    required: true
  },
})


function formatNumber(amount) {
    // Ensure the amount is a number
    const num = typeof amount === 'string' ? parseFloat(amount) : amount;

    // Use Intl.NumberFormat for formatting
    return new Intl.NumberFormat('en-US', { style: 'decimal', maximumFractionDigits: 2, minimumFractionDigits: 2 }).format(num);
}
</script>

<template>
  <span class="amount text-success">${{ formatNumber(props.amount) }}</span>
</template>