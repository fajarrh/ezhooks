/**
 *  @name useMutation
 *  @author Fajar Rizky Hidayat <fajarrizkyhidayat@gmail.com>
 */

interface UseMutationProps<T> {
  defaultValue: T;
  scenario?: Record<string, Array<keyof T>>;
  format?: {
    [P in keyof T]?: (value: T[P], data: T) => T[P];
  };
}

type EventSend<T> = {
  ctr: AbortController;
  scenario: string;
  data: (scenario?: string | boolean) => Partial<T>;
  keys: (scenario?: boolean | string) => { name: string; keys: string[] }[];
};

type SendProps<T = any, S = any> = {
  scenario?: string;
  service: (event: EventSend<T>) => S;
  onSuccess?: (data: any) => void;
  onError?: (e: any) => void;
  onAlways?: () => void;
};

type UseMutation<T> = {
  processing: boolean;
  scenario: string;
  data: (scenario?: string | boolean) => Partial<T>;
  setData: (value: Partial<T>) => void;
  increment: (value: Partial<T>) => void;
  decrement: (value: Partial<T>) => void;
  send: <F = UseMutation<T>["data"], S = any>(option: SendProps<F>) => S;
  reset: () => void;
  cancel: () => void;
  value: (key: keyof T, defaultValue?: any) => any;
  add: (key: string, value: any, position?: "start" | "end" | number) => void;
  remove: (key: string, condition?: number | ((data: any) => boolean)) => void;
  keys: (scenario?: boolean | string) => { name: string; keys: string[] }[];
  setScenario: (scenario: string) => void;
};

export default function useMutation<T = any>(
  props: UseMutationProps<T>
): UseMutation<T>;
