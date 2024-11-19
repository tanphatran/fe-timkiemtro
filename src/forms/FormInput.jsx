import {
    FormControl,
    FormField,
    FormLabel,
    FormMessage,
    FormItem,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import PropTypes from "prop-types";

const FormInput = ({ form, label, name, type = "text", placeholder }) => {
    return (
        <FormField
            name={name}
            control={form.control}
            render={({ field }) => (
                <FormItem>
                    {label && <FormLabel>{label}</FormLabel>}
                    <FormControl>
                        <Input
                            placeholder={placeholder}
                            type={type}
                            value={field.value} // Chỉ truyền giá trị
                            onChange={field.onChange} // Xử lý sự kiện onChange
                            onBlur={field.onBlur} // Xử lý sự kiện onBlur
                            name={field.name} // Truyền đúng tên field
                            className="placeholder:text-stone-200 italic"
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
};

FormInput.propTypes = {
    form: PropTypes.shape({
        control: PropTypes.any.isRequired,
    }).isRequired,
    label: PropTypes.string,
    placeholder: PropTypes.string,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(["text", "password"]),
};

export default FormInput;
