import { computed } from 'vue';
import { useAuthStore } from '@/stores/auth';
import { useRouter } from 'vue-router';

export function useAuth() {
  const authStore = useAuthStore();
  const router = useRouter();

  const user = computed(() => authStore.user);
  const isAuthenticated = computed(() => authStore.isAuthenticated);
  const loading = computed(() => authStore.loading);
  const error = computed(() => authStore.error);

  const login = async (username, password) => {
    const success = await authStore.login(username, password);
    if (success) {
      router.push({ name: 'home' });
    }
    return success;
  };

  const logout = async () => {
    await authStore.logout();
    router.push({ name: 'login' });
  };

  const requireAuth = () => {
    if (!isAuthenticated.value) {
      router.push({ name: 'login' });
      return false;
    }
    return true;
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    logout,
    requireAuth,
  };
}
