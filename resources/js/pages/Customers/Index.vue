<template>
    <div class="card shadow-sm">
        <div class="card-header bg-primary text-white">
            <h3 class="mb-0">Customers Management</h3>
        </div>

        <div class="card-body">
            <div
                v-if="alert.message"
                class="alert"
                :class="`alert-${alert.type}`"
            >
                {{ alert.message }}
            </div>

            <CustomerForm
                :form="form"
                :edit-mode="editMode"
                :errors="errors"
                @submit-form="saveCustomer"
                @cancel-edit="resetForm"
            />

            <hr>

            <CustomerTable
                :customers="customers"
                @edit-customer="editCustomer"
                @delete-customer="deleteCustomer"
            />

        </div>
    </div>
</template>

<script setup>
import {ref, onMounted} from "vue";
import CustomerForm from "../../components/customers/CustomerForm.vue";
import CustomerTable from "../../components/customers/CustomerTable.vue";
import customerService from "../../services/customerService";

const customers = ref([]);
const editMode = ref(false);
const editCustomerId = ref(null);

const form = ref({
    name: '',
    email: '',
    phone: '',
    address: '',
});

const errors = ref({});
const alert = ref({
    type: 'success',
    message: '',
});

const fetchCustomers = async () => {
    try {
        const response = await customerService.getCustomers();
        customers.value = response.data.data;
    } catch (error) {
        showAlert('danger', 'Failed to load customers');
    }
};

const saveCustomer = async () => {
    errors.value = {};

    try {
        if (editMode.value) {
            await customerService.updateCustomer(editCustomerId.value, form.value)
            showAlert('success', 'Customer updated successfully')
        }
        else {
            await customerService.createCustomer(form.value)
            showAlert('success', 'Customer created successfully')
        }

        resetForm();
        fetchCustomers();

    } catch (error) {
        if (error.response?.status === 422) {
            errors.value = error.response.data.errors || {};
        } else {
            showAlert('danger', 'Something went wrong');
        }    }
}

const editCustomer = (customer) => {
    editMode.value = true;
    editCustomerId.value = customer.id;

    form.value = {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
    }

    errors.value = {};
}

const deleteCustomer = async (id) => {
    const confirmed = confirm("Are you sure you want to delete this customer?");
    if (!confirmed) return;

    try {
        await customerService.deleteCustomer(id);
        showAlert('success', 'Customer deleted successfully');
        fetchCustomers();
    } catch (error) {
        showAlert('danger', 'Failed to delete customer');
    }
}

const resetForm = () => {
    form.value = {
        name: '',
        email: '',
        phone: '',
        address: '',
    }

    editMode.value = false;
    editCustomerId.value = null;
    errors.value = {};
};

const showAlert = (type, message) => {
    alert.value = { type, message };

    setTimeout(() => {
        alert.value.message = '';
    }, 3000);
}

onMounted(() => {
    fetchCustomers();
});

</script>
