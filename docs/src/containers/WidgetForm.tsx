import {
  Button,
  Dialog,
  IconButton,
  RadioButton,
  RadioGroup,
  TextField,
} from "@statflo/ui";
import { Formik } from "formik";
import { useEffect, useState } from "react";
import * as Yup from "yup";
import { faker } from "@faker-js/faker";

import { useWidgetContext } from "../providers/WidgetProvider";

const WidgetSchema = Yup.object().shape({
  name: Yup.string().required(),
  label: Yup.string(),
  url: Yup.string().required(),
  position: Yup.string().oneOf(["sendable", "right_panel"]),
  priorty: Yup.number(),
});

const initialValues: {
  name: string;
  label: string;
  url: string;
  position: "sendable" | "right_panel";
  priority: number;
} = {
  name: "",
  label: "",
  url: "",
  position: "right_panel",
  priority: 99,
};

type WidgetFormProps = {
  isEdit?: boolean;
  widget?: Widget;
};

const WidgetForm = ({ isEdit, widget }: WidgetFormProps) => {
  const [isOpen, setOpen] = useState(false);
  const { addWidget, editWidget } = useWidgetContext();

  return (
    <Dialog
      isOpen={isOpen}
      setOpen={setOpen}
      closeButton="Close"
      render={({ onClose, labelId, descriptionId }) =>
        isOpen && (
          <div className="flex flex-col gap-6 w-120">
            <h2 className="text-28 font-bold" id={labelId}>
              {isEdit ? "Edit Widget" : "Add Widget"}
            </h2>
            <Formik
              initialValues={initialValues}
              onSubmit={async (values, { resetForm, setSubmitting }) => {
                setSubmitting(true);

                const newWidget: Widget = {
                  id: widget?.id ?? faker.string.uuid(),
                  name: values.name,
                  label: values.label,
                  url: values.url,
                  carrierIds: widget?.carrierIds ?? [1],
                  scopes: [
                    {
                      location: "conversation",
                      positions: [values.position],
                    },
                  ],
                  dealers: widget?.dealers ?? {
                    allDealers: true,
                  },
                  type: "iframe",
                  priority: values.priority,
                  options: widget?.options ?? {
                    defaultExpanded: true,
                  },
                };

                if (isEdit) editWidget(newWidget);
                else addWidget(newWidget);

                setSubmitting(false);
                resetForm();
                onClose();
              }}
              validationSchema={WidgetSchema}
            >
              {function Render({
                values,
                dirty,
                errors,
                touched,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
                isValid,
                setFieldValue,
              }) {
                useEffect(() => {
                  if (isEdit && widget) {
                    setFieldValue("name", widget.name);
                    setFieldValue("label", widget?.label ?? "");
                    setFieldValue("url", widget.url);
                    setFieldValue("position", widget.scopes[0].positions[0]);

                    if (widget.type === "native") {
                      setFieldValue(
                        "native.remote",
                        widget.native?.remote ?? ""
                      );
                      setFieldValue(
                        "native.module",
                        widget.native?.module ?? ""
                      );
                    }
                  }
                }, [setFieldValue]);

                return (
                  <form className="flex flex-col gap-2" onSubmit={handleSubmit}>
                    <TextField
                      infoText="Used to identify the widget and as a fallback in the event of an error."
                      label="Name"
                      name="name"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Example Widget"
                      value={values.name}
                      validation={
                        errors.name && touched.name
                          ? { status: "error", text: errors.name }
                          : undefined
                      }
                    />
                    <TextField
                      infoText="Displayed in the sendables menu to describe the purpose of the widget as well as open the widget."
                      label="Label"
                      name="label"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Add a date"
                      required={false}
                      value={values.label}
                      validation={
                        errors.label && touched.label
                          ? { status: "error", text: errors.label }
                          : undefined
                      }
                    />
                    <TextField
                      infoText="Where the widget is hosted, this can be from a locally running version of the widget or a deployed version of the widget."
                      label="URL"
                      name="url"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="http://localhost:3001"
                      value={values.url}
                      validation={
                        errors.url && touched.url
                          ? { status: "error", text: errors.url }
                          : undefined
                      }
                    />
                    <RadioGroup name="position" label="Position">
                      <span className="text-14 leading-[1.125rem] text-blueGrey-600 dark:text-blueGrey-300">
                        Location of the widget on the conversations screen -
                        right panel is the area beneath the contact information
                        and sendable is the + button in the message input.
                      </span>
                      <RadioButton
                        checked={values.position === "right_panel"}
                        label="Right Panel"
                        onChange={handleChange}
                        value="right_panel"
                      />
                      <RadioButton
                        checked={values.position === "sendable"}
                        label="Sendables"
                        onChange={handleChange}
                        value="sendable"
                      />
                    </RadioGroup>
                    <TextField
                      infoText="The order that the widgets will be displayed to the user, higher priority will display at the top."
                      label="Priority"
                      name="priority"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="99"
                      value={values.priority.toString()}
                      type="number"
                      validation={
                        errors.priority && touched.priority
                          ? { status: "error", text: errors.priority }
                          : undefined
                      }
                    />
                    <div className="flex justify-between">
                      <Button onClick={onClose} size="small" variant="tertiary">
                        Cancel
                      </Button>
                      <Button
                        disabled={isSubmitting || !dirty || !isValid}
                        size="small"
                        type="submit"
                      >
                        Save
                      </Button>
                    </div>
                  </form>
                );
              }}
            </Formik>
          </div>
        )
      }
    >
      {isEdit ? (
        <IconButton
          ariaLabel="Edit Widget"
          icon="edit-underline"
          onClick={() => setOpen(true)}
          plain
        />
      ) : (
        <Button leadingIcon="application-add" onClick={() => setOpen(true)}>
          Add Widget
        </Button>
      )}
    </Dialog>
  );
};

export default WidgetForm;
