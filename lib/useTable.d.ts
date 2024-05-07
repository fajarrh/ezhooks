/**
 *  @name useTable
 *  @author Fajar Rizky Hidayat <fajarrizkyhidayat@gmail.com>
 */
type UseTablePaginationProps = {
  params?: {
    page?: string;
    perPage?: string;
  };
  /**
   * @default 1
   */
  startPage?: number;
  /**
   * @default 10
   */
  perPage?: number;
  /**
   * @default
   * ```
   * [5, 10, 15, 25],
   * ```
   */
  perPageOptions?: number[];
  /**
   * @name FromPage
   * @description Get start
   * @param total
   * @param size
   * @param df start page
   * @default
   * ```
   * from: (total, page, size, df) => (page - 1) * size + (total === 0 ? 0 : df),
   * ```
   */
  from?: (total: number, page: number, size: number, df: number) => number;
  /**
   * @name ToPage
   * @description Get end
   * @param total
   * @param page
   * @param size
   * @default
   * ```
   * to: (total, page, size) => (total === 0 ? 0 : Math.min(total, page * size)),
   * ```
   */
  to?: (total: number, page: number, size: number, df: number) => number;
  /**
   * @name LastPage
   * @description Get Last Page Number
   * @param total
   * @param page
   * @param size
   * @default
   * ```
   * lastPage:(total, size) => Math.max(0, Math.ceil(total / size)),
   * ```
   */
  lastPage?: (total: number, size: number) => number;
  /**
   *
   * @param total
   * @param page
   * @param df
   * @default
   * ```
   *  disableFirst: (total, page, df) => total !== 0 && page === df,
   * ```
   */
  disableFirst?: (total: number, page: number, df: number) => boolean;
  /**
   *
   * @param total
   * @param page
   * @param lp
   * @default
   * ```
   *  disableLast: (total, page, lp) => total !== 0 && page === lp,
   * ```
   */
  disableLast?: (total: number, page: number, lp: number) => boolean;
};

type UseTablePagination = {
  total: number;
  page: number;
  from: number;
  to: number;
  lastPage: number;
  perPageOptions: number[];
  perPage: number;
  text: string;
  setPage: (value: number) => void;
  setPerPage: (value: number) => void;
  nextButton: () => React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;
  backButton: () => React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;
  firstButton: () => React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;
  lastButton: () => React.DetailedHTMLProps<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  >;
  onPerPageChange: (
    event?: React.ChangeEvent<HTMLAreaElement | HTMLInputElement>
  ) => void;
};

type EventTable = {
  ctr: AbortController;
  params: Record<string, any>;
};

interface UseTableProps<T> {
  service: (event: EventTable) => T;
  selector: (resp: any) => any;
  total?: (resp: any) => number;
  replaceUrl?: boolean;
  disabledOnDidMount?: boolean;
  sort?: {
    params?: {
      order?: string;
      orderBy?: string;
    };
    order?: "desc" | "asc";
    orderBy?: string;
  };
  deps?: any[];
  pagination?: UseTablePaginationProps;
}

type UseTable<T> = {
  isEmpty: boolean;
  loading: boolean;
  total: number;
  data: T[];
  order: "desc" | "asc";
  orderBy: string;
  query: (key?: string, defaultValue?: any) => any;
  setTotal: (value: number) => void;
  setQuery: (
    value:
      | Record<string, any>
      | ((value: Record<string, any>) => Record<string, any>)
  ) => void;
  onSort: (value: string) => void;
  reload: () => void;
  clear: (value?: { except?: string[]; only?: [string] }) => void;
  remove: (key: string, resetPage?: boolean) => void;
  add: (newValue: T, position?: "start" | "end" | number) => void;
  update: (condition: (data: T) => boolean, newValue: Partial<T>) => void;
  destroy: (condition: (data: T) => boolean) => void;
  has: (key: string) => boolean;
  pagination: UseTablePagination;
};

export default function useTable<T, S = unknown>(
  props: UseTableProps<S>
): UseTable<T>;
