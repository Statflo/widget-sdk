import useWidgetStore, { WidgetEvent } from "@statflo/widget-sdk";

const root = document.getElementById("root");

const { publishEvent } = useWidgetStore.getState();

// Simulate a token being emitted from the Statflo UI to this widget.
// If you'd like to test with a live token it can be acquired
// at https://app.statflo.com/v2/api/auth/me after first logging in.
publishEvent(new WidgetEvent("TOKEN_UPDATED", "<YOUR TEST TOKEN>"));

let token = "";
let email = "";

const fetchUser = (token) => {
  fetch("https://app.statflo.com/v2/api/auth/me", {
    headers: { authorization: `Bearer ${token}` },
  })
    .then((response) => response.json())
    .then((json) => {
      email = json.user.email;
      render(useWidgetStore.getState());
    })
    .catch(() => {});
};

const render = (state) => {
  const latest = state.getLatestEvent();

  if (latest) {
    switch (latest.type) {
      case "TOKEN_UPDATED":
        token = latest.data;
        fetchUser(token);
        break;
    }
  }

  root.innerHTML = `
    <div class="container g-0 border-top border-2">
      <div class="row justify-content-center no-gutters g-0">
        <h6 class="text-center pt-2">
          Vanilla JS Widget
        </h6>

        <form
          class="col pt-3 mb-4 border-bottom border-2"
        >
          <fieldset disabled>
            <div class="mb-3">
              <label class="form-label" for="Email">
                Current User
              </label>
              <input
                name="email"
                class="form-control form-control-sm"
                id="email"
                ${email ? 'value="' + email + '"' : ""}
                readonly
                placeholder="..."
              />
            </div>
          </fieldset>
          </form>
        </div>
      </div>
`;
};

render(useWidgetStore.getState());

useWidgetStore.subscribe((state) => {
  render(state);
});
