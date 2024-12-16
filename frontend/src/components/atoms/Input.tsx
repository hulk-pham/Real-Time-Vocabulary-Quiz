import { FieldErrors, Path, UseFormRegister } from 'react-hook-form';

type InputProps = {
    label: string,
    placeholder: string,
    field: Path<any>
    register: UseFormRegister<any>
    required?: boolean,
    errors: FieldErrors<any>
}

export const Input = ({ label, field, register, errors, placeholder }: InputProps) => (
    <div className="mb-4">
        <p className="text-base text-black">
            <label>{label}</label>
        </p>
        <input
            {...register(field)}
            className="border border-darkgray-700 rounded-md py-1 px-3 w-full placeholder:text-base placeholder:text-gray-500 text-base text-black"
            placeholder={placeholder}
        />
        <p className="text-xs text-red-500">{(errors[field] as any)?.message || ''}</p>
    </div>
)