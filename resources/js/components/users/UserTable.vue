<template>
    <div class="table-responsive">
        <table class="table table-bordered table-hover">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th width="180">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="users.length === 0">
                    <td colspan="4" class="text-center">No users found</td>
                </tr>
                <tr v-for="user in users" :key="user.id">
                    <td>{{ user.id }}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.email }}</td>
                    <td>
                        <button
                            class="btn btn-warning btn-sm me-2"
                            @click="$emit('edit-user', user)"
                        >
                            Edit
                        </button>

                        <button
                            class="btn btn-danger btn-sm"
                            @click="$emit('delete-user', user.id)"
                        >
                            Delete
                        </button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script setup>
defineProps({
    users: {
        type: Array,
        default: () => [],
    }
});

defineEmits(['edit-user', 'delete-user']);
</script>

