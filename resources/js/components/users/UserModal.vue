<template>
    <div class="modal fade" id="userModal" tabindex="-1" aria-labelledby="userModalLabel" aria-hidden="true">
        <div class="modal-dialog">
            <div class="modal-content">
                <form @submit.prevent="$emit('submit-form')">
                    <div class="modal-header">
                        <h5 class="modal-title" id="userModalLabel">
                            {{ editMode ? 'Edit User' : 'Add User' }}
                        </h5>
                        <button
                            type="button"
                            class="btn-close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                        ></button>
                    </div>

                    <div class="modal-body">
                        <div class="mb-3">
                            <label for="name" class="form-label">Name</label>
                            <input
                                type="text"
                                id="name"
                                v-model="form.name"
                                class="form-control"
                                placeholder="Enter name"
                            >
                            <div v-if="errors.name" class="text-danger small mt-1">
                                {{ errors.name[0] }}
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                v-model="form.email"
                                class="form-control"
                                placeholder="Enter email"
                            >
                            <div v-if="errors.email" class="text-danger small mt-1">
                                {{ errors.email[0] }}
                            </div>
                        </div>
                        <div class="mb-3">
                            <label for="password" class="form-label">
                                {{ editMode ? 'New Password (optional)' : 'Password' }}
                            </label>
                            <input
                                type="password"
                                id="password"
                                v-model="form.password"
                                class="form-control"
                                placeholder="Enter password"
                            >
                            <div v-if="errors.password" class="text-danger small mt-1">
                                {{ errors.password[0] }}
                            </div>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-bs-dismiss="modal"
                            @click="$emit('cancel-form')"
                        >
                            Close
                        </button>
                        <button
                            type="submit"
                            class="btn btn-primary"
                        >
                            {{ editMode ? 'Update User' : 'Add User' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    form: Object,
    editMode: Boolean,
    errors: Object
});
defineEmits(['submit-form', 'cancel-form']);
</script>


