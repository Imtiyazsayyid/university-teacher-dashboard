import { Teacher } from "@/app/interfaces/TeacherInterface";
import clsx from "clsx";
import ReactSelect, { MultiValue } from "react-select";

interface SelectOption {
  value: number; // Or number if IDs are numbers
  label: string;
}

interface Props {
  teachers: Teacher[];
  label?: string;
  value?: SelectOption[];
  onChange: (value: SelectOption[]) => void;
  options: SelectOption[];
  disabled?: boolean;
}

const Select = ({
  label,
  value,
  onChange,
  teachers,
  options,
  disabled,
}: Props) => {
  const handleChange = (newValue: MultiValue<SelectOption>) => {
    onChange(newValue as SelectOption[]); // Handle the change, casting to `SelectOption[]`
  };

  return (
    <div className="z-[100] mb-11">
      <label className="block text-sm font-medium leading-6 text-gray-900 dark:text-gray-300">
        {label}
      </label>
      <div className="mt-2">
        <ReactSelect
          isDisabled={disabled}
          value={value}
          onChange={handleChange}
          isMulti
          options={options}
          // menuPortalTarget={document.body}
          styles={{
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999,
            }),
          }}
          classNames={{
            control: () =>
              clsx(
                "text-sm",
                "dark:bg-[#151515]",
                disabled && "opacity-50 cursor-not-allowed"
              ),
            menu: () =>
              "text-sm dark:text-black dark:bg-gray-200 dark:hover:bg-gray-300"
          }}
        />
      </div>
    </div>
  );
};

export default Select;
