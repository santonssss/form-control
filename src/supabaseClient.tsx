import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://cqakxetgrkdcjbqvraph.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNxYWt4ZXRncmtkY2picXZyYXBoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzQyNjE3MjMsImV4cCI6MjA0OTgzNzcyM30.OWIPlUAPlzfnyxfRXCGugbFFyg3zAgD2ElqPRm-PrwA";
export const supabase = createClient(supabaseUrl, supabaseKey);
