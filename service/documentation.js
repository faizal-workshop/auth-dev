const documentation = [
    {
        method: 'post',
        path: '/login',
        description: 'Buat login, dapetin token baru',
    },
    {
        method: 'post',
        path: '/register',
        description: 'Buat daftarin akun baru',
    },
    {
        method: 'get',
        path: '/check-token',
        description: 'Buat ngecek token masih valid ga',
    },
    {
        method: 'get',
        path: '/user',
        description: 'Nampilin list semua user',
        isProtected: true,
    },
    {
        method: 'get',
        path: '/user/:id',
        description: 'Nampilin info user, berdasarkan ID',
        isProtected: true,
    },
    {
        method: 'patch',
        path: '/user/:id',
        description: 'Buat update data user',
        isProtected: true,
    },
    {
        method: 'delete',
        path: '/user',
        description: 'Hapus semua user',
        isProtected: true,
    },
    {
        method: 'delete',
        path: '/user/:id',
        description: 'Hapus user, berdasarkan ID',
        isProtected: true,
    },
];

module.exports = documentation;
