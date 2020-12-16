<template>
    <div id="app">
        <nav
            class="navbar fixed-top navbar-light bg-light mobile-nav"
            style="height: 56px"
        >
            <button
                class="navbar-toggler p-0 border-0"
                type="button"
                data-toggle="offscreen"
            >
                <span class="navbar-toggler-icon"></span>
            </button>
        </nav>

        <div class="container">
            <div class="row">
                <div class="col-md-4 col-lg-3">
                    <nav class="nav flex-column offscreen-collapse">
                        <img class="nav-brand" src="/img/logo.png" />
                        <hr />
                        <span class="nav-header">Menu</span>
                        <router-link class="nav-link" to="/"
                            >Dashboard</router-link
                        >
                        <router-link class="nav-link" to="/practice/select"
                            >Practice</router-link
                        >
                        <router-link class="nav-link" to="/edit/select"
                            >Edit</router-link
                        >
                        <router-link class="nav-link" to="/note/select"
                            >Notes</router-link
                        >
                        <router-link class="nav-link" to="/search"
                            >Search</router-link
                        >
                        <hr />
                        <span class="nav-header">User</span>
                        <router-link class="nav-link" to="/settings"
                            >Settings</router-link
                        >
                        <a
                            class="nav-link"
                            href="#"
                            data-toggle="modal"
                            data-target="#deleteModal"
                            >Log out</a
                        >
                    </nav>
                </div>

                <div class="col-md-8 col-lg-9">
                    <router-view />
                </div>
            </div>
        </div>

        <div id="deleteModal" class="modal fade" tabindex="-1">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Log out?</h5>
                        <button
                            type="button"
                            class="close"
                            data-dismiss="modal"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <p>Do you really want to log out?</p>
                    </div>
                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-secondary"
                            data-dismiss="modal"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            class="btn btn-primary"
                            data-dismiss="modal"
                            v-on:click="handleLogout"
                        >
                            Log out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions } from 'vuex';

export default {
    methods: {
        ...mapActions(['LogOut']),

        async handleLogout() {
            await this.LogOut();
            this.$router.push('/login');
        }
    },
    async mounted() {
        if (!this.$store.getters.LoggedIn) return;

        try {
            await this.$store.dispatch('GetUserInfo');
        } catch (e) {
            if (e.response.status == 401) {
                await this.$store.dispatch('ResetUser');
                this.$router.push('/login');
            } else {
                console.warn('Unknown failure while getting user info');
            }
        }
    }
};
</script>

<style></style>
