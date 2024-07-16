/**
 *  @name HOOK
 *  @author Fajar Rizky Hidayat <fajarrizkyhidayat@gmail.com>
 */

export type EventSend<T = any> = {
  ctr?: AbortController;
  scenario?: string;
  params?: Record<string, any>;
  data?: (scenario?: string | boolean) => Partial<T>;
  keys?: (scenario?: boolean | string) => { name: string; keys: string[] }[];
  parser?: (value: any) => void;
};

type FixArr<T> = T extends readonly any[]
  ? Omit<T, Exclude<keyof any[], number>>
  : T;
type DropInitDot<T> = T extends `.${infer U}` ? U : T;
type _DeepKeys<T> = T extends object
  ? {
      [K in (string | number) & keyof T]: `${
        | `.${K}`
        | (`${K}` extends `${number}` ? `.${K}` : never)}${
        | ""
        | _DeepKeys<FixArr<T[K]>>}`;
    }[(string | number) & keyof T]
  : never;
export type DeepKeys<T> = DropInitDot<_DeepKeys<FixArr<T>>>;

export { default as UseMutation, UseMutationProps } from "./useMutation";
export {
  default as UseTable,
  UseTablePagination,
  UseTablePaginationProps,
} from "./useTable";
export { default as UseFetch, EventFetch } from "./useFetch";
export { default as UseSvalidation, EventValidation } from "./useSValidation";
