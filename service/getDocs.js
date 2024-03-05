const supabase = require('../src/supabase');


async function getDocs() {
    const { data } = await supabase
        .from('api-documentation')
        .select('*');

    return data;
}

module.exports = getDocs;
