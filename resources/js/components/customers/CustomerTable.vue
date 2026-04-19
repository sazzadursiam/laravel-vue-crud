<template>
    <div class="table-responsive">
        <table class="table table-bordered table-hover">
            <thead class="table-dark">
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th width="180">Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-if="customers.length === 0">
                    <td colspan="4" class="text-center">No customers found</td>
                </tr>
                <tr v-for="customer in customers" :key="customer.id">
                    <td>{{ customer.id }}</td>
                    <td>{{ customer.name }}</td>
                    <td>{{ customer.email }}</td>
                    <td>{{ customer.phone }}</td>
                    <td>{{ customer.address }}</td>
                    <td>
                        <button class="btn btn-warning btn-sm me-2" @click="$emit('edit-customer', customer)">
                            Edit
                        </button>

                        <button class="btn btn-danger btn-sm" @click="$emit('delete-customer', customer.id)">
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
        customers: Array
    })
    defineEmits(['edit-customer', 'delete-customer'])
</script>

