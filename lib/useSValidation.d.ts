/**
 *  @name useSValidation
 *  @author Fajar Rizky Hidayat <fajarrizkyhidayat@gmail.com>
 */

type UseSValidationProps<T> = {
  service?: (event?: import(".").EventSend<T>) => any;
  data: T;
  message?: Record<string, (params: any) => string>;
  param?: {
    type: string;
    path: string;
  };
};

interface UseSValidation<T> {
  processing: boolean;
  error: (key?: keyof T) => boolean;
  message: (key: keyof T) => string;
  clear: () => void;
  cancel: () => void;
  validate: (option?: { service?: (event: EventValidation<T>) => any }) => void;
}

export default function useSValidation<T = any>(
  props: UseSValidationProps<T>
): UseSValidation<T>;
