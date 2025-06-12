import useWidgetStore, { WidgetEvent } from "@statflo/widget-sdk";

const root = document.getElementById("root");

const { publishEvent } = useWidgetStore.getState();

let account = "";
let device = "";

const getDevice = () => {
  const devices = [
    'Samsung Galaxy S25 Ultra',
    'Apple iPhone 16 Pro Max',
    'Google Pixel 9a',
  ];

  return devices[Math.floor(Math.random() * devices.length)];
}

const render = (state) => {
  const latest = state.getLatestEvent();

  if (latest) {
    switch (latest.type) {
      case "CURRENT_ACCOUNT_ID":
        account = latest.data;
        device = getDevice();

        publishEvent(new WidgetEvent("REPLACE_MESSAGE", `Hi, how are you enjoying your ${device}?`));
        break;
    }
  }

  root.innerHTML = `
    <div class="container g-0 border-top border-2">
      <div class="row justify-content-center no-gutters g-0">
        <h6 class="text-center pt-2">
          Vanilla JS Inventory Widget
        </h6>

        <form
          class="col pt-3 mb-4 border-bottom border-2"
        >
          <fieldset disabled>
            <div class="mb-3">
              <label class="form-label" for="account">
                Account
              </label>
              <input
                name="account"
                class="form-control form-control-sm"
                id="account"
                ${account ? 'value="' + account + '"' : ""}
                readonly
                placeholder="..."
              />
            </div>
            <div class="mb-3">
              <label class="form-label" for="device">
                Device
              </label>
              <input
                name="device"
                class="form-control form-control-sm"
                id="device"
                ${device ? 'value="' + device + '"' : ""}
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
