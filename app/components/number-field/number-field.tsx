import { NumberField as BaseNumberField } from "@base-ui/react/number-field";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import FormControl from "@mui/material/FormControl";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import OutlinedInput, { type OutlinedInputProps } from "@mui/material/OutlinedInput";
import { useId, type ReactNode } from "react";

/**
 * Placeholder that lets MUI's FormControl resolve the shrink label state during SSR.
 * Base UI owns the real input, so this renders nothing.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SSRInitialFilled = (_: BaseNumberField.Root.Props) => null;
SSRInitialFilled.muiName = "Input";

type Props = BaseNumberField.Root.Props & {
  error?: boolean;
  inputSx?: OutlinedInputProps["sx"];
  label?: ReactNode;
  size?: "small" | "medium";
};

export const NumberField = ({
  "aria-describedby": ariaDescribedBy,
  "aria-label": ariaLabel,
  "aria-labelledby": ariaLabelledBy,
  error,
  id: idProp,
  inputSx,
  label,
  size = "medium",
  ...other
}: Props) => {
  const generatedId = useId();
  const id = idProp ?? generatedId;

  // Base UI hands Root's props to the `render` callback below, which builds a FormControl and
  // keeps only what it needs — so aria attributes have to be applied to the input directly or
  // they are dropped and the field ends up with no accessible name.
  const ariaProps = {
    ...(ariaDescribedBy ? { "aria-describedby": ariaDescribedBy } : {}),
    ...(ariaLabel ? { "aria-label": ariaLabel } : {}),
    ...(ariaLabelledBy ? { "aria-labelledby": ariaLabelledBy } : {}),
  };

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
      {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
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
            slotProps={{ input: { ...props, ...ariaProps } }}
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
};
