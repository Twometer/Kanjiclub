<template>
    <div class="auth-bg">
        
        <div class="container h-100 d-flex align-items-center justify-content-center flex-column">
            <h1>漢字 club</h1>
            <div class="shadow-lg p-3 bg-white rounded" style="width: 18rem;">
                <div class="card-body">
                    <form>
                        <div class="form-group">
                            <label for="email">Email</label>
                            <input id="email" class="form-control" type="email" placeholder="Email address">
                        </div>

                        <div class="form-group">
                            <label for="username">Username</label>
                            <input id="username" class="form-control" type="text" placeholder="Username">
                        </div>

                        <div class="form-group">
                            <label for="password">Password</label>
                            <input id="password" class="form-control" type="password" placeholder="Password">
                        </div>

                        <div class="form-group">
                            <label for="passwordConfirm">Confirm password</label>
                            <input id="passwordConfirm" class="form-control" type="password" placeholder="Confirm password">
                        </div>

                        <button type="submit" class="btn btn-primary card-link">Register</button>
                        <router-link to="/login" class="card-link">Back</router-link>
                    </form>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
    @import url("auth.css");
</style>