import React, { createContext, useContext, useState, useEffect } from 'react';
import { ChatMessage, TabType } from '../types';

interface ChatContextType {
  messages: ChatMessage[];
  isSending: boolean;
  stagedImage: string | null;
  setStagedImage: (img: string | null) => void;
  isFloatingOpen: boolean;
  setIsFloatingOpen: (open: boolean) => void;
  sendMessage: (text?: string, imageOverride?: string | null, pageContext?: string) => Promise<void>;
  clearChat: () => void;
  currentActiveTab: TabType;
  setCurrentActiveTab: (tab: TabType) => void;
}

const INITIAL_WELCOME_MESSAGE: ChatMessage = {
  id: 'welcome',
  sender: 'bot',
  text: `👋 **Welcome to GenAIde Tutor!**\n\nI'm your **SB015 Population Genetics study buddy** for Malaysian Matriculation Biology.\n\nAsk me anything:
• Explain concepts like Hardy-Weinberg, allele vs genotype frequencies, or genetic drift
• Guide you step-by-step through calculation problems
• Check your working & calculations
• Give you progressive hints without spoiling the final answer!

*What are you working on today?*`,
  time: 'Just now'
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: React.ReactNode; currentTab: TabType }> = ({ children, currentTab }) => {
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const saved = sessionStorage.getItem('genaide_chat_history');
      if (saved) return JSON.parse(saved);
    } catch {}
    return [INITIAL_WELCOME_MESSAGE];
  });

  const [isSending, setIsSending] = useState(false);
  const [stagedImage, setStagedImage] = useState<string | null>(null);
  const [isFloatingOpen, setIsFloatingOpen] = useState(false);
  const [currentActiveTab, setCurrentActiveTab] = useState<TabType>(currentTab);

  useEffect(() => {
    setCurrentActiveTab(currentTab);
  }, [currentTab]);

  useEffect(() => {
    try {
      sessionStorage.setItem('genaide_chat_history', JSON.stringify(messages));
    } catch {}
  }, [messages]);

  const clearChat = () => {
    setMessages([
      {
        id: `welcome-${Date.now()}`,
        sender: 'bot',
        text: `👋 **GenAIde Tutor — New Conversation**\n\nReady for another question! Share a problem, paste your working, or ask a Population Genetics concept you'd like to master.`,
        time: 'Just now'
      }
    ]);
    setStagedImage(null);
  };

  const sendMessage = async (textToSend?: string, imageOverride?: string | null, pageContext?: string) => {
    const rawText = textToSend !== undefined ? textToSend : '';
    const attachedImage = imageOverride !== undefined ? imageOverride : stagedImage;

    if (!rawText.trim() && !attachedImage) return;

    const userTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: rawText.trim() || '(Uploaded problem image for analysis)',
      time: userTime,
      imageUrl: attachedImage || undefined
    };

    // Prepare updated message list
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setStagedImage(null);
    setIsSending(true);

    try {
      // Build contextual prompt if pageContext is provided and message is short
      let apiMessages = updatedMessages.map(m => ({
        sender: m.sender,
        text: m.text,
        imageUrl: m.imageUrl
      }));

      if (pageContext && apiMessages.length > 0) {
        // Append context tag to the latest user message
        const lastIdx = apiMessages.length - 1;
        apiMessages[lastIdx] = {
          ...apiMessages[lastIdx],
          text: `[Context: Student is viewing ${pageContext}]\n${apiMessages[lastIdx].text}`
        };
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages })
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      const replyText = data.text || "I'm ready to guide you. What specific step in the calculation would you like to check?";

      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: replyText,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } catch (err) {
      console.warn("API error, using educational Socratic fallback:", err);

      // Intelligent local fallback aligned strictly with GenAIde Tutor system instruction
      const lower = rawText.toLowerCase();
      let fallback = '';

      if (lower.includes('q2') || lower.includes('q²') || lower.includes('homozygous recessive')) {
        fallback = `### 🧬 Step 1: Understanding q²\n\nIn SB015 Chapter 5:\n• **q²** represents the **genotype frequency of homozygous recessive individuals (aa)**.\n• **Formula:** q² = (Number of homozygous recessive individuals) ÷ (Total population N)\n\n➡️ **Your turn:** What is the number of homozygous recessive individuals and total population given in your question?`;
      } else if (lower.includes('check') || lower.includes('answer') || lower.includes('working')) {
        fallback = `### 🔎 Checking Your Working\n\nLet's verify your calculation step-by-step:\n1. Did you find **q²** from the homozygous recessive phenotype count first?\n2. Did you take the square root of **q²** to obtain recessive allele frequency **q** (q = √q²)?\n3. Did you use **p = 1 − q** to find dominant allele frequency **p**?\n4. Did you calculate genotype frequencies using **p² + 2pq + q² = 1**?\n\n➡️ **Your turn:** Share your intermediate values for q², q, and p so we can pinpoint the exact step!`;
      } else if (lower.includes('hint')) {
        fallback = `### 💡 Progressive Hint (Level 1: Conceptual)\n\n• Remember the golden rule of Population Genetics: **Always find q² from the recessive phenotype (aa) first.**\n• You cannot easily find p² directly from dominant phenotype individuals because dominant phenotypes include both **p² (AA)** and **2pq (Aa)**.\n\n➡️ **Your turn:** What is the recessive trait count or frequency in your problem?`;
      } else if (lower.includes('practice') || lower.includes('question')) {
        fallback = `### 📝 Practice Scenario (Standard SB015 Question)\n\nIn a population of **500 fruit flies**, **80 flies** have vestigial wings (homozygous recessive, aa). Assume the population is in Hardy-Weinberg equilibrium.\n\n1. Calculate the frequency of the recessive allele (q).\n2. Calculate the frequency of the dominant allele (p).\n3. Calculate the number of heterozygous flies (2pq × N).\n\n➡️ **Your turn:** Let's do Step 1 first. What is the value of q² = 80 ÷ 500?`;
      } else {
        fallback = `### 🧬 GenAIde Tutor\n\nLet's break this down together using the standard SB015 Population Genetics method:\n\n**Standard 5-Step Workflow:**\n1. **Step 1:** Calculate homozygous recessive frequency: **q² = (number of aa) ÷ N**\n2. **Step 2:** Calculate recessive allele frequency: **q = √q²**\n3. **Step 3:** Calculate dominant allele frequency: **p = 1 − q**\n4. **Step 4:** Calculate genotype frequencies: **p² (AA)**, **2pq (Aa)**, **q² (aa)**\n5. **Step 5:** Multiply genotype frequency by population (N) for individual numbers\n\n➡️ **Your turn:** What values or question are given in your problem?`;
      }

      setMessages(prev => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: fallback,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        }
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <ChatContext.Provider
      value={{
        messages,
        isSending,
        stagedImage,
        setStagedImage,
        isFloatingOpen,
        setIsFloatingOpen,
        sendMessage,
        clearChat,
        currentActiveTab,
        setCurrentActiveTab
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useGenaideChat = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useGenaideChat must be used within a ChatProvider');
  }
  return context;
};
