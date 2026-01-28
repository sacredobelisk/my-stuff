import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput, { type OutlinedInputProps } from "@mui/material/OutlinedInput";
import React from "react";

/**
 * This component is a placeholder for FormControl to correctly set the shrink label state on SSR.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
function SSRInitialFilled(_: BaseNumberField.Root.Props) {
  return null;
}
SSRInitialFilled.muiName = "Input";

type Props = BaseNumberField.Root.Props & {
  error?: boolean;
  label?: React.ReactNode;
  inputSx?: OutlinedInputProps["sx"];
  size?: "small" | "medium";
};

export default function NumberField({ error, id: idProp, label, inputSx, size = "medium", ...other }: Props) {
  let id = React.useId();
  if (idProp) {
    id = idProp;
  }
  return (
    <BaseNumberField.Root
      {...other}
      render={(props, state) => (
        <FormControl
          disabled={state.disabled}
          error={error}
          ref={props.ref}
          required={state.required}
          size={size}
          variant="outlined"
        >
          {props.children}
        </FormControl>
      )}
    >
      <SSRInitialFilled {...other} />
      <InputLabel htmlFor={id}>{label}</InputLabel>
      <BaseNumberField.Input
        id={id}
        render={(props, state) => (
          <OutlinedInput
            inputRef={props.ref}
            label={label}
            onBlur={props.onBlur}
            onChange={props.onChange}
            onFocus={props.onFocus}
            onKeyDown={props.onKeyDown}
            onKeyUp={props.onKeyUp}
            slotProps={{ input: props }}
            value={state.inputValue}
            endAdornment={
              <InputAdornment
                position="end"
                sx={{
                  flexDirection: "column",
                  maxHeight: "unset",
                  alignSelf: "stretch",
                  borderLeft: "1px solid",
                  borderColor: "divider",
                  ml: 0,
                  "& button": {
                    py: 0,
                    flex: 1,
                    borderRadius: 0.5,
                  },
                }}
              >
                <BaseNumberField.Increment render={<IconButton size={size} aria-label="Increase" />}>
                  <KeyboardArrowUpIcon fontSize={size} sx={{ transform: "translateY(2px)" }} />
                </BaseNumberField.Increment>

                <BaseNumberField.Decrement render={<IconButton size={size} aria-label="Decrease" />}>
                  <KeyboardArrowDownIcon fontSize={size} sx={{ transform: "translateY(-2px)" }} />
                </BaseNumberField.Decrement>
              </InputAdornment>
            }
            sx={{ pr: 0, ...inputSx }}
          />
        )}
      />
    </BaseNumberField.Root>
  );
}
