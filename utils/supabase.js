

const { createClient } = require('@supabase/supabase-js');
const supabase = createClient('https://btjwlzwjeoqkmobrdafg.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ0andsendqZW9xa21vYnJkYWZnIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDg3NzkzOTQsImV4cCI6MTk2NDM1NTM5NH0.ZUKFqjSxRqRisZk5_wjgWAOmIUKMGuWsUBm5x_hvrKE');

module.exports = supabase;