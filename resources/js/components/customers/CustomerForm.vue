<template>
    <form @submit.prevent="$emit('submit-form')">
        <div class="row g-3">
            <div class="col-md-6">
                <label class="form-label">Name</label>
                <input
                    v-model="form.name"
                    type="text"
                    class="form-control"
                    placeholder="Enter name"
                >
                <div v-if="errors.name" class="text-danger small mt-1">
                    {{ errors.name[0] }}
                </div>
            </div>
            <div class="col-md-6">
                <label class="form-label">Email</label>
                <input
                    v-model="form.email"
                    type="email"
                    class="form-control"
                    placeholder="Enter email"
                >
                <div v-if="errors.email" class="text-danger small mt-1">
                    {{ errors.email[0] }}
                </div>
            </div>
            <div class="col-md-6">
                <label class="form-label">Phone</label>
                <input
                    v-model="form.phone"
                    type="text"
                    class="form-control"
                    placeholder="Enter phone number"
                >
                <div v-if="errors.phone" class="text-danger small mt-1">
                    {{ errors.phone[0] }}
                </div>
            </div>
            <div class="col-md-6">
                <label class="form-label">Address</label>
                <input
                    v-model="form.address"
                    type="text"
                    class="form-control"
                    placeholder="Enter address"
                >
                <div v-if="errors.address" class="text-danger small mt-1">
                    {{ errors.address[0] }}
                </div>
            </div>
        </div>

        <div class="mt-3">
            <button class="btn btn-primary" type="submit">
                {{ editMode ? 'Update Customer' : 'Add Customer' }}
            </button>

            <button
                v-if="editMode"
                type="button"
                class="btn btn-secondary ms-2"
                @click="$emit('cancel-edit')"
            >
                Cancel
            </button>
        </div>

    </form>
</template>

<script setup>
defineProps({
    form: Object,
    editMode: Boolean,
    errors: Object
});
defineEmits(['submit-form', 'cancel-edit']);
</script>
