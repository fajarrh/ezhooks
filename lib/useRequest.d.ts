/**
 *  @name useFetch
 *  @author Fajar Rizky Hidayat <fajarrizkyhidayat@gmail.com>
 */

import { EventSend } from ".";

interface RequestProps<T = any> {
  data: T;
}
type ExecProps<T = any> = {
  service: (event: import('.').EventSend<T>) => Promise<any>;
  onSuccess?: (<P = T>(data: any) => P) | ((data: any) => void);
  onError?: (e: any) => void;
  onAlways?: () => void;
};

type UseRequest<T = any> = {
  isEmpty: boolean;
  loading: boolean;
  data: T;
  exec: (options: ExecProps<T>) => void;
  query: (key?: string, defaultValue?: any) => any;
  setQuery: (value: any | ((obj: any) => any)) => void;
  clear: (clean?: boolean) => void;
  cancel: () => void;
};

export default function useRequest<T>(props: RequestProps<T>): UseRequest<T>;
