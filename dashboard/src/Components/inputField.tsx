import React, {InputHTMLAttributes} from 'react'
import {useField} from 'formik'
import { FormControl, FormLabel, FormErrorMessage } from '@chakra-ui/form-control'
import { Input } from '@chakra-ui/input'
import { Textarea } from '@chakra-ui/textarea'

type inputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
    name: string;
    label: string
    textarea?: boolean
}

export const InputField: React.FC<inputFieldProps> = ({label, textarea, size:_, ...props}) => {
    let InputOrTextArea = Input
    if (textarea) {
        InputOrTextArea = Textarea
    }
    const [field, { error, }] = useField(props)
        return (
            <FormControl isInvalid={!!error}>
            <FormLabel htmlFor={field.name}>{label}</FormLabel>
            <InputOrTextArea {...field} {...props} id={field.name} placeholder={props.placeholder} />
            <FormErrorMessage>{error}</FormErrorMessage>
          </FormControl>
        );
}