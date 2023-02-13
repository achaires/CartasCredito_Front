import { TextInput } from "flowbite-react";
import { Controller } from "react-hook-form";

export const ControllerMonto = ({ control, transform, name, defaultValue }) => {
  return (
    <Controller
      defaultValue={defaultValue}
      control={control}
      name={name}
      render={({ field }) => <TextInput onChange={(e) => field.onChange(transform.output(e))} value={transform.input(field.value)} />}
    />
  );
};
