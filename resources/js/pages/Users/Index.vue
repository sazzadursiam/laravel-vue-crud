<template>
    <div class="card shadow-sm">
        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h4 class="mb-0">User Management</h4>
            <button class="btn btn-light btn-sm" @click="openCreateModal">
                Add User
            </button>
        </div>

        <div class="card-body">
            <div class="row mb-3">
                <div class="col-md-4">
                    <input
                        v-model="search"
                        type="text"
                        class="form-control"
                        placeholder="Search by name or email"
                        @input="handleSearch"
                    >
                </div>
            </div>

            <div v-if="loading" class="text-center my-3">
                Loading...
            </div>

            <UserTable
                :users="users"
                @edit-user="openEditModal"
                @toggle-status-user="askToggleStatus"
                @delete-user="askDeleteUser"
            />

            <UserPagination
                :meta="meta"
                @change-page="changePage"
            />
        </div>
    </div>

    <UserModal
        :form="form"
        :edit-mode="editMode"
        :errors="errors"
        :preview-image="previewImage"
        @submit-form="saveUser"
        @cancel-form="resetForm"
        @photo-change="handlePhotoChange"
    />

    <ConfirmModal
        :title="confirmState.title"
        :message="confirmState.message"
        :confirm-text="confirmState.confirmText"
        :confirm-button-class="confirmState.confirmButtonClass"
        @confirm="handleConfirmedAction"
    />

    <AppToast
        :message="toast.message"
        :toast-class="toast.className"
    />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Modal, Toast } from 'bootstrap';
import UserTable from '../../components/users/UserTable.vue';
import UserModal from '../../components/users/UserModal.vue';
import UserPagination from '../../components/users/UserPagination.vue';
import ConfirmModal from '../../components/common/ConfirmModal.vue';
import AppToast from '../../components/common/AppToast.vue';
import userService from '../../services/userService';

const users = ref([]);
const search = ref('');
const loading = ref(false);
const editMode = ref(false);
const editUserId = ref(null);
const errors = ref({});
const selectedPhoto = ref(null);
const previewImage = ref(null);

const meta = ref({
    current_page: 1,
    last_page: 1,
    total: 0,
});

const form = ref({
    name: '',
    email: '',
    password: '',
    status: true,
});

const toast = ref({
    message: '',
    className: 'text-bg-success',
});

const confirmState = ref({
    type: null,
    user: null,
    title: 'Confirm Action',
    message: 'Are you sure?',
    confirmText: 'Confirm',
    confirmButtonClass: 'btn-danger',
});

let userModal = null;
let confirmModal = null;
let appToast = null;
let searchTimeout = null;

const fetchUsers = async (page = 1) => {
    loading.value = true;

    try {
        const response = await userService.getUsers({
            search: search.value,
            page,
        });

        users.value = response.data.data;
        meta.value = response.data.meta;
    } catch (error) {
        showToast('Failed to load users', 'text-bg-danger');
    } finally {
        loading.value = false;
    }
};

const handleSearch = () => {
    clearTimeout(searchTimeout);

    searchTimeout = setTimeout(() => {
        fetchUsers(1);
    }, 500);
};

const changePage = (page) => {
    fetchUsers(page);
};

const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    selectedPhoto.value = file || null;

    if (file) {
        previewImage.value = URL.createObjectURL(file);
    } else {
        previewImage.value = null;
    }
};

const openCreateModal = () => {
    resetForm();
    editMode.value = false;
    userModal.show();
};

const openEditModal = (user) => {
    resetForm();

    editMode.value = true;
    editUserId.value = user.id;

    form.value = {
        name: user.name,
        email: user.email,
        password: '',
        status: Boolean(user.status),
    };

    previewImage.value = user.photo_url || null;
    userModal.show();
};

const buildFormData = () => {
    const data = new FormData();

    data.append('name', form.value.name ?? '');
    data.append('email', form.value.email ?? '');
    data.append('password', form.value.password ?? '');
    data.append('status', form.value.status ? 1 : 0);

    if (selectedPhoto.value) {
        data.append('photo', selectedPhoto.value);
    }

    return data;
};

const saveUser = async () => {
    errors.value = {};

    try {
        const payload = buildFormData();

        if (editMode.value) {
            await userService.updateUser(editUserId.value, payload);
            showToast('User updated successfully', 'text-bg-success');
        } else {
            await userService.createUser(payload);
            showToast('User created successfully', 'text-bg-success');
        }

        userModal.hide();
        resetForm();
        fetchUsers(meta.value.current_page);
    } catch (error) {
        if (error.response?.status === 422) {
            errors.value = error.response.data.errors || {};
        } else {
            showToast('Something went wrong', 'text-bg-danger');
        }
    }
};

const askDeleteUser = (user) => {
    confirmState.value = {
        type: 'delete',
        user,
        title: 'Delete User',
        message: `Are you sure you want to delete ${user.name}?`,
        confirmText: 'Delete',
        confirmButtonClass: 'btn-danger',
    };

    confirmModal.show();
};

const askToggleStatus = (user) => {
    confirmState.value = {
        type: 'toggle-status',
        user,
        title: user.status ? 'Deactivate User' : 'Activate User',
        message: `Are you sure you want to ${user.status ? 'deactivate' : 'activate'} ${user.name}?`,
        confirmText: user.status ? 'Deactivate' : 'Activate',
        confirmButtonClass: user.status ? 'btn-warning' : 'btn-success',
    };

    confirmModal.show();
};

const handleConfirmedAction = async () => {
    const actionType = confirmState.value.type;
    const user = confirmState.value.user;

    try {
        if (actionType === 'delete') {
            await userService.deleteUser(user.id);
            showToast('User deleted successfully', 'text-bg-success');

            if (users.value.length === 1 && meta.value.current_page > 1) {
                await fetchUsers(meta.value.current_page - 1);
            } else {
                await fetchUsers(meta.value.current_page);
            }
        }

        if (actionType === 'toggle-status') {
            await userService.toggleStatus(user.id);
            showToast(
                user.status ? 'User deactivated successfully' : 'User activated successfully',
                'text-bg-success'
            );
            await fetchUsers(meta.value.current_page);
        }

        confirmModal.hide();
    } catch (error) {
        showToast('Action failed', 'text-bg-danger');
    }
};

const resetForm = () => {
    form.value = {
        name: '',
        email: '',
        password: '',
        status: true,
    };

    editMode.value = false;
    editUserId.value = null;
    errors.value = {};
    selectedPhoto.value = null;
    previewImage.value = null;
};

const showToast = (message, className = 'text-bg-success') => {
    toast.value = { message, className };
    appToast.show();
};

onMounted(() => {
    userModal = new Modal(document.getElementById('userModal'));
    confirmModal = new Modal(document.getElementById('confirmModal'));
    appToast = new Toast(document.getElementById('appToast'), {
        delay: 3000,
    });

    fetchUsers();
});
</script>
