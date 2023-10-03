import { Button, Icon, TextField, classNames } from "@statflo/ui";
import { RadioGroup } from "@headlessui/react";
import { useState } from "react";
import * as Yup from "yup";
import { LightMode } from "../components/Theme/LightMode";
import { DarkMode } from "../components/Theme/DarkMode";
import { OS } from "../components/Theme/OS";
import { Formik } from "formik";

const themes = [
  {
    id: 1,
    icon: <Icon className="inline mb-1 ml-2" color="blueGrey" icon="sun" />,
    name: "Light",
    preview: <LightMode />,
    value: "light",
  },
  {
    id: 2,
    icon: <Icon className="inline mb-1 ml-2" color="blueGrey" icon="moon" />,
    name: "Dark",
    preview: <DarkMode />,
    value: "dark",
  },
  {
    id: 3,
    name: "Match System",
    value: "os",
    preview: <OS />,
  },
];

const UserSchema = Yup.object().shape({
  carrierId: Yup.number().required(),
  dealerId: Yup.number().required(),
  email: Yup.string().required(),
  language: Yup.string().required(),
});

const Settings = () => {
  const [theme, setTheme] = useState(
    themes.find((el) => el.value === (localStorage?.theme ?? "os"))
  );

  const [token, setToken] = useState(localStorage?.token ?? "1234567");

  const user: User = {
    carrier_id: localStorage?.user?.carrier_id ?? 1,
    dealer_id: localStorage?.user?.dealer_id ?? 1,
    email: localStorage?.user?.email ?? "email@statflo.com",
    language: localStorage?.user?.language ?? "en",
  };

  return (
    <div className="p-8 h-screen w-full flex flex-col gap-8 overflow-scroll bg-blueGrey-50 dark:bg-darkMode-700">
      <h1 className="font-bold">Settings</h1>
      <div>
        <RadioGroup
          className="flex flex-col gap-4"
          value={theme}
          onChange={(option) => {
            setTheme(option);
            if (option.value === "os") localStorage.removeItem("theme");
            else localStorage.theme = option.value;
            window.location.reload();
          }}
        >
          <div>
            <RadioGroup.Label as="h2" className="font-semibold text-20">
              Theme
            </RadioGroup.Label>
            <p className="text-blueGrey-600 dark:text-blueGrey-300">
              Select a theme for how the application will look or have it match
              the preferences set by the system.
            </p>
          </div>
          <div className="flex gap-4">
            {themes.map((theme) => (
              <RadioGroup.Option key={theme.id} value={theme}>
                {({ checked }) => (
                  <div
                    className={classNames(
                      "flex flex-col gap-4 pt-2 px-4 pb-4 rounded-xl shadow-card dark:shadow-transparent dark:border dark:border-blueGrey-800",
                      checked
                        ? "bg-blue-200 dark:bg-blue-400"
                        : "bg-background-light dark:bg-darkMode-600"
                    )}
                  >
                    <span className={classNames(checked && "font-bold")}>
                      {theme.name}
                      {theme?.icon}
                    </span>
                    <div className="w-48">{theme.preview}</div>
                  </div>
                )}
              </RadioGroup.Option>
            ))}
          </div>
        </RadioGroup>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="font-semibold text-20">Authentication Token</h2>
          <p className="text-blueGrey-600 dark:text-blueGrey-300">
            Manually set a token that is used in the{" "}
            <span className="font-semibold">AUTHENTICATION_TOKEN</span> event.
          </p>
        </div>
        <div className="flex gap-4 w-1/3 items-center">
          <TextField
            label="Token"
            name="token"
            onChange={(e) => setToken(e.currentTarget.value)}
            value={token}
          />
          <div className="h-10 flex items-center justify-center mt-1">
            <Button onClick={() => (localStorage.token = token)} size="small">
              Save
            </Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div>
          <h2 className="font-semibold text-20">Authenticated User</h2>
          <p className="text-blueGrey-600 dark:text-blueGrey-300">
            Manually set a user that is used in the{" "}
            <span className="font-semibold">USER_AUTHENTICATED</span> event.
          </p>
        </div>
        <div className="w-1/3">
          <Formik
            initialValues={user}
            onSubmit={async (values, { setSubmitting }) => {
              setSubmitting(true);

              const newUser: User = {
                carrier_id: values.carrier_id,
                dealer_id: values.dealer_id,
                email: values.email,
                language: values.language,
              };

              localStorage.user = newUser;
              setSubmitting(false);
            }}
            validationSchema={UserSchema}
          >
            {({
              values,
              dirty,
              errors,
              touched,
              handleChange,
              handleBlur,
              handleSubmit,
              isSubmitting,
              isValid,
            }) => (
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Carrier ID"
                  name="carrier_id"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="1"
                  value={values.carrier_id.toString()}
                  validation={
                    errors.carrier_id && touched.carrier_id
                      ? { status: "error", text: errors.carrier_id }
                      : undefined
                  }
                />
                <TextField
                  label="Dealer ID"
                  name="dealer_id"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="1"
                  value={values.dealer_id.toString()}
                  validation={
                    errors.dealer_id && touched.dealer_id
                      ? { status: "error", text: errors.dealer_id }
                      : undefined
                  }
                />
                <TextField
                  label="Email"
                  name="email"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="email@statflo.com"
                  value={values.email}
                  validation={
                    errors.email && touched.email
                      ? { status: "error", text: errors.email }
                      : undefined
                  }
                />
                <TextField
                  label="Language"
                  name="language"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  placeholder="en"
                  value={values.language}
                  validation={
                    errors.language && touched.language
                      ? { status: "error", text: errors.language }
                      : undefined
                  }
                />
                <Button
                  disabled={isSubmitting || !dirty || !isValid}
                  size="small"
                  type="submit"
                >
                  Save
                </Button>
              </form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default Settings;
