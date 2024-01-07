import {
  FormControl,
  FormDescription,
  FormError,
  FormItem,
  FormLabel,
  FormMessage,
} from "./form";
import {
  type FieldValues,
  type FieldPath,
  type Control,
  useFormContext,
} from "react-hook-form";
import { Textarea, type TextareaProps } from "./textarea";

export type FormTextareaProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
  label?: string;
  description?: string;
  control: Control<TFieldValues>;
} & TextareaProps;

export default function FormTextarea<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  ...rest
}: FormTextareaProps<TFieldValues, TName>) {
  const { getFieldState } = useFormContext();

  const { error } = getFieldState(name);
  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Textarea {...rest} {...control.register(name)} />
      <FormDescription>{description}</FormDescription>
      <FormError error={error} />
    </FormItem>
  );
}
