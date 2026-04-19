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

<!--            <hr>-->

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
        :edit-user-id="editUserId"
        :errors="errors"
        @submit-form="saveUser"
        @cancel-form="resetForm"
    />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import {Modal} from "bootstrap";
import UserTable from '../../components/users/UserTable.vue';
import UserModal from '../../components/users/UserModal.vue';
import UserPagination from "../../components/users/UserPagination.vue";
import userService from '../../services/userService';

const users = ref([]);
const search = ref('');
const editMode = ref(false);
const editUserId = ref(null);
const errors = ref({});

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

const fetchUsers = async (page = 1) => {
    try {
        const response = await userService.getUsers({
            search: search.value,
            page: page
        });
        users.value = response.data.data;
        meta.value = response.data.meta;
    } catch (error) {
        showAlert('danger', 'Failed to load users');
    }
};

const handleSearch = () => {
    fetchUsers(1);
};

const changePage = (page) => {
    fetchUsers(page);
}

const openCreateModal = () => {
    resetForm();
    editMode.value = false;
    userModal.show();
};

const openEditModal = (user) => {
    editMode.value = true;
    editUserId.value = user.id;

    form.value = {
        name: user.name,
        email: user.email,
        password: '',
    };

    errors.value = {};
    userModal.show();
};

const saveUser = async () => {
    errors.value = {};

    try {
        if (editMode.value) {
            await userService.updateUser(editUserId.value, form.value);
            showAlert('success', 'User updated successfully');
        } else {
            await userService.createUser(form.value);
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

// const editUser = (user) => {
//     editMode.value = true;
//     editUserId.value = user.id;
//
//     form.value = {
//         name: user.name,
//         email: user.email,
//         password: '',
//     };
//
//     errors.value = {};
// };

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
};

const showAlert = (type, message) => {
    alert.value = { type, message };

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
