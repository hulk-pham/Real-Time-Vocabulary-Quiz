import { FieldErrors, Path, UseFormRegister } from 'react-hook-form';

type InputProps = {
    label: string,
    placeholder: string,
    field: Path<any>
    register: UseFormRegister<any>
    required?: boolean,
    errors: FieldErrors<any>
}

export const RadioInput = ({ label, field, register, errors, options }: InputProps & {
    options: string[]
}) => (
    <div className="mb-4">
        <p className="text-base text-black">
            <label>{label}</label>
        </p>
        {
            options.map((option, index) => (
                <div key={index} className="flex items-center">
                    <input
                        {...register(field)}
                        className="mr-2"
                        type="radio"
                        value={option}
                        id={option}
                    />
                    <label htmlFor={option}>{option}</label>
                </div>
            ))
        }
        <p className="text-xs text-red-500">{(errors[field] as any)?.message || ''}</p>
    </div>
)