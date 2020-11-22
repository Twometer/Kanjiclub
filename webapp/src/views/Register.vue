<template>
    <div class="auth-bg">
        <div
            class="container h-100 d-flex align-items-center justify-content-center flex-column"
        >
            <h1 class="auth-header">漢字 club</h1>
            <div class="shadow-lg p-3 bg-white rounded" style="width: 18rem;">
                <div class="card-body">
                    <form @submit.prevent="submit">
                        <div class="alert alert-warning" v-if="error != null">
                            {{ error }}
                        </div>

                        <div class="form-group">
                            <label for="email">Email</label>
                            <input
                                id="email"
                                class="form-control"
                                type="email"
                                placeholder="Email address"
                                v-model="form.email"
                            />
                        </div>

                        <div class="form-group">
                            <label for="username">Username</label>
                            <input
                                id="username"
                                class="form-control"
                                type="text"
                                placeholder="Username"
                                v-model="form.username"
                            />
                        </div>

                        <div class="form-group">
                            <label for="password">Password</label>
                            <input
                                id="password"
                                class="form-control"
                                type="password"
                                placeholder="Password"
                                v-model="form.password"
                            />
                        </div>

                        <div class="form-group">
                            <label for="passwordConfirm"
                                >Confirm password</label
                            >
                            <input
                                id="passwordConfirm"
                                class="form-control"
                                type="password"
                                placeholder="Confirm password"
                                v-model="form.passwordConfirm"
                            />
                        </div>

                        <button type="submit" class="btn btn-primary card-link">
                            Register
                        </button>
                        <router-link to="/login" class="card-link"
                            >Back</router-link
                        >
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
@import url('../assets/auth.css');
</style>

<script>
import { mapActions } from 'vuex';

function checkFormEmpty(obj) {
    for (let key in obj) if (obj[key].trim() === '') return true;
    return false;
}

export default {
    name: 'Register',
    components: {},
    data() {
        return {
            form: {
                email: '',
                username: '',
                password: '',
                passwordConfirm: ''
            },
            error: null
        };
    },
    methods: {
        ...mapActions(['Register']),
        async submit() {
            if (checkFormEmpty(this.form)) {
                return;
            }

            if (this.form.password !== this.form.passwordConfirm) {
                this.error = 'Passwords do not match';
                return;
            }

            try {
                this.error = null;
                await this.Register(this.form);
                this.$router.push('/login');
            } catch (e) {
                this.error = 'This username is already taken';
            }
        }
    }
};
</script>
