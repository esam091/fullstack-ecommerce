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
import { Input, type InputProps } from "./input";

export type FormTextFieldProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> = {
  name: TName;
  label?: string;
  description?: string;
  control: Control<TFieldValues>;
} & InputProps;

export default function FormTextField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({
  control,
  name,
  label,
  description,
  ...rest
}: FormTextFieldProps<TFieldValues, TName>) {
  const { getFieldState, formState } = useFormContext();

  const { error } = getFieldState(name, formState);

  return (
    <FormItem>
      <FormLabel>{label}</FormLabel>
      <Input {...rest} {...control.register(name)} />
      <FormDescription>{description}</FormDescription>
      <FormError error={error} />
    </FormItem>
  );
}
