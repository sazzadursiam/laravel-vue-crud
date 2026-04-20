<template>
    <div class="card shadow-sm">
        <div class="card-header bg-primary text-white d-flex justify-content-between align-items-center">
            <h4 class="mb-0">User Management</h4>
            <button
                class="btn btn-light btn-sm"
                @click="openCreateModal"
            >
                Add User
            </button>
        </div>

        <div class="card-body">
            <div
                v-if="alert.message"
                class="alert"
                :class="`alert-${alert.type}`"
            >
                {{ alert.message }}
            </div>

            <div class="row mb-3">
                <div class="col-md-4">
                    <input
                        v-model="search"
                        type="text"
                        class="form-control"
                        placeholder="Search users by name or email"
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
                @delete-user="deleteUser"
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
        @photo-changed="handlePhotoChange"
    />
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {Modal} from "bootstrap";
import UserTable from '../../components/users/UserTable.vue';
import UserModal from '../../components/users/UserModal.vue';
import UserPagination from "../../components/users/UserPagination.vue";
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

const alert = ref({
    type: 'success',
    message: '',
});

const form = ref({
    name: '',
    email: '',
    password: '',
});

let userModal = null;
let searchTimeout = null;

const fetchUsers = async (page = 1) => {
    loading.value = true;

    try {
        const response = await userService.getUsers({
            search: search.value,
            page: page
        });
        users.value = response.data.data;
        meta.value = response.data.meta;
    } catch (error) {
        showAlert('danger', 'Failed to load users');
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
}

const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        selectedPhoto.value = file;
        previewImage.value = URL.createObjectURL(file);
    } else {
        selectedPhoto.value = null;
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
    };

    errors.value = {};
    previewImage.value = user.photo_url || null;
    userModal.show();
};

const buildFormData = () => {
    const data = new FormData();

    data.append('name', form.value.name ?? '');
    data.append('email', form.value.email ?? '');
    data.append('password', form.value.password ?? '');

    if (selectedPhoto.value) {
        data.append('photo', selectedPhoto.value);
    }

    return data;
}

const saveUser = async () => {
    errors.value = {};

    try {
        const payload = buildFormData();
        if (editMode.value) {
            await userService.updateUser(editUserId.value, payload);
            showAlert('success', 'User updated successfully');
        } else {
            await userService.createUser(payload);
            showAlert('success', 'User created successfully');
        }
        userModal.hide();
        resetForm();
        fetchUsers(meta.value.current_page);
    } catch (error) {
        if (error.response?.status === 422) {
            errors.value = error.response.data.errors || {};
        } else {
            showAlert('danger', 'Something went wrong');
        }
    }
};


const deleteUser = async (id) => {
    const confirmed = confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    try {
        await userService.deleteUser(id);
        showAlert('success', 'User deleted successfully');

        if (users.value.length === 1 && meta.value.current_page > 1) {
            fetchUsers(meta.value.current_page - 1);
        } else {
            fetchUsers(meta.value.current_page);
        }
    } catch (error) {
        showAlert('danger', 'Delete failed');
    }
};

const resetForm = () => {
    form.value = {
        name: '',
        email: '',
        password: '',
    };

    editMode.value = false;
    editUserId.value = null;
    errors.value = {};
    selectedPhoto.value = null;
    previewImage.value = null;
};

const showAlert = (type, message) => {
    alert.value = {type, message};

    setTimeout(() => {
        alert.value.message = '';
    }, 3000);
};

onMounted(() => {
    const modalElement = document.getElementById('userModal');
    userModal = new Modal(modalElement);

    fetchUsers();
});
</script>
