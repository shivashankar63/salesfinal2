import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<'owner' | 'manager' | 'salesman' | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError) {
          setError(authError.message);
          setLoading(false);
          return;
        }

        if (user) {
          setUser(user);
          
          // Fetch user role from database
          const { data, error: dbError } = await supabase
            .from('users')
            .select('role')
            .eq('id', user.id)
            .single();

          if (dbError) {
            console.error('Error fetching user role:', dbError);
          } else if (data) {
            setUserRole(data.role as 'owner' | 'manager' | 'salesman');
          }
        } else {
          setUser(null);
          setUserRole(null);
        }
      } catch (err) {
        console.error('Error getting user:', err);
        setError('Failed to load user');
      } finally {
        setLoading(false);
      }
    };

    getUser();

    // Set up auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        
        if (session?.user) {
          const { data } = await supabase
            .from('users')
            .select('role')
            .eq('id', session.user.id)
            .single();
          
          if (data) {
            setUserRole(data.role as 'owner' | 'manager' | 'salesman');
          }
        } else {
          setUserRole(null);
        }
      }
    );

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return false;
      }

      if (data.user) {
        setUser(data.user);
        
        // Fetch user role
        const { data: userData } = await supabase
          .from('users')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (userData) {
          setUserRole(userData.role as 'owner' | 'manager' | 'salesman');
          
          // Redirect to appropriate dashboard
          const dashboardRoute = {
            owner: '/owner',
            manager: '/manager',
            salesman: '/salesman',
          };
          navigate(dashboardRoute[userData.role as 'owner' | 'manager' | 'salesman']);
        }
      }

      return true;
    } catch (err) {
      setError('Login failed');
      return false;
    }
  };

  const signup = async (email: string, password: string, fullName: string, role: 'owner' | 'manager' | 'salesman') => {
    try {
      setError(null);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        setError(error.message);
        return false;
      }

      if (data.user) {
        // Create user profile in database
        const { error: profileError } = await supabase
          .from('users')
          .insert([{
            id: data.user.id,
            email,
            full_name: fullName,
            role,
          }]);

        if (profileError) {
          setError(profileError.message);
          return false;
        }

        setUser(data.user);
        setUserRole(role);
        
        // Redirect to appropriate dashboard
        const dashboardRoute = {
          owner: '/owner',
          manager: '/manager',
          salesman: '/salesman',
        };
        navigate(dashboardRoute[role]);
      }

      return true;
    } catch (err) {
      setError('Signup failed');
      return false;
    }
  };

  const logout = async () => {
    try {
      setError(null);
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        setError(error.message);
        return false;
      }

      setUser(null);
      setUserRole(null);
      navigate('/');
      return true;
    } catch (err) {
      setError('Logout failed');
      return false;
    }
  };

  return {
    user,
    userRole,
    loading,
    error,
    login,
    signup,
    logout,
    isAuthenticated: !!user,
  };
};

export const useProtectedRoute = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/');
    }
  }, [user, loading, navigate]);

  return { loading };
};
