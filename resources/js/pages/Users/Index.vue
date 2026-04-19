<template>
    <div class="card shadow-sm">
        <div class="card-header bg-primary text-white">
            <h4 class="mb-0">User Management</h4>
        </div>

        <div class="card-body">
            <div
                v-if="alert.message"
                class="alert"
                :class="`alert-${alert.type}`"
            >
                {{ alert.message }}
            </div>

            <UserForm
                :form="form"
                :edit-mode="editMode"
                :errors="errors"
                @submit-form="saveUser"
                @cancel-edit="resetForm"
            />

            <hr>

            <UserTable
                :users="users"
                @edit-user="editUser"
                @delete-user="deleteUser"
            />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
// import UserForm from '../../components/users/UserForm.vue';
import UserForm from '@/components/users/UserForm.vue';
import UserTable from '../../components/users/UserTable.vue';
import userService from '../../services/userService';

const users = ref([]);
const editMode = ref(false);
const editUserId = ref(null);

const form = ref({
    name: '',
    email: '',
    password: '',
});

const errors = ref({});
const alert = ref({
    type: 'success',
    message: '',
});

const fetchUsers = async () => {
    try {
        const response = await userService.getUsers();
        users.value = response.data.data;
    } catch (error) {
        showAlert('danger', 'Failed to load users');
    }
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

        resetForm();
        fetchUsers();
    } catch (error) {
        if (error.response?.status === 422) {
            errors.value = error.response.data.errors || {};
        } else {
            showAlert('danger', 'Something went wrong');
        }
    }
};

const editUser = (user) => {
    editMode.value = true;
    editUserId.value = user.id;

    form.value = {
        name: user.name,
        email: user.email,
        password: '',
    };

    errors.value = {};
};

const deleteUser = async (id) => {
    const confirmed = confirm('Are you sure you want to delete this user?');
    if (!confirmed) return;

    try {
        await userService.deleteUser(id);
        showAlert('success', 'User deleted successfully');
        fetchUsers();
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
    fetchUsers();
});
</script>
