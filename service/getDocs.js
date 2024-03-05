const supabase = require('../src/supabase');

async function getDocs() {
    const { data } = await supabase
        .from('api-documentation')
        .select('*')
        .order('id', { ascending: true });

    return data;
}

module.exports = getDocs;
