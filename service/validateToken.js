const supabase = require('../src/supabase');

async function validateToken(token) {
    const { error } = await supabase.auth.getUser(token);
    return error;
}

module.exports = validateToken;
