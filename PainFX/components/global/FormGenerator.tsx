import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';
import { Controller, UseFormRegister, FieldErrors, Control } from 'react-hook-form';
import { Picker } from '@react-native-picker/picker';

type FormGeneratorProps = {
  name: string;
  label?: string;
  type?: 'text' | 'email' | 'textarea' | 'password' | 'number' | 'date' | 'select';
  placeholder?: string;
  disabled?: boolean;
  rows?: number;
  register?: UseFormRegister<any>;
  errors: FieldErrors<any>;
  control?: Control<any>;
  defaultValue?: unknown;
  rules?: any;
  options?: { value: string; label: string }[];
};

const FormGenerator: React.FC<FormGeneratorProps> = ({
  name,
  label,
  type = 'text',
  placeholder,
  disabled,
  rows = 4,
  register,
  errors,
  control,
  defaultValue = '',
  rules,
  options,
}) => {
  const renderErrorMessage = () => {
    const error = errors[name]?.message;
    if (typeof error === 'string') {
      return (
        <Text style={styles.errorText}>
          {error === 'Required' ? 'This field is required' : error}
        </Text>
      );
    }
    return null;
  };

  const renderInput = () => {
    switch (type) {
      case 'textarea':
        return (
          <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            rules={rules}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, styles.textArea]}
                multiline
                numberOfLines={rows}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                placeholder={placeholder}
                editable={!disabled}
              />
            )}
          />
        );
      case 'select':
        return (
          <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            rules={rules}
            render={({ field: { onChange, value } }) => (
              <Picker
                selectedValue={value}
                onValueChange={onChange}
                enabled={!disabled}
                style={styles.picker}
              >
                {options?.map((option) => (
                  <Picker.Item key={option.value} label={option.label} value={option.value} />
                ))}
              </Picker>
            )}
          />
        );
      default:
        return (
          <Controller
            name={name}
            control={control}
            defaultValue={defaultValue}
            rules={rules}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onChangeText={onChange}
                onBlur={onBlur}
                value={value}
                placeholder={type === 'date' ? 'YYYY-MM-DD' : placeholder}
                editable={!disabled}
                secureTextEntry={type === 'password'}
                keyboardType={type === 'number' ? 'numeric' : 'default'}
              />
            )}
          />
        );
    }
  };

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      {renderInput()}
      {renderErrorMessage()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  label: {
    marginBottom: 8,
    fontSize: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  picker: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
  },
  errorText: {
    color: 'red',
    marginTop: 4,
  },
});

export default FormGenerator;

