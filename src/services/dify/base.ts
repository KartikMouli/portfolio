import { API_PREFIX } from '@/config/dify';
import { toast } from 'sonner';
import type {
  AnnotationReply,
  MessageEnd,
  MessageReplace,
  ThoughtItem,
} from '@/types/chat';
import type { VisionFile } from '@/types/app';

const TIME_OUT = 100000;

const ContentType = {
  json: 'application/json',
  stream: 'text/event-stream',
  form: 'application/x-www-form-urlencoded; charset=UTF-8',
  download: 'application/octet-stream', // for download
};

const baseOptions = {
  method: 'GET',
  mode: 'cors',
  credentials: 'include', // always send cookies、HTTP Basic authentication.
  headers: new Headers({
    'Content-Type': ContentType.json,
  }),
  redirect: 'follow',
};

export interface WorkflowStartedResponse {
  task_id: string;
  workflow_run_id: string;
  event: string;
  data: {
    id: string;
    workflow_id: string;
    sequence_number: number;
    created_at: number;
  };
}

export interface WorkflowFinishedResponse {
  task_id: string;
  workflow_run_id: string;
  event: string;
  data: {
    id: string;
    workflow_id: string;
    status: string;
    outputs: unknown;
    error: string;
    elapsed_time: number;
    total_tokens: number;
    total_steps: number;
    created_at: number;
    finished_at: number;
  };
}

export interface NodeStartedResponse {
  task_id: string;
  workflow_run_id: string;
  event: string;
  data: {
    id: string;
    node_id: string;
    node_type: string;
    index: number;
    predecessor_node_id?: string;
    inputs: unknown;
    created_at: number;
    extras?: unknown;
  };
}

export interface NodeFinishedResponse {
  task_id: string;
  workflow_run_id: string;
  event: string;
  data: {
    id: string;
    node_id: string;
    node_type: string;
    index: number;
    predecessor_node_id?: string;
    inputs: unknown;
    process_data: unknown;
    outputs: unknown;
    status: string;
    error: string;
    elapsed_time: number;
    execution_metadata: {
      total_tokens: number;
      total_price: number;
      currency: string;
    };
    created_at: number;
  };
}

export interface IOnDataMoreInfo {
  conversationId?: string;
  taskId?: string;
  messageId: string;
  errorMessage?: string;
  errorCode?: string;
}

export type IOnData = (
  message: string,
  isFirstMessage: boolean,
  moreInfo: IOnDataMoreInfo
) => void;
export type IOnThought = (though: ThoughtItem) => void;
export type IOnFile = (file: VisionFile) => void;
export type IOnMessageEnd = (messageEnd: MessageEnd) => void;
export type IOnMessageReplace = (messageReplace: MessageReplace) => void;
export type IOnAnnotationReply = (messageReplace: AnnotationReply) => void;
export type IOnCompleted = (hasError?: boolean) => void;
export type IOnError = (msg: string, code?: string) => void;
export type IOnWorkflowStarted = (
  workflowStarted: WorkflowStartedResponse
) => void;
export type IOnWorkflowFinished = (
  workflowFinished: WorkflowFinishedResponse
) => void;
export type IOnNodeStarted = (nodeStarted: NodeStartedResponse) => void;
export type IOnNodeFinished = (nodeFinished: NodeFinishedResponse) => void;

interface IOtherOptions {
  isPublicAPI?: boolean;
  bodyStringify?: boolean;
  needAllResponseContent?: boolean;
  deleteContentType?: boolean;
  onData?: IOnData; // for stream
  onThought?: IOnThought;
  onFile?: IOnFile;
  onMessageEnd?: IOnMessageEnd;
  onMessageReplace?: IOnMessageReplace;
  onError?: IOnError;
  onCompleted?: IOnCompleted; // for stream
  getAbortController?: (abortController: AbortController) => void;
  onWorkflowStarted?: IOnWorkflowStarted;
  onWorkflowFinished?: IOnWorkflowFinished;
  onNodeStarted?: IOnNodeStarted;
  onNodeFinished?: IOnNodeFinished;
}

function unicodeToChar(text: string) {
  return text.replace(/\\u([0-9a-f]{4})/gi, (_match, p1) => {
    return String.fromCharCode(parseInt(p1, 16));
  });
}

const handleStream = (
  response: Response,
  onData: IOnData,
  onCompleted?: IOnCompleted,
  onThought?: IOnThought,
  onMessageEnd?: IOnMessageEnd,
  onMessageReplace?: IOnMessageReplace,
  onFile?: IOnFile,
  onWorkflowStarted?: IOnWorkflowStarted,
  onWorkflowFinished?: IOnWorkflowFinished,
  onNodeStarted?: IOnNodeStarted,
  onNodeFinished?: IOnNodeFinished
) => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let bufferObj: Record<string, any>;
  let isFirstMessage = true;
  function read() {
    let hasError = false;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    reader?.read().then((result: any) => {
      if (result.done) {
        onCompleted?.();
        return;
      }
      buffer += decoder.decode(result.value, { stream: true });
      const lines = buffer.split('\n');
      try {
        lines.forEach((message) => {
          if (message.startsWith('data: ')) {
            // check if it starts with data:
            try {
              bufferObj = JSON.parse(message.substring(6)) as Record<
                string,
                unknown
              >; // remove data: and parse as json
            } catch {
              // mute handle message cut off
              onData('', isFirstMessage, {
                conversationId: bufferObj?.conversation_id,
                messageId: bufferObj?.message_id,
              });
              return;
            }
            if (bufferObj.status === 400 || !bufferObj.event) {
              onData('', false, {
                conversationId: undefined,
                messageId: '',
                errorMessage: bufferObj?.message,
                errorCode: bufferObj?.code,
              });
              hasError = true;
              onCompleted?.(true);
              return;
            }
            if (
              bufferObj.event === 'message' ||
              bufferObj.event === 'agent_message'
            ) {
              // can not use format here. Because message is splited.
              onData(unicodeToChar(bufferObj.answer), isFirstMessage, {
                conversationId: bufferObj.conversation_id,
                taskId: bufferObj.task_id,
                messageId: bufferObj.id,
              });
              isFirstMessage = false;
            } else if (bufferObj.event === 'agent_thought') {
              onThought?.(bufferObj as ThoughtItem);
            } else if (bufferObj.event === 'message_file') {
              onFile?.(bufferObj as VisionFile);
            } else if (bufferObj.event === 'message_end') {
              onMessageEnd?.(bufferObj as MessageEnd);
            } else if (bufferObj.event === 'message_replace') {
              onMessageReplace?.(bufferObj as MessageReplace);
            } else if (bufferObj.event === 'workflow_started') {
              onWorkflowStarted?.(bufferObj as WorkflowStartedResponse);
            } else if (bufferObj.event === 'workflow_finished') {
              onWorkflowFinished?.(bufferObj as WorkflowFinishedResponse);
            } else if (bufferObj.event === 'node_started') {
              onNodeStarted?.(bufferObj as NodeStartedResponse);
            } else if (bufferObj.event === 'node_finished') {
              onNodeFinished?.(bufferObj as NodeFinishedResponse);
            }
          }
        });
        buffer = lines[lines.length - 1];
      } catch (e) {
        onData('', false, {
          conversationId: undefined,
          messageId: '',
          errorMessage: `${e}`,
        });
        hasError = true;
        onCompleted?.(true);
        return;
      }
      if (!hasError) {
        read();
      }
    });
  }
  read();
};

const baseFetch = (
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchOptions: any,
  { needAllResponseContent }: IOtherOptions
) => {
  const options = Object.assign({}, baseOptions, fetchOptions);

  const urlPrefix = API_PREFIX;

  let urlWithPrefix = `${urlPrefix}${url.startsWith('/') ? url : `/${url}`}`;

  const { method, params, body } = options;
  // handle query
  if (method === 'GET' && params) {
    const paramsArray: string[] = [];
    Object.keys(params).forEach((key) =>
      paramsArray.push(`${key}=${encodeURIComponent(params[key])}`)
    );
    if (urlWithPrefix.search(/\?/) === -1) {
      urlWithPrefix += `?${paramsArray.join('&')}`;
    } else {
      urlWithPrefix += `&${paramsArray.join('&')}`;
    }

    delete options.params;
  }

  if (body) {
    if (body instanceof FormData) {
      options.body = body;
      options.headers.delete('Content-Type');
    } else {
      options.body = JSON.stringify(body);
    }
  }

  // Handle timeout
  return Promise.race([
    new Promise((resolve, reject) => {
      setTimeout(() => {
        reject(new Error('request timeout'));
      }, TIME_OUT);
    }),
    new Promise((resolve, reject) => {
      globalThis
        .fetch(urlWithPrefix, options)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .then((res: any) => {
          const resClone = res.clone();
          // Error handler
          if (!/^(2|3)\d{2}$/.test(res.status)) {
            try {
              const bodyJson = res.json();
              switch (res.status) {
                case 401: {
                  toast.error('Invalid token');
                  return;
                }
                default:
                  new Promise(() => {
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    bodyJson.then((data: any) => {
                      toast.error(data.message);
                    });
                  });
              }
            } catch (e) {
              toast.error(`${e}`);
            }

            return Promise.reject(resClone);
          }

          // handle delete api. Delete api not return content.
          if (res.status === 204) {
            resolve({ result: 'success' });
            return;
          }

          // return data
          const resContentType = res.headers.get('Content-Type') || '';
          const data =
            options.headers.get('Content-Type') === ContentType.download ||
            resContentType.includes('audio') ||
            resContentType.includes('application/octet-stream') ||
            resContentType.includes('video')
              ? res.blob()
              : res.json();

          resolve(needAllResponseContent ? resClone : data);
        })
        .catch((err) => {
          toast.error(`${err}`);
          reject(err);
        });
    }),
  ]);
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const upload = (fetchOptions: any): Promise<any> => {
  const urlPrefix = API_PREFIX;
  const urlWithPrefix = `${urlPrefix}/file-upload`;
  const defaultOptions = {
    method: 'POST',
    url: `${urlWithPrefix}`,
    data: {},
  };
  const options = {
    ...defaultOptions,
    ...fetchOptions,
  };
  return new Promise((resolve, reject) => {
    const xhr = options.xhr;
    xhr.open(options.method, options.url);
    for (const key in options.headers) {
      xhr.setRequestHeader(key, options.headers[key]);
    }

    xhr.withCredentials = true;
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          resolve({ id: xhr.response });
        } else {
          reject(xhr);
        }
      }
    };
    xhr.upload.onprogress = options.onprogress;
    xhr.send(options.data);
  });
};

export const ssePost = (
  url: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetchOptions: any,
  {
    onData,
    onCompleted,
    onThought,
    onFile,
    onMessageEnd,
    onMessageReplace,
    onWorkflowStarted,
    onWorkflowFinished,
    onNodeStarted,
    onNodeFinished,
    onError,
    getAbortController,
  }: IOtherOptions
) => {
  const options = Object.assign(
    {},
    baseOptions,
    {
      method: 'POST',
    },
    fetchOptions
  );

  const urlPrefix = API_PREFIX;
  const urlWithPrefix = `${urlPrefix}${url.startsWith('/') ? url : `/${url}`}`;

  const { body } = options;
  if (body) {
    options.body = JSON.stringify(body);
  }

  const abortController = new AbortController();
  getAbortController?.(abortController);
  options.signal = abortController.signal;

  globalThis
    .fetch(urlWithPrefix, options)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .then((res: any) => {
      if (!/^(2|3)\d{2}$/.test(res.status)) {
        new Promise(() => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          res.json().then((data: any) => {
            toast.error(data.message || 'Server Error');
          });
        });
        onError?.('Server Error');
        return;
      }
      return handleStream(
        res,
        (str: string, isFirstMessage: boolean, moreInfo: IOnDataMoreInfo) => {
          if (moreInfo.errorMessage) {
            toast.error(moreInfo.errorMessage);
            return;
          }
          onData?.(str, isFirstMessage, moreInfo);
        },
        () => {
          onCompleted?.();
        },
        onThought,
        onMessageEnd,
        onMessageReplace,
        onFile,
        onWorkflowStarted,
        onWorkflowFinished,
        onNodeStarted,
        onNodeFinished
      );
    })
    .catch((e) => {
      toast.error(`${e}`);
      onError?.(e);
    });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const request = <T = any>(
  url: string,
  options = {},
  otherOptions?: IOtherOptions
): Promise<T> => {
  return baseFetch(url, options, otherOptions || {}) as Promise<T>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const get = <T = any>(
  url: string,
  options = {},
  otherOptions?: IOtherOptions
): Promise<T> => {
  return request<T>(
    url,
    Object.assign({}, options, { method: 'GET' }),
    otherOptions
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const post = <T = any>(
  url: string,
  options = {},
  otherOptions?: IOtherOptions
): Promise<T> => {
  return request<T>(
    url,
    Object.assign({}, options, { method: 'POST' }),
    otherOptions
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const put = <T = any>(
  url: string,
  options = {},
  otherOptions?: IOtherOptions
): Promise<T> => {
  return request<T>(
    url,
    Object.assign({}, options, { method: 'PUT' }),
    otherOptions
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const del = <T = any>(
  url: string,
  options = {},
  otherOptions?: IOtherOptions
): Promise<T> => {
  return request<T>(
    url,
    Object.assign({}, options, { method: 'DELETE' }),
    otherOptions
  );
};
