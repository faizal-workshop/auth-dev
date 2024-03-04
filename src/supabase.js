const { SUPABASE_URL, SUPABASE_KEY } = require('./configs');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

module.exports = supabase;
