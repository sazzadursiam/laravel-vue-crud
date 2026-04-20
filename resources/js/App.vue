<template>
    <div>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
            <div class="container">
                <router-link to="/" class="navbar-brand">
                    Practise
                </router-link>
            </div>
        </nav>

        <div class="container mt-4">
            <router-view />
        </div>
    </div>
</template>
