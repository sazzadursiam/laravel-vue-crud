<template>
    <div class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1080;">
        <div
            id="appToast"
            class="toast align-items-center border-0"
            :class="toastClass"
            role="alert"
            aria-live="assertive"
            aria-atomic="true"
        >
            <div class="d-flex">
                <div class="toast-body">
                    {{ message }}
                </div>
                <button
                    type="button"
                    class="btn-close btn-close-white me-2 m-auto"
                    data-bs-dismiss="toast"
                    aria-label="Close"
                ></button>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
   message: {
       type: String,
       default: '',
   },
    toastClass: {
        type: String,
        default: 'text-bg-success',
    },
});
</script>


<style scoped>

</style>
