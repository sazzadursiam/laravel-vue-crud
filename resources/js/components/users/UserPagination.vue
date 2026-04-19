<template>
    <div
        class="d-flex justify-content-center align-items-center mt-3"
        v-if="meta.total > 0"
    >
        Showing page {{ meta.current_page }} of {{ meta.last_page }}
        | Total: {{ meta.total }}
    </div>

    <div>
        <button
            class="btn btn-outline-secondary btn-sm me-2"
            :disabled="meta.current_page === 1"
            @click="$emit('change-page', meta.current_page - 1)"
        >
            Prev
        </button>
        <button
            class="btn btn-outline-secondary btn-sm"
            :disabled="meta.current_page === meta.last_page"
            @click="$emit('change-page', meta.current_page + 1)"
        >
            Next
        </button>
    </div>
</template>

<script setup>
defineProps({
    meta: {
        type: Object,
        default: () => ({
            current_page: 1,
            last_page: 1,
            total: 0,
        }),
    }
});

defineEmits(['change-page']);
</script>
