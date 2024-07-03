/**
 *  @name HOOK
 *  @author Fajar Rizky Hidayat <fajarrizkyhidayat@gmail.com>
 */

type FixArr<T> = T extends readonly any[] ? Omit<T, Exclude<keyof any[], number>> : T;
type DropInitDot<T> = T extends `.${infer U}` ? U : T;
type _DeepKeys<T> = T extends object ? (
  { [K in (string | number) & keyof T]:
      `${(
          `.${K}` | (`${K}` extends `${number}` ? `.${K}` : never)
      )}${"" | _DeepKeys<FixArr<T[K]>>}` }[
  (string | number) & keyof T]
) : never
export type DeepKeys<T> = DropInitDot<_DeepKeys<FixArr<T>>>


export {
  default as UseMutation,
  EventSend,
  UseMutationProps,
} from "./useMutation";
export {
  default as UseTable,
  EventTable,
  UseTablePagination,
  UseTablePaginationProps,
} from "./useTable";
export { default as UseFetch, EventFetch } from "./useFetch";
export { default as UseSvalidation, EventValidation } from "./useSValidation";
