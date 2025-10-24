import { apiClient } from './apiClient';

export const apiTranscriptionService = {
  async transcribe({ text, accent = 'american', useWeakForms = true, applySimplification = false }) {
    const payload = { text, accent, useWeakForms, applySimplification };
    return apiClient.post('/transcribe', payload);
  },
  async ipa(word, accent = 'american') {
    return apiClient.get('/ipa', { word, accent });
  }
};
