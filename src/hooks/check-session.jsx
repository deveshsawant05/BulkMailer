import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { useRouter } from 'next/navigation';

const useCheckSession = () => {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);
    const supabase = createClient();
    const router = useRouter();

    useEffect(() => {
        const fetchUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();

            if (session) {
                setUser(session.user);
                setLoading(false);
            } else {
                setLoading(false);
                router.push('/login');
            }
        };

        fetchUser();
    }, [supabase, router]);

    return { loading, user };
};

export default useCheckSession;