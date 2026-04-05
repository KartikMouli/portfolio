'use client';

import { useState, useEffect, useRef } from 'react';
import { produce } from 'immer';
import { useGetState, useBoolean } from 'ahooks';
import {
  fetchConversations,
  fetchChatList,
  generationConversationName,
  sendChatMessage,
  fetchSuggestedQuestions,
  fetchAppParams,
  updateFeedback,
  stopChatMessage,
} from '@/services/dify';
import useConversation from './use-conversation';
import type {
  ChatItem,
  Feedbacktype,
  VisionFile,
  ConversationItem,
  AppParams,
} from '@/types/app';
import { APP_ID } from '@/config/dify';
import { toast } from 'sonner';

const generateNewChatListWithOpenStatement = (
  introduction?: string,
  suggestedQuestions?: string[]
): ChatItem[] => {
  if (!introduction) return [];
  return [
    {
      id: `opening-${Date.now()}`,
      content: introduction,
      isAnswer: true,
      feedbackDisabled: true,
      isOpeningStatement: true,
      suggestedQuestions: suggestedQuestions || [],
    },
  ];
};

export function useChatMessages() {
  const {
    conversationList,
    setConversationList,
    currConversationId,
    getCurrConversationId,
    setCurrConversationId,
    getConversationIdFromStorage,
    isNewConversation,
    currInputs,
    newConversationInputs,
    resetNewConversationInputs,
  } = useConversation();

  const [chatList, setChatList, getChatList] = useGetState<ChatItem[]>([]);
  const [
    isResponding,
    { setTrue: setRespondingTrue, setFalse: setRespondingFalse },
  ] = useBoolean(false);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  const [
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _val,
    setConversationIdChangeBecauseOfNew,
    getConversationIdChangeBecauseOfNew,
  ] = useGetState(false);
  const [suggestedQuestions, setSuggestedQuestions] = useState<string[]>([]);
  const [introduction, setIntroduction] = useState<string>('');
  const [appParams, setAppParams] = useState<AppParams | null>(null);
  const [isParamsLoaded, setIsParamsLoaded] = useState(false);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const currentTaskIdRef = useRef<string>('');

  useEffect(() => {
    // Initialize
    (async () => {
      try {
        const [conversationData, appParams] = await Promise.all([
          fetchConversations(),
          fetchAppParams(),
        ]);
        const conversations = (conversationData as { data: ConversationItem[] })
          .data;
        setConversationList(conversations);

        const _conversationId = getConversationIdFromStorage(APP_ID);
        if (
          _conversationId &&
          conversations.find((c) => c.id === _conversationId)
        ) {
          setCurrConversationId(_conversationId, APP_ID, false);
        } else if (conversations.length > 0) {
          setCurrConversationId(conversations[0].id, APP_ID, true);
        }

        const params = appParams as unknown as AppParams;
        setAppParams(params);
        const { suggested_questions = [], opening_statement = '' } = params;
        setSuggestedQuestions(suggested_questions);
        setIntroduction(opening_statement);
        setIsParamsLoaded(true);
      } catch (e) {
        console.error('Dify API connection failed:', e);
        setApiError(true);
      } finally {
        setIsParamsLoaded(true);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!isParamsLoaded) return; // Wait for app params

    let notSyncToStateIntroduction = introduction;

    if (!isNewConversation) {
      const item = conversationList.find((c) => c.id === currConversationId);
      if (item && item.introduction) {
        notSyncToStateIntroduction = item.introduction;
      }

      const sessionList = generateNewChatListWithOpenStatement(
        notSyncToStateIntroduction,
        suggestedQuestions
      );

      setIsMessagesLoading(true);
      fetchChatList(currConversationId)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((res: any) => {
          const { data } = res;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          data.forEach((item: any) => {
            sessionList.push({
              id: `question-${item.id}`,
              content: item.query,
              isAnswer: false,
              message_files:
                item.message_files?.filter(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (file: any) => file.belongs_to === 'user'
                ) || [],
            });
            sessionList.push({
              id: item.id,
              content: item.answer,
              agent_thoughts: item.agent_thoughts || [],
              feedback: item.feedback,
              isAnswer: true,
              suggestedQuestions: item.suggested_questions || [],
              message_files:
                item.message_files?.filter(
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  (file: any) => file.belongs_to === 'assistant'
                ) || [],
            });
          });
          setChatList(sessionList);
        })
        .finally(() => {
          setIsMessagesLoading(false);
        });
    } else {
      setChatList(
        generateNewChatListWithOpenStatement(
          notSyncToStateIntroduction,
          suggestedQuestions
        )
      );
      setIsMessagesLoading(false);
    }
  }, [
    currConversationId,
    isNewConversation,
    suggestedQuestions,
    introduction,
    isParamsLoaded,
  ]);

  const createNewChat = () => {
    if (conversationList.some((item) => item.id === '-1')) return;
    setConversationList(
      produce(conversationList, (draft) => {
        draft.unshift({
          id: '-1',
          name: 'New Chat',
          inputs: newConversationInputs,
          introduction: '',
        });
      })
    );
  };

  const updateCurrentQA = ({
    responseItem,
    questionId,
    placeholderAnswerId,
    questionItem,
  }: {
    responseItem: ChatItem;
    questionId: string;
    placeholderAnswerId: string;
    questionItem: ChatItem;
  }) => {
    const newListWithAnswer = produce(
      getChatList().filter(
        (item) => item.id !== responseItem.id && item.id !== placeholderAnswerId
      ),
      (draft) => {
        if (!draft.find((item) => item.id === questionId))
          draft.push({ ...questionItem });
        draft.push({ ...responseItem });
      }
    );
    setChatList(newListWithAnswer);
  };

  const sendMessage = async (message: string, files?: VisionFile[]) => {
    if (isResponding) {
      toast.info('Wait for response');
      return;
    }

    if (isNewConversation) {
      createNewChat();
      setConversationIdChangeBecauseOfNew(true);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: Record<string, any> = {
      inputs: currInputs || {},
      query: message,
      conversation_id: isNewConversation ? null : currConversationId,
    };

    if (files && files.length > 0) {
      data.files = files;
    }

    const questionId = `question-${Date.now()}`;
    const questionItem: ChatItem = {
      id: questionId,
      content: message,
      isAnswer: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      message_files: (files || []).filter((f: any) => f.type === 'image'),
    };

    const placeholderAnswerId = `answer-placeholder-${Date.now()}`;
    const placeholderAnswerItem: ChatItem = {
      id: placeholderAnswerId,
      content: '',
      isAnswer: true,
    };

    setChatList([...getChatList(), questionItem, placeholderAnswerItem]);

    const responseItem: ChatItem = {
      id: `${Date.now()}`,
      content: '',
      agent_thoughts: [],
      message_files: [],
      isAnswer: true,
    };

    let hasSetResponseId = false;
    let tempNewConversationId = '';
    const prevTempNewConversationId = getCurrConversationId() || '-1';
    let localAbortController: AbortController | null = null;

    setRespondingTrue();

    const connectionTimeout = setTimeout(() => {
      if (!hasSetResponseId) {
        if (localAbortController) {
          localAbortController.abort();
        }
        setRespondingFalse();
        toast.error('The server took too long to respond. Please try again.');
        setChatList(
          produce(getChatList(), (draft) => {
            draft.splice(
              draft.findIndex((item) => item.id === placeholderAnswerId),
              1
            );
          })
        );
      }
    }, 20000);

    sendChatMessage(data, {
      getAbortController: (ac) => {
        setAbortController(ac);
        localAbortController = ac;
      },
      onData: (
        msg: string,
        isFirstMessage: boolean,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        { conversationId: newConversationId, messageId, taskId }: any
      ) => {
        if (taskId) {
          currentTaskIdRef.current = taskId;
        }
        if (connectionTimeout) clearTimeout(connectionTimeout);
        responseItem.content += msg;
        if (messageId && !hasSetResponseId) {
          responseItem.id = messageId;
          hasSetResponseId = true;
        }
        if (isFirstMessage && newConversationId) {
          tempNewConversationId = newConversationId;
        }
        if (
          prevTempNewConversationId !== getCurrConversationId() &&
          !isNewConversation
        ) {
          return;
        }
        updateCurrentQA({
          responseItem,
          questionId,
          placeholderAnswerId,
          questionItem,
        });
      },
      onCompleted: async (hasError?: boolean) => {
        clearTimeout(connectionTimeout);
        if (hasError) return;
        if (getConversationIdChangeBecauseOfNew()) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const { data: allConversations }: any = await fetchConversations();
          if (allConversations?.length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            const newItem: any = await generationConversationName(
              allConversations[0].id
            );
            const newAllConversations = produce(
              allConversations,
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              (draft: any) => {
                draft[0].name = newItem.name;
              }
            );
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            setConversationList(newAllConversations as any);
          }
        }
        setConversationIdChangeBecauseOfNew(false);
        resetNewConversationInputs();
        if (tempNewConversationId) {
          setCurrConversationId(tempNewConversationId, APP_ID, true);
        }
        setRespondingFalse();
      },
      onError: () => {
        clearTimeout(connectionTimeout);
        setRespondingFalse();
        setChatList(
          produce(getChatList(), (draft) => {
            draft.splice(
              draft.findIndex((item) => item.id === placeholderAnswerId),
              1
            );
          })
        );
      },
      onThought: (thought) => {
        // Basic thought handling
        if (responseItem.agent_thoughts?.length === 0) {
          responseItem.agent_thoughts.push(thought);
        } else {
          responseItem.agent_thoughts!.push(thought);
        }
      },
      onMessageEnd: (messageEnd) => {
        if (messageEnd?.id) {
          responseItem.id = messageEnd.id;
        }

        // Fetch suggested questions immediately after streaming completes and update global state
        if (responseItem.id) {
          fetchSuggestedQuestions(responseItem.id)
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .then((suggestedRes: any) => {
              if (suggestedRes?.data && suggestedRes.data.length > 0) {
                setSuggestedQuestions(suggestedRes.data);
              }
            })
            .catch((e) => {
              console.error('Failed to fetch suggested questions', e);
            });
        }

        const newListWithAnswer = produce(
          getChatList().filter(
            (item) =>
              item.id !== responseItem.id && item.id !== placeholderAnswerId
          ),
          (draft) => {
            if (!draft.find((item) => item.id === questionId))
              draft.push({ ...questionItem });
            draft.push({ ...responseItem });
          }
        );
        setChatList(newListWithAnswer);
      },
      onMessageReplace: (messageReplace) => {
        setChatList(
          produce(getChatList(), (draft) => {
            const current = draft.find((item) => item.id === messageReplace.id);
            if (current) current.content = messageReplace.answer;
          })
        );
      },
      onFile: () => {},
      onWorkflowStarted: () => {},
      onWorkflowFinished: () => {},
      onNodeStarted: () => {},
      onNodeFinished: () => {},
    });
  };

  const stopResponding = () => {
    if (abortController) {
      abortController.abort();
    }
    if (currentTaskIdRef.current) {
      stopChatMessage(currentTaskIdRef.current).catch((err: unknown) =>
        console.error('Error issuing network stop mechanism', err)
      );
    }
    setRespondingFalse();
  };

  const handleFeedback = async (messageId: string, feedback: Feedbacktype) => {
    try {
      await updateFeedback({
        url: `/messages/${messageId}/feedbacks`,
        body: { rating: feedback.rating },
      });
      setChatList(
        produce(getChatList(), (draft) => {
          const item = draft.find((i) => i.id === messageId);
          if (item) item.feedback = feedback;
        })
      );
      toast.success('Feedback recorded');
    } catch (e) {
      console.error(e);
    }
  };

  return {
    messages: chatList,
    sendMessage,
    isSending: isResponding,
    stopResponding,
    handleFeedback,
    suggestedQuestions,
    appParams,
    isParamsLoaded,
    isMessagesLoading,
    apiError,
  };
}
