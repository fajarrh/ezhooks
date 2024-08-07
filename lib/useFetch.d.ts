/**
 *  @name useFetch
 *  @author Fajar Rizky Hidayat <fajarrizkyhidayat@gmail.com>
 */

interface FetchProps<T = any> {
  service: (resp?: import(".").EventSend<T>) => any;
  selector: (resp: any) => any;
  defaultValue?: T;
  disabledOnDidMount?: boolean;
  debounceTime?: number;
  deps?: any[];
  getData?: (value: any) => void;
}

type UseFetch<T = any> = {
  isEmpty: boolean;
  loading: boolean;
  data: T;
  query: object;
  setQuery: (value: any | ((obj: any) => any)) => void;
  clear: (fields?: {
    except?: ReadonlyArray<keyof T>;
    only?: ReadonlyArray<keyof T>;
  }) => void;
  refresh: () => void;
  add: (newValue: T, position?: "start" | "end" | number) => void;
  update: (condition: (data: T) => boolean, newValue: Partial<T>) => void;
  destroy: (condition: (data: T) => boolean) => void;
  getQuery: (key: string, defaultValue?: any) => any;
  has: (key: string) => boolean;
};

export default function useFetch<T>(props: FetchProps<T>): UseFetch<T>;
