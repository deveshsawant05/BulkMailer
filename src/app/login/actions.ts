'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)
  console.log('Error:', error)
  if (error) {
    return { error }
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
export async function signInWithGoogle() {
  const supabase = await createClient();
  
  const redirectTo = process.env.NODE_ENV === 'production' 
    ? `${process.env.NEXT_PUBLIC_SITEURL}/dashboard` 
    : `http://localhost:3000/dashboard`;

  console.log('Redirecting to:', redirectTo);

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
    },
  });

  if (error) {
    console.error('OAuth error:', error);
    // Handle error appropriately
    return;
  }

  if (data?.url) {
    console.log('Redirect URL:', data.url);
    return redirect(data.url);
  } else {
    console.error('No redirect URL returned from OAuth');
  }
}
export async function signInWithGitHub() {
  const supabase = await createClient();
  const redirectTo = process.env.NODE_ENV === 'production' 
    ? `${process.env.NEXT_PUBLIC_SITEURL}/dashboard` 
    : `http://localhost:3000/dashboard`;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'github',
    options: {
      redirectTo,
    },
  });
  if (error) {
    console.error(error);
    // Handle error appropriately
    return;
  }
  if (data?.url) {
    return redirect(data.url);
  }
}