
import { GoogleGenAI, GenerateContentResponse, Type, Modality, LiveServerMessage, Blob } from "@google/genai";

const getAI = () => new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

export function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768;
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

export interface LiveSessionCallbacks {
  onAudioData: (buffer: AudioBuffer) => void;
  onTranscription: (text: string, isUser: boolean) => void;
  onError: (error: any) => void;
  onClose: () => void;
}

export const startLiveSession = async (
  productContext: string,
  callbacks: LiveSessionCallbacks
) => {
  const ai = getAI();
  let nextStartTime = 0;
  const inputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
  const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

  const sessionPromise = ai.live.connect({
    model: 'gemini-2.5-flash-native-audio-preview-12-2025',
    callbacks: {
      onopen: () => {
        const source = inputAudioContext.createMediaStreamSource(stream);
        const scriptProcessor = inputAudioContext.createScriptProcessor(4096, 1, 1);
        scriptProcessor.onaudioprocess = (event) => {
          const inputData = event.inputBuffer.getChannelData(0);
          const pcmBlob = createBlob(inputData);
          sessionPromise.then((session) => {
            session.sendRealtimeInput({ media: pcmBlob });
          });
        };
        source.connect(scriptProcessor);
        scriptProcessor.connect(inputAudioContext.destination);
      },
      onmessage: async (message: LiveServerMessage) => {
        const base64Audio = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
        if (base64Audio) {
          nextStartTime = Math.max(nextStartTime, outputAudioContext.currentTime);
          const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1);
          callbacks.onAudioData(audioBuffer);
          
          const source = outputAudioContext.createBufferSource();
          source.buffer = audioBuffer;
          source.connect(outputAudioContext.destination);
          source.start(nextStartTime);
          nextStartTime += audioBuffer.duration;
        }

        if (message.serverContent?.outputTranscription) {
          callbacks.onTranscription(message.serverContent.outputTranscription.text, false);
        } else if (message.serverContent?.inputTranscription) {
          callbacks.onTranscription(message.serverContent.inputTranscription.text, true);
        }
      },
      onerror: (e) => callbacks.onError(e),
      onclose: () => callbacks.onClose(),
    },
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
        voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
      },
      systemInstruction: `You are a real-time product assistant for: ${productContext}. Listen carefully and respond naturally via voice. Keep answers concise and technical.`,
      inputAudioTranscription: {},
      outputAudioTranscription: {},
    },
  });

  return {
    stop: async () => {
      const session = await sessionPromise;
      session.close();
      stream.getTracks().forEach(t => t.stop());
      inputAudioContext.close();
      outputAudioContext.close();
    }
  };
};

export interface AIResponse {
  text: string;
  sources?: { title: string; uri: string }[];
}

export const getGeminiResponse = async (
  prompt: string, 
  productContext?: string,
  usePro: boolean = false
): Promise<AIResponse> => {
  const ai = getAI();
  const model = usePro ? 'gemini-3-pro-preview' : 'gemini-3-flash-preview';
  const systemInstruction = `You are "SmartGuide AI", a professional product support engineer. Assisting with: ${productContext || 'General Product Support'}.`;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: { systemInstruction, tools: [{ googleSearch: {} }] },
    });
    const textResult = response.text || "";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const sources = chunks.filter(c => c.web).map(c => ({ title: c.web?.title || 'Source', uri: c.web?.uri || '' }));
    return { text: textResult, sources };
  } catch (error) {
    return { text: "An error occurred." };
  }
};

export const analyzeFaultImage = async (base64Image: string, productModel: string): Promise<string> => {
  const ai = getAI();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ inlineData: { data: base64Image, mimeType: "image/jpeg" } }, { text: `Analyze this ${productModel} for faults.` }]
      },
    });
    return response.text || "Analysis failed.";
  } catch (error) {
    return "Failed to analyze image.";
  }
};
