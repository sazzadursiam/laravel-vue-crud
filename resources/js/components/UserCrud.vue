<template>
<!--  for single page  -->
    <div class="container mt-5">
        <div class="card shadow">
            <div class="card-header bg-primary text-white">
                <h4>User CRUD (Laravel + Vue)</h4>
            </div>

            <div class="card-body">

                <!-- Message -->
                <div v-if="message" class="alert alert-success">
                    {{ message }}
                </div>

                <!-- Form -->
                <form @submit.prevent="saveUser" class="mb-4">
                    <div class="row">
                        <div class="col-md-4">
                            <input v-model="form.name" class="form-control" placeholder="Name">
                        </div>

                        <div class="col-md-4">
                            <input v-model="form.email" class="form-control" placeholder="Email">
                        </div>

                        <div class="col-md-4">
                            <input v-model="form.password" type="password" class="form-control" placeholder="Password">
                        </div>
                    </div>

                    <div class="mt-3">
                        <button class="btn btn-success">
                            {{ editMode ? 'Update User' : 'Add User' }}
                        </button>

                        <button v-if="editMode" type="button" class="btn btn-secondary ms-2" @click="resetForm">
                            Cancel
                        </button>
                    </div>
                </form>

                <!-- Table -->
                <table class="table table-bordered table-hover">
                    <thead class="table-dark">
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th width="180">Action</th>
                    </tr>
                    </thead>

                    <tbody>
                    <tr v-for="user in users" :key="user.id">
                        <td>{{ user.id }}</td>
                        <td>{{ user.name }}</td>
                        <td>{{ user.email }}</td>
                        <td>
                            <button class="btn btn-warning btn-sm me-2" @click="editUser(user)">
                                Edit
                            </button>

                            <button class="btn btn-danger btn-sm" @click="deleteUser(user.id)">
                                Delete
                            </button>
                        </td>
                    </tr>

                    <tr v-if="users.length === 0">
                        <td colspan="4" class="text-center">No users found</td>
                    </tr>
                    </tbody>
                </table>

            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref, onMounted } from 'vue';

    const users = ref([]);
    const message = ref('');
    const editMode = ref(false);
    const editUserId = ref(null);

    const form = ref({
        name: '',
        email: '',
        password: '',
    });

    const fetchUsers = async () => {
        const response = await fetch('/api/users');
        users.value = await response.json();
    };

    const saveUser = async () => {
        try {
            const method = editMode.value ? 'PUT' : 'POST';
            const url = editMode.value ? `/api/users/${editUserId.value}` : '/api/users';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(form.value),
            });

            const data = await response.json();

            if (response.ok) {
                message.value = editMode.value ? 'User updated successfully!' : 'User added successfully!';
                resetForm();
                fetchUsers();
            } else {
                message.value = 'An error occurred. Please try again.';
            }
        } catch (error) {
            message.value = 'An error occurred. Please try again.';
        }
    }

    const editUser = (user) => {
        editMode.value = true;
        editUserId.value = user.id;
        form.value.name = user.name;
        form.value.email = user.email;
        form.value.password = '';
    }

    const deleteUser = async (id) => {
        if (!confirm('Are you sure you want to delete this user?')) {
            return;
        }
        const response = await fetch(`/api/users/${id}`, {
            method: 'DELETE',
            headers: {
                'Accept': 'application/json',
            },
        });

        if (response.ok) {
            message.value = 'User deleted successfully!';
            fetchUsers();
        } else {
            message.value = 'An error occurred. Please try again.';
        }
    }

    const resetForm = () => {
        editMode.value = false;
        editUserId.value = null;
        form.value.name = '';
        form.value.email = '';
        form.value.password = '';
    }

    onMounted(() => {
        fetchUsers();
    });

</script>

