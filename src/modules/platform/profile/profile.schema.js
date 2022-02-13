import { string, object } from "yup";

const createSchema = object().shape({
	title: string()
		.max(10, "This field must be at most 10 characters long")
		.required("This field must not be empty"),
	description: string()
		.required("This field must not be empty"),
});

const updateSchema = object().shape({
	title: string()
		.max(10, "This field must be at most 10 characters long")
		.required("This field must not be empty"),
	description: string()
		.required("This field must not be empty"),
});

export {
    createSchema,
    updateSchema
};