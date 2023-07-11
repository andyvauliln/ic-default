'use client'
import { useSupabase } from '@/components/supabase-provider';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const rounter = useRouter()
  const { supabase } = useSupabase();
  supabase.auth.signOut().then(
    r => rounter.push('/signin')
  );
  return null
}
