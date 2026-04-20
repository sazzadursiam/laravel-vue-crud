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
                            @click="$emit('cancel-form')"
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
                                :class="{ 'is-invalid': errors.name }"
                                placeholder="Enter name"
                            >
                            <div v-if="errors.name" class="invalid-feedback d-block">
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
                                :class="{ 'is-invalid': errors.email }"
                                placeholder="Enter email"
                            >
                            <div v-if="errors.email" class="invalid-feedback d-block">
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
                                :class="{ 'is-invalid': errors.password }"
                                placeholder="Enter password"
                            >
                            <div v-if="errors.password" class="invalid-feedback d-block">
                                {{ errors.password[0] }}
                            </div>
                        </div>

                        <div class="mb-3">
                            <label class="form-label">Status</label>
                            <select
                                v-model="form.status"
                                class="form-select"
                                :class="{ 'is-invalid': errors.status }"
                            >
                                <option :value="true">Active</option>
                                <option :value="false">Inactive</option>
                            </select>
                            <div v-if="errors.status" class="invalid-feedback d-block">
                                {{ errors.status[0] }}
                            </div>
                        </div>

                        <div class="mb-3">
                            <label for="photo" class="form-label">Photo</label>
                            <input
                                type="file"
                                id="photo"
                                class="form-control"
                                :class="{ 'is-invalid': errors.photo }"
                                accept=".jpg, .jpeg, .png"
                                @change="$emit('photo-changed', $event)">
                            <div v-if="errors.photo" class="invalid-feedback d-block">
                                {{ errors.photo[0] }}
                            </div>
                        </div>

                        <div v-if="previewImage" class="text-center">
                            <img
                                :src="previewImage"
                                alt="Preview"
                                class="img-thumbnail"
                                style="max-height: 180px;"
                            >
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
                            {{ editMode ? 'Update User' : 'Save User' }}
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
    errors: Object,
    previewImage: String
});
defineEmits(['submit-form', 'cancel-form', 'photo-changed']);
</script>


