import { Input } from '@/components/ui/input'

interface LoginFormInputProps {
	id: string
	type: 'email' | 'password' | 'text'
	placeholder: string
	value: string
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
	required?: boolean
}

export function LoginFormInput({
	id,
	type,
	placeholder,
	value,
	onChange,
	required = false,
}: LoginFormInputProps) {
	return (
		<div className="space-y-2">
			<Input
				id={id}
				type={type}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				required={required}
				className="h-auto w-full rounded-xl-plus border-2 border-gray-100 px-4 py-3 text-base font-baloo-2 placeholder:font-baloo-2 placeholder:font-medium placeholder:text-[1.25rem] placeholder:text-grayscale-300 focus:border-brand-purple focus-visible:ring-0"
			/>
		</div>
	)
}

