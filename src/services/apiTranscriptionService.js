import { apiClient } from './apiClient';

export const apiTranscriptionService = {
  async transcribe({ text, accent = 'american', useWeakForms = true, ignoreStress = false, applySimplification = false }) {
    const payload = { text, accent, useWeakForms, ignoreStress, applySimplification };
    return apiClient.post('/transcribe', payload);
  },
  async ipa(word, accent = 'american') {
    return apiClient.get('/ipa', { word, accent });
  }
};
