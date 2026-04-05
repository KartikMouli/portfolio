import { useState } from 'react';
import { produce } from 'immer';
import { useGetState, useLocalStorageState } from 'ahooks';
import type { ConversationItem } from '@/types/app';

const storageConversationIdKey = 'conversationIdInfo';

type ConversationInfoType = Omit<ConversationItem, 'inputs' | 'id'>;
function useConversation() {
  const [conversationList, setConversationList] = useState<ConversationItem[]>(
    []
  );
  const [currConversationId, doSetCurrConversationId, getCurrConversationId] =
    useGetState<string>('-1');
  const [conversationIdInfo, setConversationIdInfo] = useLocalStorageState<
    Record<string, string>
  >(storageConversationIdKey, {
    defaultValue: {},
  });

  // when set conversation id, we do not have set appId
  const setCurrConversationId = (
    id: string,
    appId: string,
    isSetToLocalStroge = true,
    _newConversationName = ''
  ) => {
    doSetCurrConversationId(id);
    if (isSetToLocalStroge && id !== '-1') {
      // conversationIdInfo: {[appId1]: conversationId1, [appId2]: conversationId2}
      setConversationIdInfo((prev: Record<string, string> | undefined) => ({
        ...prev,
        [appId]: id,
      }));
    }
  };

  const getConversationIdFromStorage = (appId: string) => {
    return conversationIdInfo?.[appId];
  };

  const isNewConversation = currConversationId === '-1';
  // input can be updated by user
  const [newConversationInputs, setNewConversationInputs] = useState<Record<
    string,
    unknown
  > | null>(null);
  const resetNewConversationInputs = () => {
    if (!newConversationInputs) {
      return;
    }
    setNewConversationInputs(
      produce(newConversationInputs, (draft) => {
        Object.keys(draft).forEach((key) => {
          draft[key] = '';
        });
      })
    );
  };
  const [existConversationInputs, setExistConversationInputs] = useState<Record<
    string,
    unknown
  > | null>(null);
  const currInputs = isNewConversation
    ? newConversationInputs
    : existConversationInputs;
  const setCurrInputs = isNewConversation
    ? setNewConversationInputs
    : setExistConversationInputs;

  // info is muted
  const [newConversationInfo, setNewConversationInfo] =
    useState<ConversationInfoType | null>(null);
  const [existConversationInfo, setExistConversationInfo] =
    useState<ConversationInfoType | null>(null);
  const currConversationInfo = isNewConversation
    ? newConversationInfo
    : existConversationInfo;

  return {
    conversationList,
    setConversationList,
    currConversationId,
    getCurrConversationId,
    setCurrConversationId,
    getConversationIdFromStorage,
    isNewConversation,
    currInputs,
    newConversationInputs,
    existConversationInputs,
    resetNewConversationInputs,
    setCurrInputs,
    currConversationInfo,
    setNewConversationInfo,
    setExistConversationInfo,
  };
}

export default useConversation;
