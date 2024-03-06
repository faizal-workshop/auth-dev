const supabase = require('../src/supabase');

module.exports = {
    getDocs: async function () {
        const { data } = await supabase
            .from('api-documentation')
            .select('*')
            .order('id', { ascending: true });

        return data;
    },
    login: async function (userData) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email: userData.email,
            password: userData.password,
        });

        return { data, error };
    },
    register: async function (userData) {
        const { data, error } = await supabase.auth.signUp({
            email: userData.email,
            password: userData.password,
            options: {
                data: {
                    name: userData.name,
                },
            },
        });

        return { data, error };
    },
    checkToken: async function (token) {
        const { error } = await supabase.auth.getUser(token);
        return { error };
    },
    getUser: async function () { },
    getUserId: async function () { },
    updateUser: async function () { },
    deleteUser: async function () { },
    deleteUserId: async function () { },
};
