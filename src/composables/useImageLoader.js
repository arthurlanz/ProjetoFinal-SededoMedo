import { ref } from 'vue';
import { getImageUrl, getBackdropUrl } from '@/plugins/axios';

export function useImageLoader() {
  const imageLoaded = ref(false);
  const imageError = ref(false);

  const onImageLoad = () => {
    imageLoaded.value = true;
    imageError.value = false;
  };

  const onImageError = () => {
    imageLoaded.value = false;
    imageError.value = true;
  };

  const getPosterUrl = (path, size = 'w500') => {
    return getImageUrl(path, size);
  };

  const getBackdrop = (path, size = 'original') => {
    return getBackdropUrl(path, size);
  };

  const resetImageState = () => {
    imageLoaded.value = false;
    imageError.value = false;
  };

  return {
    imageLoaded,
    imageError,
    onImageLoad,
    onImageError,
    getPosterUrl,
    getBackdrop,
    resetImageState,
  };
}
